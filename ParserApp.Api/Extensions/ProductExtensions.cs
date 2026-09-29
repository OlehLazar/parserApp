using ParserApp.Api.Entities;

namespace ParserApp.Api.Extensions;

public static class ProductExtensions
{
	public static void UpdateFrom(this Product target, Product? source)
	{
		if (source == null)
			return;

		target.Name = source.Name;
		target.Description = source.Description;
		target.ImageUrl = source.ImageUrl;
	}
}
