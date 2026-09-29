# Foxtrot Catalog Parser

Full-stack вебзастосунок для парсингу товарів з каталогу Фокстрот та керування ними через веб-інтерфейс.

Backend: ASP.NET Core Web API, Entity Framework Core, SQLite, HtmlAgilityPack.  
Frontend: React, TypeScript, Vite, Tailwind CSS.

<img width="1577" height="952" alt="image" src="https://github.com/user-attachments/assets/3bf2953a-4f2a-4f3d-b7e8-102bc58407f6" />


## Запуск

### Backend

```bash
dotnet run
```

### Frontend

```bash
npm run dev
```

Frontend буде доступний за адресою:

```text
http://localhost:5173
```

Після запуску відкрийте клієнт, введіть URL категорії Фокстрот та запустіть парсинг. Отримані товари будуть збережені в SQLite і доступні для подальшого редагування та видалення.
