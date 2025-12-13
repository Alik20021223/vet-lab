# VetLab Backend

Backend API для ветеринарной лаборатории.

## Структура проекта

- `src/app.js` - основное приложение Fastify
- `src/server.js` - точка входа сервера
- `src/modules/` - модули API (auth, products, categories, etc.)
- `src/plugins/` - плагины Fastify (CORS, JWT, static files, upload)
- `src/middlewares/` - middleware функции
- `src/utils/` - утилиты (pagination, file handling, responses)
- `src/api-public/` - публичные маршруты
- `prisma/` - Prisma ORM схема и миграции
- `uploads/` - хранилище загруженных файлов

## Установка

```bash
npm install
```

## Настройка базы данных

1. Создайте файл `.env` и настройте `DATABASE_URL`
2. Запустите миграции:

```bash
npx prisma migrate dev
```

## Запуск

```bash
npm run dev
```

## API Endpoints

### Аутентификация
- `POST /api/auth/login` - вход
- `POST /api/auth/register` - регистрация (admin only)

### Модули
Все модули следуют RESTful паттерну:
- `GET /api/{module}` - список с пагинацией
- `GET /api/{module}/:id` - получить один элемент
- `POST /api/{module}` - создать (admin only)
- `PUT /api/{module}/:id` - обновить (admin only)
- `DELETE /api/{module}/:id` - удалить (admin only)

### Публичные маршруты
- `GET /api-public/products` - публичный список продуктов
- `GET /api-public/categories` - публичный список категорий
- `GET /api-public/services` - публичные сервисы
- `GET /api-public/gallery` - галерея

## Загрузка файлов

Файлы загружаются через `multipart/form-data` и сохраняются в `uploads/`.
Доступ к файлам: `/static/{module}/{filename}`

