using System.ComponentModel.DataAnnotations.Schema;

namespace AkademikAPI.Models;

[Table("unit")]
public class Unit
{
    [Column("id")]
    public int Id { get; set; }

    [Column("dormitory_id")]
    public int DormitoryId { get; set; }

    [Column("unit_number")]
    public int UnitNumber { get; set; }

}
