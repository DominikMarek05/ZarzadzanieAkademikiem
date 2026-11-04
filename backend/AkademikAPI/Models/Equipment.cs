using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;

namespace AkademikAPI.Models;

/// <summary>
/// Reprezentuje pralkę lub suszarkę w akademiku (tabela equipment).
/// </summary>
[Table("equipment", Schema = "public")]
public class Equipment
{
    [Column("id")]
    public int Id { get; set; }

    [Column("dormitory_id")]
    public int DormitoryId { get; set; }

    [Column("floor")]
    public int Floor { get; set; }

    [Column("type")]
    public string Type { get; set; } = "";

    [Column("equipment_number")]
    public string EquipmentNumber { get; set; } = "";

    [Column("status")]
    public string Status { get; set; } = "";

    public List<EquipmentReservation> Reservations { get; set; } = new();
}

/// <summary>
/// Reprezentuje rezerwację pralki/suszarki dokonaną przez studenta (tabela equipment_reservation).
/// </summary>
[Table("equipment_reservation", Schema = "public")]
public class EquipmentReservation
{
    [Column("id")]
    public int Id { get; set; }

    [Column("equipment_id")]
    public int EquipmentId { get; set; }

    [Column("student_id")]
    public int StudentId { get; set; }

    [Column("reservation_date")]
    public DateOnly ReservationDate { get; set; }

    [Column("start_time")]
    public TimeSpan? StartTime { get; set; }

    [Column("end_time")]
    public TimeSpan? EndTime { get; set; }
}
