# Конфигурация URL изображений

## Обзор

Система теперь поддерживает динамическое формирование URL для изображений через переменные окружения. Это позволяет легко менять домен сервера без изменения кода.

## Backend (Node.js)

### Переменная окружения

Добавьте в `.env` или `env.production`:

```bash
PUBLIC_URL=https://yourdomain.com
```

Если `PUBLIC_URL` не задан, бэкенд будет возвращать относительные пути (`/static/...`).

### Как это работает

1. **Утилита**: `backend/src/utils/url.js`
   - `resolveImageUrl(url)` - добавляет `PUBLIC_URL` к относительным путям
   - `resolveImageUrlsInData(data)` - рекурсивно обрабатывает объекты/массивы

2. **Обновленные API endpoints**:
   - `/api/catalog` - товары каталога
   - `/api/news` - новости
   - `/api/services` - услуги
   - `/api/team` - команда
   - `/api/brands` - бренды
   - `/api/partners` - партнёры
   - `/api/gallery` - галерея
   - Admin endpoints (catalog, news, services, team)

### Примеры

**До:**
```json
{
  "image": "/static/catalog/image.webp"
}
```

**После (если PUBLIC_URL=https://yourdomain.com):**
```json
{
  "image": "https://yourdomain.com/static/catalog/image.webp"
}
```

**Если URL уже абсолютный:**
```json
{
  "image": "https://cdn.example.com/image.jpg"
}
```
→ Остаётся без изменений

## Frontend (React)

### Переменная окружения

Добавьте в `.env.production` или `.env`:

```bash
VITE_PUBLIC_URL=https://yourdomain.com
```

### Утилита

Используйте функцию `resolveImageUrl` из `frontend/src/utils/imageUrl.ts` (или `.js`):

```typescript
import { resolveImageUrl } from '@/utils/imageUrl';

// В компоненте
const imageUrl = resolveImageUrl(item.image);
<img src={imageUrl} alt={item.title} />
```

### Логика работы

1. Если URL начинается с `http://` или `https://` → возвращается как есть
2. Если URL относительный (`/static/...`) → добавляется `VITE_PUBLIC_URL`
3. Если `VITE_PUBLIC_URL` не задан → возвращается относительный путь

### Пример использования

```tsx
import { resolveImageUrl } from '@/utils/imageUrl';

function ProductCard({ product }) {
  return (
    <div>
      <img 
        src={resolveImageUrl(product.image)} 
        alt={product.title} 
      />
      {product.brand && (
        <img 
          src={resolveImageUrl(product.brand.logo)} 
          alt={product.brand.name} 
        />
      )}
    </div>
  );
}
```

## Docker Compose

В `docker-compose.production.yml` добавлена переменная:

```yaml
environment:
  - PUBLIC_URL=${PUBLIC_URL:-}
```

Установите значение в `.env` файле на сервере.

## Миграция

### Шаг 1: Обновите переменные окружения

**Backend `.env`:**
```bash
PUBLIC_URL=https://yourdomain.com
```

**Frontend `.env.production`:**
```bash
VITE_PUBLIC_URL=https://yourdomain.com
```

### Шаг 2: Обновите фронтенд код

Найдите все места, где используются изображения, и оберните их в `resolveImageUrl`:

```tsx
// Было:
<img src={item.image} />

// Стало:
<img src={resolveImageUrl(item.image)} />
```

### Шаг 3: Пересоберите фронтенд

```bash
npm run build
```

### Шаг 4: Перезапустите сервисы

```bash
docker-compose down
docker-compose up -d
```

## Важные замечания

1. **Совпадение URL**: `PUBLIC_URL` (бэкенд) и `VITE_PUBLIC_URL` (фронтенд) должны совпадать
2. **Относительные пути**: Если переменные не заданы, система работает с относительными путями (если API и фронт на одном домене)
3. **Абсолютные URL**: Если изображение уже имеет абсолютный URL, он не изменяется
4. **Пересборка**: После изменения `VITE_PUBLIC_URL` необходимо пересобрать фронтенд

## Тестирование

1. Проверьте API ответы - URL должны содержать полный домен (если `PUBLIC_URL` задан)
2. Проверьте фронтенд - изображения должны загружаться корректно
3. Проверьте с разными значениями `PUBLIC_URL` (включая пустое значение)
