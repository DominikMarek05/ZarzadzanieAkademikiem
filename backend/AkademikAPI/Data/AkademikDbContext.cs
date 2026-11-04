using Microsoft.EntityFrameworkCore;
using AkademikAPI.Models;

namespace AkademikAPI.Data;

/// <summary>
/// Główny kontekst bazy danych aplikacji AkademikAPI
/// </summary>
public class AkademikDbContext : DbContext
{
    public AkademikDbContext(DbContextOptions<AkademikDbContext> options) : base(options) { }

    public DbSet<Pokoj> Pokoje { get; set; }
    public DbSet<SportCourt> SportCourts { get; set; }
    public DbSet<SportCourtReservation> SportCourtReservations { get; set; }
    public DbSet<Student> Students { get; set; }
    public DbSet<Equipment> Equipment { get; set; }
    public DbSet<EquipmentReservation> EquipmentReservations { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        // Relacja: Boisko sportowe posiada wiele rezerwacji
        modelBuilder.Entity<SportCourt>()
            .HasMany(c => c.Reservations)
            .WithOne()
            .HasForeignKey(r => r.SportCourtId);

        // Relacja: Urządzenie (pralka/suszarka) posiada wiele rezerwacji
        modelBuilder.Entity<Equipment>()
            .HasMany(e => e.Reservations)
            .WithOne()
            .HasForeignKey(r => r.EquipmentId);
    }
}
