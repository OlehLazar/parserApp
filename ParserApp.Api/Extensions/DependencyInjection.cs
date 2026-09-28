using Microsoft.EntityFrameworkCore;
using ParserApp.Api.Constants;
using ParserApp.Api.Data;
using ParserApp.Api.Services;
using ParserApp.Api.Settings;

namespace ParserApp.Api.Extensions;

public static class DependencyInjection
{
	public static IServiceCollection AddDatabase(this IServiceCollection services, IConfiguration configuration)
	{
		var databaseSettings = configuration.GetSection(DatabaseSettings.SectionName).Get<DatabaseSettings>();

		services.AddDbContext<AppDbContext>(options => options.UseSqlite(databaseSettings!.ConnectionString));

		return services;
	}

	public static IServiceCollection AddCustomCors(this IServiceCollection services, IConfiguration configuration)
	{
		var corsSettings = configuration.GetSection(CorsSettings.SectionName).Get<CorsSettings>();

		services.AddCors(options =>
		{
			options.AddPolicy(
				PolicyNames.CorsPolicy,
				policy =>
				{
					policy.WithOrigins(corsSettings!.ReactAppUrl)
					.AllowAnyHeader()
					.AllowAnyMethod();
				});
		});

		return services;
	}

	public static IServiceCollection AddScraper(this IServiceCollection services, IConfiguration configuration)
	{
		var scraperSettings = configuration.GetSection(ScraperSettings.SectionName).Get<ScraperSettings>();

		services.AddHttpClient<FoxtrotScraperService>(client =>
		{
			client.DefaultRequestHeaders.UserAgent.ParseAdd(scraperSettings!.UserAgent);

			client.DefaultRequestHeaders.AcceptLanguage.ParseAdd(scraperSettings!.AcceptLanguage);
		});

		return services;
	}
}
