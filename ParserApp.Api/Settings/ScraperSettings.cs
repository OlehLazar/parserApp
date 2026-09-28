namespace ParserApp.Api.Settings;

public class ScraperSettings
{
	public const string SectionName = "ScraperSettings";

	public string UserAgent { get; set; } = string.Empty;

	public string AcceptLanguage { get; set; } = string.Empty;
}
