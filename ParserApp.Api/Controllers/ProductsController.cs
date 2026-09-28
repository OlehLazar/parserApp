using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ParserApp.Api.Data;
using ParserApp.Api.Entities;
using ParserApp.Api.Services;

namespace ParserApp.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ProductsController : ControllerBase
{
	private readonly AppDbContext _context;
	private readonly FoxtrotScraperService _scraper;

	public ProductsController(
		AppDbContext context,
		FoxtrotScraperService scraper)
	{
		_context = context;
		_scraper = scraper;
	}

	[HttpGet]
	public async Task<IActionResult> GetAll()
	{
		return Ok(await _context.Products.ToListAsync());
	}

	[HttpPost("parse")]
	public async Task<IActionResult> ParseProducts([FromBody] string url)
	{
		if (string.IsNullOrWhiteSpace(url))
			return BadRequest("URL порожній.");

		await _scraper.ParseAndSaveAsync(url);

		return Ok(new
		{
			message = "Товари успішно відпарсено та збережено"
		});
	}

	[HttpPut("{id}")]
	public async Task<IActionResult> Update(
		int id,
		[FromBody] Product updatedProduct)
	{
		var product = await _context.Products.FindAsync(id);

		if (product == null)
			return NotFound();

		product.Name = updatedProduct.Name;
		product.Description = updatedProduct.Description;
		product.ImageUrl = updatedProduct.ImageUrl;

		await _context.SaveChangesAsync();

		return NoContent();
	}

	[HttpDelete("{id}")]
	public async Task<IActionResult> Delete(int id)
	{
		var product = await _context.Products.FindAsync(id);

		if (product == null)
			return NotFound();

		_context.Products.Remove(product);

		await _context.SaveChangesAsync();

		return NoContent();
	}
}
