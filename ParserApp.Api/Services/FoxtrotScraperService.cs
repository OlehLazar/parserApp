using HtmlAgilityPack;
using ParserApp.Api.Data;
using ParserApp.Api.Entities;
using ParserApp.Api.Constants;

namespace ParserApp.Api.Services;

public class FoxtrotScraperService
{
	private readonly AppDbContext _context;
	private readonly HttpClient _httpClient;

	public FoxtrotScraperService(AppDbContext context, HttpClient httpClient)
	{
		_context = context;
		_httpClient = httpClient;
	}

	public async Task ParseAndSaveAsync(string url)
	{
		var html = await _httpClient.GetStringAsync(url);
		var document = new HtmlDocument();
		document.LoadHtml(html);

		var productNodes = document.DocumentNode.SelectNodes("//div[contains(@class, 'product-card') and @data-id]");

		if (productNodes == null || productNodes.Count == 0)
			throw new Exception(Messages.NoProductsFound);

		var productsToSave = new List<Product>();

		foreach (var node in productNodes.Take(20))
		{
			var name = node.GetAttributeValue("data-title", "").Trim();
			if (string.IsNullOrEmpty(name))
			{
				var titleNode = node.SelectSingleNode(".//div[contains(@class, 'product-card__title')]");
				name = titleNode?.InnerText.Trim() ?? string.Empty;
			}

			if (string.IsNullOrEmpty(name)) continue;

			var imgNode = node.SelectSingleNode(".//picture[contains(@class, 'product-card__img')]/img")
					   ?? node.SelectSingleNode(".//div[contains(@class, 'product-card__image')]//img");

			var imageUrl = imgNode?.GetAttributeValue("src", "")
						?? imgNode?.GetAttributeValue("data-src", "") ?? string.Empty;

			if (!string.IsNullOrEmpty(imageUrl) && !imageUrl.StartsWith("http"))
			{
				imageUrl = "https://www.foxtrot.com.ua" + imageUrl;
			}

			var price = node.GetAttributeValue("data-price", "");
			var description = !string.IsNullOrEmpty(price) ? $"Ціна: {price} ₴" : Messages.PriceNotSpecified;

			var paramNodes = node.SelectNodes(".//ul[contains(@class, 'product-params-list')]/li");
			if (paramNodes != null && paramNodes.Count > 0)
			{
				var specs = new List<string>();
				foreach (var param in paramNodes)
				{
					var pTitle = param.SelectSingleNode(".//div[contains(@class, 'product-params-title')]")?.InnerText.Trim();
					var pVal = param.SelectSingleNode(".//div[contains(@class, 'product-params-value')]")?.InnerText.Trim();

					if (!string.IsNullOrEmpty(pTitle) && !string.IsNullOrEmpty(pVal))
						specs.Add($"{pTitle} {pVal}");
				}
				if (specs.Any())
					description += " | Характеристики: " + string.Join(", ", specs);
			}

			productsToSave.Add(new Product
			{
				Name = name,
				Description = description,
				ImageUrl = imageUrl
			});
		}

		if (productsToSave.Any())
		{
			await _context.Products.AddRangeAsync(productsToSave);
			await _context.SaveChangesAsync();
		}
		else
		{
			throw new Exception(Messages.ExtractionError);
		}
	}
}
