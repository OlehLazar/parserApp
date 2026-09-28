using Microsoft.EntityFrameworkCore;
using ParserApp.Api.Data;
using ParserApp.Api.Services;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddControllers();

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

builder.Services.AddCors(options =>
{
	options.AddPolicy("AllowReactApp",
		policy =>
		{
			policy.WithOrigins("http://localhost:5173")
				  .AllowAnyHeader()
				  .AllowAnyMethod();
		});
});

builder.Services.AddDbContext<AppDbContext>(options =>
	options.UseSqlite(
		builder.Configuration.GetConnectionString("DefaultConnection")));

builder.Services.AddHttpClient<FoxtrotScraperService>(client =>
{
	client.DefaultRequestHeaders.Add(
		"User-Agent",
		"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 " +
		"(KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36");

	client.DefaultRequestHeaders.Add(
		"Accept-Language",
		"uk-UA,uk;q=0.9,en-US;q=0.8,en;q=0.7");
});

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
	app.UseSwagger();
	app.UseSwaggerUI();
}

app.UseCors("AllowReactApp");

app.UseHttpsRedirection();

app.UseAuthorization();

app.MapControllers();

app.Run();
