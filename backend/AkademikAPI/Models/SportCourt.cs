using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;

namespace AkademikAPI.Models;

public enum Availability { Available, Unavailable, Maintenance }
public enum SportCourtType { Basketball, Volleyball, Football }

/// <summary>
/// Reprezentuje obiekt sportowy (tabela sport_courts).
/// </summary>
[Table("sport_courts", Schema = "public")]
public class SportCourt
{
    [Column("id")]
    public int Id { get; set; }

    [Column("court_name")]
    public string CourtName { get; set; } = "";

    [Column("court_type")]
    public string CourtType { get; set; } = "";

    [Column("status")]
    public string Status { get; set; } = "";

    // Relacja: jedno boisko ma wiele rezerwacji
    public List<SportCourtReservation> Reservations { get; set; } = new();
}

/// <summary>
/// Reprezentuje rezerwację obiektu sportowego (tabela sport_courts_reservation).
/// </summary>
[Table("sport_courts_reservation", Schema = "public")]
public class SportCourtReservation
{
    [Column("id")]
    public int Id { get; set; }

    [Column("sport_court_id")]
    public int SportCourtId { get; set; }

    [Column("student_id")]
    public int StudentId { get; set; }

    [Column("reservation_date")]
    public DateOnly ReservationDate { get; set; }

    [Column("start_time")]
    public TimeSpan? StartTime { get; set; }

    [Column("end_time")]
    public TimeSpan? EndTime { get; set; }
}
