using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using AkademikAPI.Data;
using AkademikAPI.Models;

namespace AkademikAPI.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ZakwaterowanieController : ControllerBase
{
    private readonly AkademikDbContext _context;

    public ZakwaterowanieController(AkademikDbContext context)
    {
        _context = context;
    }

    [HttpPost("/api/auth/register")]
    public async Task<IActionResult> RegisterCandidate([FromBody] RejestracjaKandydataDto dto)
    {
        if (await _context.Students.AnyAsync(s => s.StudentNumber == dto.StudentNumber))
            return BadRequest(new { message = "Podany numer indeksu jest już zarejestrowany." });

        if (await _context.Users.AnyAsync(u => u.Email == dto.Email))
            return BadRequest(new { message = "Podany adres e-mail jest już zajęty." });

        var uzytkownik = new Users
        {
            FirstName = dto.FirstName,
            LastName = dto.LastName,
            Email = dto.Email,
            PasswordHash = "hash",
            Role = UserRole.student
        };
        _context.Users.Add(uzytkownik);
        await _context.SaveChangesAsync();

        // Zapisanie kandydata w tabeli students bez przypisanego pokoju
        var student = new Student
        {
            UserId = uzytkownik.Id,
            StudentNumber = dto.StudentNumber,
            FieldOfStudy = dto.FieldOfStudy,
            YearOfStudy = dto.YearOfStudy,
            RoomId = -1
        };
        _context.Students.Add(student);
        await _context.SaveChangesAsync();

        // Automatyczne utworzenie zaakceptowanego wniosku o zakwaterowanie
        var wniosek = new AccommodationApplications
        {
            StudentId = student.Id,
            Status = "Accepted"
        };
        _context.AccommodationApplications.Add(wniosek);
        await _context.SaveChangesAsync();

        return Ok(new
        {
            student = new
            {
                student.Id,
                student.StudentNumber,
                Name = $"{uzytkownik.FirstName} {uzytkownik.LastName}",
                student.RoomId
            }
        });
    }

    // Sprawdzenie wniosku kandydata
    [HttpGet("wniosek/{studentId}")]
    public async Task<IActionResult> SprawdzWniosek(int studentId)
    {
        var wniosek = await _context.AccommodationApplications
            .FirstOrDefaultAsync(w => w.StudentId == studentId && w.Status == "Accepted");

        if (wniosek == null)
            return NotFound(new { message = "Brak zaakceptowanego wniosku o przydział miejsca." });

        return Ok(wniosek);
    }

    // Pobranie listy domów studenckich
    [HttpGet("akademiki")]
    public async Task<IActionResult> PobierzAkademiki()
    {
        var akademiki = await _context.Dormitories
            .Select(a => new
            {
                a.Id,
                a.Name,
                a.Address,
                a.City,
                a.Description
            })
            .ToListAsync();

        return Ok(akademiki);
    }

    // Pobranie wolnych pokoi dla wybranego akademika
    [HttpGet("akademiki/{akademikId}/pokoje")]
    public async Task<IActionResult> PobierzPokoje(int akademikId)
    {
        var pokoje = await (from p in _context.Pokoje
                            join s in _context.Units on p.UnitId equals s.Id
                            where s.DormitoryId == akademikId
                            select new
                            {
                                p.Id,
                                RoomNumber = $"{s.UnitNumber}/{p.RoomPrefix}",
                                Floor = s.Floor,
                                p.Capacity,
                                OccupiedBeds = _context.Students.Count(st => st.RoomId == p.Id)
                            }).ToListAsync();

        return Ok(pokoje);
    }

    // 5. Przydzielenie pokoju kandydatowi
    [HttpPost("przydziel")]
    public async Task<IActionResult> PrzydzielPokoj([FromBody] PrzydzialPokojuDto dto)
    {
        var student = await _context.Students.FindAsync(dto.StudentId);
        if (student == null)
            return NotFound(new { message = "Nie znaleziono kandydata." });

        var pokojInfo = await (from p in _context.Pokoje
                               join s in _context.Units on p.UnitId equals s.Id
                               join a in _context.Dormitories on s.DormitoryId equals a.Id
                               where p.Id == dto.RoomId
                               select new { Pokoj = p, Unit = s, Dormitories = a })
                               .FirstOrDefaultAsync();

        if (pokojInfo == null)
            return NotFound(new { message = "Nie znaleziono wybranego pokoju." });

        int zajeteLozka = await _context.Students.CountAsync(st => st.RoomId == dto.RoomId);
        if (zajeteLozka >= pokojInfo.Pokoj.Capacity)
            return Conflict(new { message = "Wybrany pokój został właśnie zajęty." });

        // Zapisanie pokoju studentowi oraz zmiana statusu wniosku
        student.RoomId = dto.RoomId;

        var wniosek = await _context.AccommodationApplications
            .FirstOrDefaultAsync(w => w.StudentId == student.Id);
        if (wniosek != null)
            wniosek.Status = "Assigned";

        await _context.SaveChangesAsync();

        return Ok(new
        {
            dormitoryName = pokojInfo.Dormitories.Name,
            dormitoryAddress = $"{pokojInfo.Dormitories.Address}, {pokojInfo.Dormitories.City}",
            roomNumber = $"{pokojInfo.Unit.UnitNumber}/{pokojInfo.Pokoj.RoomPrefix}",
            floor = pokojInfo.Unit.Floor
        });
    }
}

public record RejestracjaKandydataDto(string StudentNumber, string FirstName, string LastName, string Email, string FieldOfStudy, int YearOfStudy);
public record PrzydzialPokojuDto(int StudentId, int RoomId);
