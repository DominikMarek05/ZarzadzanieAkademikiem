using Microsoft.EntityFrameworkCore;
using AkademikAPI.Models;

namespace AkademikAPI.Data;

public class AkademikDbContext : DbContext
{
	public AkademikDbContext(DbContextOptions<AkademikDbContext> options) : base(options)
	{
	}

	// Ta linijka odpowiada za stworzenie tabeli Rooms na podstawie modelu Room
	public DbSet<Pokoj> Pokoje { get; set; }
}