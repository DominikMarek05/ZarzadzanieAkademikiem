using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using AkademikAPI.Data;

namespace AkademikAPI.Controllers;

/// <summary>
/// Kontroler uwierzytelniania studenta.
/// Zgodnie z wymaganiami logowanie weryfikuje wyłącznie tabelę 'students'.
/// </summary>
[ApiController]
[Route("api/[controller]")]
public class AuthController : ControllerBase
{
    private readonly AkademikDbContext _context;

    public AuthController(AkademikDbContext context)
    {
        _context = context;
    }

    /// <summary>
    /// Logowanie studenta na podstawie numeru indeksu z tabeli students.
    /// </summary>
    [HttpPost("login")]
    public async Task<IActionResult> Login([FromBody] LoginRequest request)
    {
        if (request == null || string.IsNullOrWhiteSpace(request.StudentNumber))
        {
            return BadRequest("Numer indeksu/albumu studenta jest wymagany.");
        }

        var normalizedNumber = request.StudentNumber.Trim();

        // Kluczowe wymaganie: weryfikacja wyłącznie w tabeli students
        var student = await _context.Students
            .FirstOrDefaultAsync(s => s.StudentNumber == normalizedNumber);

        if (student == null)
        {
            return Unauthorized(new { message = "Nie znaleziono studenta o podanym numerze indeksu w tabeli students." });
        }

        return Ok(new
        {
            message = "Logowanie udane.",
            student = new
            {
                id = student.Id,
                userId = student.UserId,
                studentNumber = student.StudentNumber,
                fieldOfStudy = student.FieldOfStudy,
                yearOfStudy = student.YearOfStudy,
                roomId = student.RoomId
            }
        });
    }

    /// <summary>
    /// Pobranie profilu studenta po Id (wyłącznie z tabeli students).
    /// </summary>
    [HttpGet("student/{id:int}")]
    public async Task<IActionResult> GetStudent(int id)
    {
        var student = await _context.Students.FirstOrDefaultAsync(s => s.Id == id);
        return student == null ? NotFound("Nie znaleziono studenta.") : Ok(student);
    }
}

public class LoginRequest
{
    public string StudentNumber { get; set; } = "";
}
