using System.ComponentModel.DataAnnotations.Schema;

namespace AkademikAPI.Models;

[Table("accommodation_applications")]
public class AccommodationApplications
{
    [Column("id")]
    public int Id { get; set; }

    [Column("student_id")]
    public int StudentId { get; set; }

    [Column("status")]
    public string Status { get; set; } = "Accepted";

    [Column("submission_date")]
    public DateOnly SubmissionDate { get; set; } = DateOnly.FromDateTime(DateTime.UtcNow);
}
