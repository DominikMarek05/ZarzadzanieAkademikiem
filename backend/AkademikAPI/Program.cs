using Microsoft.EntityFrameworkCore;
using AkademikAPI.Data;
using Scalar.AspNetCore;

var builder = WebApplication.CreateBuilder(args);

// Konfiguracja bazy danych PostgreSQL
var connectionString = builder.Configuration.GetConnectionString("DefaultConnection");
builder.Services.AddDbContext<AkademikDbContext>(options =>
    options.UseNpgsql(connectionString));

// Konfiguracja CORS pod aplikację frontendową w React (Vite)
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowReact", policy =>
    {
        policy.WithOrigins("http://localhost:5173")
              .AllowAnyHeader()
              .AllowAnyMethod();
    });
});

builder.Services.AddControllers();
builder.Services.AddOpenApi();

var app = builder.Build();

app.UseCors("AllowReact");

// Inicjalizacja bazy: upewnienie się, że tabela equipment_reservation zawiera kolumny dla przedziałów godzinowych
using (var scope = app.Services.CreateScope())
{
    try
    {
        var db = scope.ServiceProvider.GetRequiredService<AkademikDbContext>();
        db.Database.ExecuteSqlRaw(
            "ALTER TABLE IF EXISTS equipment_reservation ADD COLUMN IF NOT EXISTS start_time TIME, ADD COLUMN IF NOT EXISTS end_time TIME;"
        );
    }
    catch
    {
        // Ignorujemy błąd, jeśli baza nie jest jeszcze w pełni podłączona
    }
}

// Dokumentacja OpenAPI / Scalar w trybie deweloperskim
if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
    app.MapScalarApiReference(options => options.WithOpenApiRoutePattern("/openapi/v1.json"));
}

app.UseHttpsRedirection();
app.MapControllers();
app.Run();
