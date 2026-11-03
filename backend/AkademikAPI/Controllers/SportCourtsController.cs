using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using AkademikAPI.Data;
using AkademikAPI.Models;

namespace AkademikApi.Controllers;

[ApiController]
[Route("api/[controller]")]
public class SportCourtsController : ControllerBase
{
    private readonly AkademikDbContext _context;

    public SportCourtsController(AkademikDbContext context)
    {
        _context = context;
    }

    [HttpGet("availability")]
    public async Task<IActionResult> GetAvailability([FromQuery] DateTime date)
    {
        var dateUtc = DateTime.SpecifyKind(date.Date, DateTimeKind.Utc);

        // Pobieramy boiska wraz z rezerwacjami z konkretnego dnia przez EF Core
        var courts = await _context.SportCourts
            .Include(c => c.Reservations.Where(r => r.ReservationDate == dateUtc))
            .OrderBy(c => c.Id)
            .ToListAsync();

        var result = courts.Select(court =>
        {
            var slots = Enumerable.Range(0, 12).Select(index =>
            {
                var start = TimeSpan.FromHours(index * 2);
                var end = TimeSpan.FromHours(index * 2 + 2);

                // Sprawdzenie dostępności slotu (porównanie struktur enum)
                bool available = court.Status.Equals("Available", StringComparison.OrdinalIgnoreCase)
                    && !court.Reservations.Any(r =>
                        r.StartTime.HasValue && r.EndTime.HasValue &&
                        r.StartTime.Value < end &&
                        r.EndTime.Value > start
                    );

                return new
                {
                    startTime = start.ToString(@"hh\:mm"),
                    endTime = end == TimeSpan.FromHours(24) ? "00:00" : end.ToString(@"hh\:mm"),
                    available
                };
            }).ToList();

            return new
            {
                id = court.Id,
                courtType = court.CourtType,
                status = court.Status,
                slots
            };
        }).ToList();

        return Ok(result);
    }
}
