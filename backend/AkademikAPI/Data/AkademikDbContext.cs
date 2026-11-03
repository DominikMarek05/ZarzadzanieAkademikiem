using Microsoft.EntityFrameworkCore;
using AkademikAPI.Models;

namespace AkademikAPI.Data;

public class AkademikDbContext : DbContext
{
	public AkademikDbContext(DbContextOptions<AkademikDbContext> options) : base(options)
	{
	}

    public DbSet<Pokoj> Pokoje { get; set; }
    public DbSet<SportCourt> SportCourts { get; set; }
    public DbSet<SportCourtReservation> SportCourtReservations { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        // Rejestracja typów wyliczeniowych (enum) specyficznych dla PostgreSQL
        modelBuilder.HasPostgresEnum<Availability>();
        modelBuilder.HasPostgresEnum<SportCourtType>();
        modelBuilder.HasPostgresEnum<RoomPrefix>();

        // Konfiguracja relacji jeden-do-wielu (Jedno boisko ma wiele rezerwacji)
        modelBuilder.Entity<SportCourt>()
            .HasMany(c => c.Reservations)
            .WithOne()
            .HasForeignKey(r => r.SportCourtId);
    }
}
