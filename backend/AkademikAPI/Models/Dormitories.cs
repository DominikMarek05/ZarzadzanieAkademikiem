using System.ComponentModel.DataAnnotations.Schema;

namespace AkademikAPI.Models;

[Table("dormitories")]
public class Dormitories
{
    [Column("id")]
    public int Id { get; set; }

    [Column("name")]
    public string Name { get; set; } = string.Empty;

    [Column("address")]
    public string Address { get; set; } = string.Empty;

    [Column("city")]
    public string City { get; set; } = string.Empty;

    [Column("description")]
    public string? Description { get; set; }
}
