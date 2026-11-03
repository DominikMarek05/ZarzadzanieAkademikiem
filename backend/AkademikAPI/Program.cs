using Scalar.AspNetCore;
using Microsoft.EntityFrameworkCore;
using AkademikAPI.Data;
using AkademikAPI.Models;
using Npgsql;

var builder = WebApplication.CreateBuilder(args);

builder.Configuration.AddJsonFile(
    "appsettings.json",
    optional: false,
    reloadOnChange: true
);

// Add services to the container.
builder.Services.AddOpenApi();

var connectionString = builder.Configuration.GetConnectionString("DefaultConnection");
var dataSourceBuilder = new NpgsqlDataSourceBuilder(connectionString);

dataSourceBuilder.MapEnum<Availability>();
dataSourceBuilder.MapEnum<SportCourtType>();
dataSourceBuilder.MapEnum<RoomPrefix>();

var dataSource = dataSourceBuilder.Build();

builder.Services.AddDbContext<AkademikDbContext>(options =>
	options.UseNpgsql(builder.Configuration.GetConnectionString("DefaultConnection")));

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

var app = builder.Build();

app.UseCors("AllowReact");
// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
    app.MapScalarApiReference(options =>
    {
        options.WithOpenApiRoutePattern("/openapi/v1.json");
    });
}

app.UseHttpsRedirection();

app.MapControllers();
app.Run();
