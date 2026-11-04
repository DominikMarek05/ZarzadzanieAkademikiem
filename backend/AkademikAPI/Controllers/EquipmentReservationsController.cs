using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using AkademikAPI.Data;
using AkademikAPI.Models;
using AkademikAPI.Helpers;
using System.Data;

namespace AkademikAPI.Controllers;

/// <summary>
/// Kontroler rezerwacji pralek i suszarek.
/// Działa bezpośrednio na tabeli equipment_reservation w stylu identycznym do boisk sportowych.
/// </summary>
[ApiController]
[Route("api/[controller]")]
public class EquipmentReservationsController : ControllerBase
{
    private readonly AkademikDbContext _context;

    public EquipmentReservationsController(AkademikDbContext context)
    {
        _context = context;
    }

    /// <summary>
    /// Pobiera dostępność pralek i suszarek dla danego dnia, piętra i typu urządzenia z 12 slotami czasowymi.
    /// </summary>
    [HttpGet("availability")]
    public async Task<IActionResult> GetAvailability(
        [FromQuery] DateTime date,
        [FromQuery] int? floor,
        [FromQuery] string? type)
    {
        var selectedDate = DateOnly.FromDateTime(date);

        // Filtrowanie urządzeń po piętrze oraz typie (obsługuje polskie i angielskie nazwy)
        var query = _context.Equipment.AsQueryable();

        if (floor.HasValue)
        {
            query = query.Where(e => e.Floor == floor.Value);
        }

        if (!string.IsNullOrWhiteSpace(type))
        {
            var t = type.Trim();
            if (t.Equals("Pralka", StringComparison.OrdinalIgnoreCase) || t.Equals("Pralki", StringComparison.OrdinalIgnoreCase) || t.Equals("Washing Machine", StringComparison.OrdinalIgnoreCase))
                query = query.Where(e => e.Type == "Washing Machine");
            else if (t.Equals("Suszarka", StringComparison.OrdinalIgnoreCase) || t.Equals("Suszarki", StringComparison.OrdinalIgnoreCase) || t.Equals("Dryer", StringComparison.OrdinalIgnoreCase))
                query = query.Where(e => e.Type == "Dryer");
        }

        var equipmentList = await query.OrderBy(e => e.Floor).ThenBy(e => e.EquipmentNumber).ToListAsync();

        // Pobranie rezerwacji z bazy (tabela equipment_reservation) na dany dzień
        var equipmentIds = equipmentList.Select(e => e.Id).ToList();
        var reservations = await _context.EquipmentReservations
            .Where(r => r.ReservationDate == selectedDate && equipmentIds.Contains(r.EquipmentId))
            .ToListAsync();

        // Mapowanie każdego urządzenia na obiekt zawierający 12 dwugodzinnych slotów
        var result = equipmentList.Select(item =>
        {
            var itemRes = reservations
                .Where(r => r.EquipmentId == item.Id)
                .Select(r => (r.StartTime, r.EndTime));

            return new
            {
                id = item.Id,
                equipmentNumber = item.EquipmentNumber,
                type = item.Type,
                floor = item.Floor,
                dormitoryId = item.DormitoryId,
                status = item.Status,
                slots = SlotHelper.GenerateSlots(item.Status, itemRes)
            };
        });

        return Ok(result);
    }

    /// <summary>
    /// Tworzy rezerwację pralki lub suszarki w tabeli equipment_reservation.
    /// Wykorzystuje transakcję Serializable w celu zabezpieczenia przed podwójną rezerwacją.
    /// </summary>
    [HttpPost("reserve")]
    public async Task<IActionResult> Reserve([FromBody] EquipmentReservationRequest request)
    {
        int studentId = request.StudentId.HasValue && request.StudentId.Value > 0 ? request.StudentId.Value : 1;

        // 1. Walidacja formatu i długości slotu (dokładnie 2 godziny)
        if (!SlotHelper.TryValidateTwoHourSlot(request.StartTime, request.EndTime, out var start, out var end, out var error))
        {
            return BadRequest(error);
        }

        var reservationDate = DateOnly.FromDateTime(request.ReservationDate);

        // 2. Blokada transakcyjna (Serializable) zabezpiecza przed race-condition
        await using var transaction = await _context.Database.BeginTransactionAsync(IsolationLevel.Serializable);

        var equipment = await _context.Equipment.FirstOrDefaultAsync(e => e.Id == request.EquipmentId);
        if (equipment == null)
            return NotFound("Nie znaleziono wybranego urządzenia.");

        if (!equipment.Status.Equals("Available", StringComparison.OrdinalIgnoreCase))
            return Conflict("To urządzenie jest obecnie niedostępne.");

        // 3. Sprawdzenie, czy termin nie koliduje z inną rezerwacją w equipment_reservation
        bool isReserved = await _context.EquipmentReservations.AnyAsync(r =>
            r.EquipmentId == request.EquipmentId &&
            r.ReservationDate == reservationDate &&
            (
                (!r.StartTime.HasValue && !r.EndTime.HasValue) ||
                (r.StartTime.HasValue && r.EndTime.HasValue && r.StartTime.Value < end && r.EndTime.Value > start)
            )
        );

        if (isReserved)
            return Conflict("Ten termin jest już zarezerwowany.");

        // 4. Utworzenie wpisu w tabeli equipment_reservation
        var reservation = new EquipmentReservation
        {
            EquipmentId = request.EquipmentId,
            StudentId = studentId,
            ReservationDate = reservationDate,
            StartTime = start,
            EndTime = end
        };

        _context.EquipmentReservations.Add(reservation);
        await _context.SaveChangesAsync();
        await transaction.CommitAsync();

        return Ok(new
        {
            message = "Rezerwacja pralki/suszarki została pomyślnie utworzona.",
            reservationId = reservation.Id
        });
    }

    /// <summary>
    /// Zwraca listę rezerwacji przypisanych do zalogowanego studenta.
    /// </summary>
    [HttpGet("my")]
    public async Task<IActionResult> GetMyReservations([FromQuery] int studentId)
    {
        var reservations = await _context.EquipmentReservations
            .Where(r => r.StudentId == studentId)
            .OrderByDescending(r => r.ReservationDate)
            .ThenByDescending(r => r.StartTime)
            .ToListAsync();

        var equipmentIds = reservations.Select(r => r.EquipmentId).Distinct().ToList();
        var equipments = await _context.Equipment
            .Where(e => equipmentIds.Contains(e.Id))
            .ToDictionaryAsync(e => e.Id);

        var result = reservations.Select(r =>
        {
            equipments.TryGetValue(r.EquipmentId, out var eq);
            return new
            {
                id = r.Id,
                equipmentId = r.EquipmentId,
                equipmentNumber = eq?.EquipmentNumber ?? "Nieznane",
                type = eq?.Type ?? "Urządzenie",
                floor = eq?.Floor ?? 0,
                reservationDate = r.ReservationDate.ToString("yyyy-MM-dd"),
                startTime = r.StartTime?.ToString(@"hh\:mm") ?? "00:00",
                endTime = r.EndTime == TimeSpan.FromHours(24) ? "00:00" : (r.EndTime?.ToString(@"hh\:mm") ?? "23:59")
            };
        });

        return Ok(result);
    }
}

public class EquipmentReservationRequest
{
    public int EquipmentId { get; set; }
    public DateTime ReservationDate { get; set; }
    public string StartTime { get; set; } = "";
    public string EndTime { get; set; } = "";
    public int? StudentId { get; set; }
}
