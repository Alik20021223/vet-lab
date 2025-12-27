# RTK Query API Integration

Полная интеграция с Backend API с использованием RTK Query.

## Структура

```
shared/
├── store/
│   ├── api.ts          # Базовый API slice с настройкой аутентификации
│   ├── store.ts        # Redux store конфигурация
│   └── README.md       # Эта документация
├── services/
│   ├── auth.service.ts
│   ├── catalog.service.ts
│   ├── brands.service.ts
│   ├── services.service.ts
│   ├── news.service.ts
│   ├── team.service.ts
│   ├── partners.service.ts
│   ├── gallery.service.ts
│   ├── contacts.service.ts
│   ├── pages.service.ts
│   ├── dashboard.service.ts
│   ├── upload.service.ts
│   └── index.ts
└── hooks/
    ├── useAuth.ts
    ├── useCatalog.ts
    ├── useServices.ts
    ├── useNews.ts
    ├── useTeam.ts
    ├── usePartners.ts
    ├── useGallery.ts
    ├── useContacts.ts
    └── index.ts
```

## Использование

### 1. Аутентификация

```tsx
import { useAuth } from '@/shared/hooks';

function LoginComponent() {
  const { login, isLoading, error } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await login(email, password);
      // Перенаправление после успешного входа
    } catch (error) {
      // Обработка ошибки
    }
  };
}
```

### 2. Каталог товаров

```tsx
import { useCatalog, useCatalogItem } from '@/shared/hooks';

function CatalogPage() {
  const { catalog, pagination, isLoading } = useCatalog({
    category: 'vaccines',
    page: 1,
    limit: 20,
  });

  return (
    <div>
      {catalog.map((item) => (
        <ProductCard key={item.id} item={item} />
      ))}
    </div>
  );
}

function ProductDetailPage({ productId }: { productId: string }) {
  const { item, isLoading } = useCatalogItem(productId);

  if (isLoading) return <div>Loading...</div>;
  if (!item) return <div>Not found</div>;

  return <ProductDetails item={item} />;
}
```

### 3. Админские операции

```tsx
import { useCreateCatalogItemMutation, useUpdateCatalogItemMutation } from '@/shared/services';

function AdminCatalogPage() {
  const [createItem, { isLoading: isCreating }] = useCreateCatalogItemMutation();
  const [updateItem, { isLoading: isUpdating }] = useUpdateCatalogItemMutation();

  const handleCreate = async (data: CreateCatalogItemRequest) => {
    try {
      const result = await createItem(data).unwrap();
      console.log('Created:', result.data);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleUpdate = async (id: string, data: UpdateCatalogItemRequest) => {
    try {
      const result = await updateItem({ id, ...data }).unwrap();
      console.log('Updated:', result.data);
    } catch (error) {
      console.error('Error:', error);
    }
  };
}
```

### 4. Загрузка файлов

```tsx
import { useUploadImageMutation } from '@/shared/services';

function ImageUploadComponent() {
  const [uploadImage, { isLoading }] = useUploadImageMutation();

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const result = await uploadImage(file).unwrap();
      console.log('Image URL:', result.data.url);
    } catch (error) {
      console.error('Upload error:', error);
    }
  };

  return <input type="file" onChange={handleFileChange} />;
}
```

## Доступные хуки

### Публичные хуки
- `useAuth()` - Аутентификация
- `useCatalog(filters?)` - Список товаров
- `useCatalogItem(id)` - Детали товара
- `useServices()` - Список услуг
- `useService(id)` - Детали услуги
- `useNews(filters?)` - Список новостей
- `useNewsItem(id)` - Детали новости
- `useTeam()` - Команда
- `usePartners()` - Партнёры
- `useGallery(filters?)` - Галерея
- `useContacts()` - Контакты

### Админские мутации
Все мутации доступны через прямые экспорты из сервисов:
- `useCreateCatalogItemMutation`
- `useUpdateCatalogItemMutation`
- `useDeleteCatalogItemMutation`
- И аналогично для других сущностей

## Настройка

### Переменные окружения

Создайте `.env` файл:

```env
VITE_API_URL=http://localhost:3000/api
```

### Автоматическое обновление токена

RTK Query автоматически обрабатывает обновление токена при получении 401 ошибки. Токены сохраняются в `localStorage`:
- `accessToken` - токен доступа
- `refreshToken` - токен обновления
- `user` - данные пользователя

## Обработка ошибок

RTK Query автоматически обрабатывает ошибки. Все ошибки доступны через `error` свойство в хуках:

```tsx
const { data, error, isLoading } = useGetCatalogQuery({});

if (error) {
  if ('status' in error) {
    // Ошибка от сервера
    console.error('Error status:', error.status);
  }
}
```

## Кэширование

RTK Query автоматически кэширует запросы. Для инвалидации кэша используйте теги:

```tsx
// После создания/обновления/удаления кэш автоматически обновляется
const [createItem] = useCreateCatalogItemMutation();
// После успешного создания, все связанные запросы автоматически обновятся
```


