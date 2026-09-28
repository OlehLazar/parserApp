using Microsoft.EntityFrameworkCore;
using ParserApp.Api.Entities;

namespace ParserApp.Api.Data;

public class AppDbContext : DbContext
{
	public AppDbContext(DbContextOptions options) : base(options)
	{
	}

	public DbSet<Product> Products => Set<Product>();
}
