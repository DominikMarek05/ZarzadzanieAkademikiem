namespace AkademikAPI.Models;

public class Pokoj
{
	public int Id { get; set; }

	public required string NumerPokoju { get; set; }

	public int Pietro { get; set; }

	public int LiczbaOsob { get; set; }
    
	public bool CzyWolneLozka { get; set; } = true;
}
