using System.ComponentModel.DataAnnotations.Schema;
using NpgsqlTypes;

namespace AkademikAPI.Models;

public enum UserRole
{
    [PgName("Student")]
    Student,

    [PgName("Worker")]
    Worker
}

[Table("users")]
public class Users
{
    [Column("id")]
    public int Id { get; set; }

    [Column("first_name")]
    public string FirstName { get; set; } = string.Empty;

    [Column("last_name")]
    public string LastName { get; set; } = string.Empty;

    [Column("email")]
    public string Email { get; set; } = string.Empty;

    [Column("password_hash")]
    public string PasswordHash { get; set; } = string.Empty;

    [Column("role")]
    public UserRole Role { get; set; } = UserRole.Student;
}
