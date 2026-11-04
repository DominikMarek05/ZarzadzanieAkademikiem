using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using AkademikAPI.Data;
using AkademikAPI.Models;
using AkademikAPI.Helpers;
using System.Data;

namespace AkademikAPI.Controllers;

/// <summary>
/// Kontroler rezerwacji boisk sportowych (tabela sport_courts oraz sport_courts_reservation)
/// </summary>
[ApiController]
[Route("api/[controller]")]
public class SportCourtsController : ControllerBase
{
    private readonly AkademikDbContext _context;

    public SportCourtsController(AkademikDbContext context)
    {
        _context = context;
    }

    /// <summary>
    /// Pobieranie dostępności boisk na dany dzień w 12 dwugodzinnych slotach
    /// </summary>
    [HttpGet("availability")]
    public async Task<IActionResult> GetAvailability([FromQuery] DateTime date)
    {
        var selectedDate = DateOnly.FromDateTime(date);

        var courts = await _context.SportCourts.OrderBy(c => c.Id).ToListAsync();

        var reservations = await _context.SportCourtReservations
            .Where(r => r.ReservationDate == selectedDate)
            .ToListAsync();

        var result = courts.Select(court =>
        {
            var courtRes = reservations
                .Where(r => r.SportCourtId == court.Id)
                .Select(r => (r.StartTime, r.EndTime));

            return new
            {
                id = court.Id,
                courtType = court.CourtType,
                status = court.Status,
                slots = SlotHelper.GenerateSlots(court.Status, courtRes)
            };
        });

        return Ok(result);
    }

    /// <summary>
    /// Rezerwowanie wybranego boiska w transakcji Serializable
    /// </summary>
    [HttpPost("reserve")]
    public async Task<IActionResult> Reserve([FromBody] ReservationRequest request)
    {
        int studentId = request.StudentId.HasValue && request.StudentId.Value > 0 ? request.StudentId.Value : 1;

        // 1. Walidacja formatu i długości slotu (dokładnie 2 godziny)
        if (!SlotHelper.TryValidateTwoHourSlot(request.StartTime, request.EndTime, out var start, out var end, out var error))
        {
            return BadRequest(error);
        }

        var reservationDate = DateOnly.FromDateTime(request.ReservationDate);

        // 2. Blokada transakcyjna (Serializable)
        await using var transaction = await _context.Database.BeginTransactionAsync(IsolationLevel.Serializable);

        var court = await _context.SportCourts.FirstOrDefaultAsync(c => c.Id == request.CourtId);
        if (court == null)
            return NotFound("Nie znaleziono wybranego boiska.");

        if (!court.Status.Equals("Available", StringComparison.OrdinalIgnoreCase))
            return Conflict("To boisko jest obecnie niedostępne.");

        // 3. Sprawdzenie, czy termin nie jest już zajęty
        bool isReserved = await _context.SportCourtReservations.AnyAsync(r =>
            r.SportCourtId == request.CourtId &&
            r.ReservationDate == reservationDate &&
            r.StartTime.HasValue &&
            r.EndTime.HasValue &&
            r.StartTime.Value < end &&
            r.EndTime.Value > start
        );

        if (isReserved)
            return Conflict("Ten termin jest już zarezerwowany.");

        // 4. Utworzenie rezerwacji
        var reservation = new SportCourtReservation
        {
            SportCourtId = request.CourtId,
            StudentId = studentId,
            ReservationDate = reservationDate,
            StartTime = start,
            EndTime = end
        };

        _context.SportCourtReservations.Add(reservation);
        await _context.SaveChangesAsync();
        await transaction.CommitAsync();

        return Ok(new
        {
            message = "Rezerwacja została pomyślnie utworzona.",
            reservationId = reservation.Id
        });
    }

    /// <summary>
    /// Pobranie rezerwacji boisk przypisanych do studenta
    /// </summary>
    [HttpGet("my")]
    public async Task<IActionResult> GetMyReservations([FromQuery] int studentId)
    {
        var reservations = await _context.SportCourtReservations
            .Where(r => r.StudentId == studentId)
            .OrderByDescending(r => r.ReservationDate)
            .ThenByDescending(r => r.StartTime)
            .ToListAsync();

        var courtIds = reservations.Select(r => r.SportCourtId).Distinct().ToList();
        var courts = await _context.SportCourts
            .Where(c => courtIds.Contains(c.Id))
            .ToDictionaryAsync(c => c.Id);

        var result = reservations.Select(r =>
        {
            courts.TryGetValue(r.SportCourtId, out var court);
            return new
            {
                id = r.Id,
                sportCourtId = r.SportCourtId,
                courtName = court?.CourtName ?? "Boisko",
                courtType = court?.CourtType ?? "",
                reservationDate = r.ReservationDate.ToString("yyyy-MM-dd"),
                startTime = r.StartTime?.ToString(@"hh\:mm") ?? "00:00",
                endTime = r.EndTime == TimeSpan.FromHours(24) ? "00:00" : (r.EndTime?.ToString(@"hh\:mm") ?? "23:59")
            };
        });

        return Ok(result);
    }

    public class ReservationRequest
    {
        public int CourtId { get; set; }
        public DateTime ReservationDate { get; set; }
        public string StartTime { get; set; } = "";
        public string EndTime { get; set; } = "";
        public int? StudentId { get; set; }
    }
}
