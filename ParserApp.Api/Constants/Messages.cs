namespace ParserApp.Api.Constants;

public static class Messages
{
	public const string UrlEmpty = "URL порожній.";

	public const string ParseSuccess = "Товари успішно відпарсено та збережено";

	public const string NoProductsFound = "Не вдалося знайти товари. Перевірте селектори або посилання.";

	public const string PriceNotSpecified = "Ціна не вказана";

	public const string ExtractionError = "Товари знайдені у HTML, але сталася помилка під час витягування їхніх даних.";
}
