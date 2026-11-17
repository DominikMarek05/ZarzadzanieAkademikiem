using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using AkademikAPI.Data;

namespace AkademikAPI.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AuthController : ControllerBase
{
    private readonly AkademikDbContext _context;

    public AuthController(AkademikDbContext context)
    {
        _context = context;
    }

    [HttpPost("login")]
    public async Task<IActionResult> Login([FromBody] LoginRequest request)
    {
        if (request == null || string.IsNullOrWhiteSpace(request.StudentNumber))
        {
            return BadRequest("Numer indeksu/albumu studenta jest wymagany.");
        }

        var normalizedNumber = request.StudentNumber.Trim();

        // Weryfikacja wyłącznie w tabeli students
        var student = await _context.Students
            .FirstOrDefaultAsync(s => s.StudentNumber == normalizedNumber);

        if (student == null)
        {
            return Unauthorized(new { message = "Nie znaleziono studenta o podanym numerze indeksu w tabeli students." });
        }

        // Pobranie imienia i nazwiska z tabeli users na podstawie klucza student.UserId
        var user = await _context.Users
            .FirstOrDefaultAsync(u => u.Id == student.UserId);

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
                roomId = student.RoomId,
                name = user != null ? $"{user.FirstName} {user.LastName}" : null
            }
        });
    }

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
