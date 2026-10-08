using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using AkademikAPI.Data;
using AkademikAPI.Models;

namespace AkademikAPI.Controllers;

[ApiController]
[Route("api/[controller]")]

public class PokojeController : ControllerBase
{
	private readonly AkademikDbContext _context;

	public PokojeController(AkademikDbContext context){
		_context = context;
	}

	[HttpGet]
	public async Task<ActionResult<IEnumerable<Pokoj>>> getPokoje(){
		return await _context.Pokoje.ToListAsync();
	}

	[HttpPost]
	public async Task<ActionResult<IEnumerable<Pokoj>>> PostPokoj(Pokoj nowyPokoj) { 
		_context.Pokoje.Add(nowyPokoj);
		await _context.SaveChangesAsync();
		return CreatedAtAction(nameof(getPokoje), new { id = nowyPokoj.Id }, nowyPokoj);
	}
}
