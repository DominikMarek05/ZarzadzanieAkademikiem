using System.ComponentModel.DataAnnotations.Schema;

namespace AkademikAPI.Models;

/// <summary>
/// Reprezentuje profil studenta w tabeli students.
/// Zgodnie z wymaganiem logowanie weryfikuje wyłącznie tę tabelę.
/// </summary>
[Table("students", Schema = "public")]
public class Student
{
    [Column("id")]
    public int Id { get; set; }

    [Column("user_id")]
    public int UserId { get; set; }

    [Column("student_number")]
    public string StudentNumber { get; set; } = "";

    [Column("field_of_study")]
    public string FieldOfStudy { get; set; } = "";

    [Column("year_of_study")]
    public int YearOfStudy { get; set; }

    [Column("room_id")]
    public int RoomId { get; set; }
}
