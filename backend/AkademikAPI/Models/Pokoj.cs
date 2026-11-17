using System.ComponentModel.DataAnnotations.Schema;
using NpgsqlTypes;

namespace AkademikAPI.Models;

// Definiujemy enum odpowiadający typowi 'room_prefix' w bazie PostgreSQL
public enum RoomPrefix
{
    [PgName("A")]
    A,

    [PgName("B")]
    B
}

[Table("room")] // Wskazuje EF Core, że tabela w bazie nazywa się "room"
public class Pokoj
{
    [Column("id")]
    public int Id { get; set; }

    [Column("unit_id")]
    public int UnitId { get; set; }

    [Column("room_prefix")]
    public RoomPrefix RoomPrefix { get; set; }

    [Column("capacity")]
    public int Capacity { get; set; } = 2;
}
