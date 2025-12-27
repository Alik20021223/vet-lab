# RTK Query - Примеры использования

Полное руководство по использованию RTK Query интеграции в проекте.

## 📦 Установка

Зависимости уже установлены:
- `@reduxjs/toolkit`
- `react-redux`

## 🚀 Быстрый старт

### 1. Store уже настроен в `main.tsx`

```tsx
import { Provider } from 'react-redux';
import { store } from './shared/store/store';

<Provider store={store}>
  <App />
</Provider>
```

## 📚 Примеры использования

### Аутентификация

```tsx
import { useAuth } from '@/shared/hooks';

function LoginPage() {
  const { login, isLoading, error, isAuthenticated } = useAuth();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      await login(email, password);
      // Перенаправление после успешного входа
      navigate('/admin');
    } catch (error) {
      console.error('Login failed:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input type="email" />
      <input type="password" />
      <button disabled={isLoading}>Войти</button>
    </form>
  );
}
```

### Каталог товаров (Публичный)

```tsx
import { useCatalog, useCatalogItem } from '@/shared/hooks';
import { useSearchParams } from 'react-router-dom';

function CatalogPage() {
  const [searchParams] = useSearchParams();
  const category = searchParams.get('category') || undefined;

  const { catalog, pagination, isLoading } = useCatalog({
    category: category as any,
    page: 1,
    limit: 20,
  });

  if (isLoading) return <div>Загрузка...</div>;

  return (
    <div>
      {catalog.map((item) => (
        <ProductCard key={item.id} item={item} />
      ))}
      {pagination && (
        <Pagination
          current={pagination.page}
          total={pagination.totalPages}
        />
      )}
    </div>
  );
}

function ProductDetailPage() {
  const { id } = useParams();
  const { item, isLoading } = useCatalogItem(id);

  if (isLoading) return <div>Загрузка...</div>;
  if (!item) return <div>Товар не найден</div>;

  return <ProductDetails item={item} />;
}
```

### Каталог товаров (Админка)

```tsx
import {
  useGetAdminCatalogQuery,
  useCreateCatalogItemMutation,
  useUpdateCatalogItemMutation,
  useDeleteCatalogItemMutation,
} from '@/shared/services';

function AdminCatalogPage() {
  const [category, setCategory] = useState('vaccines');
  const { data, isLoading, refetch } = useGetAdminCatalogQuery({
    category: category as any,
    page: 1,
    limit: 20,
  });

  const [createItem, { isLoading: isCreating }] = useCreateCatalogItemMutation();
  const [updateItem, { isLoading: isUpdating }] = useUpdateCatalogItemMutation();
  const [deleteItem, { isLoading: isDeleting }] = useDeleteCatalogItemMutation();

  const handleCreate = async (formData: CreateCatalogItemRequest) => {
    try {
      const result = await createItem(formData).unwrap();
      console.log('Создано:', result.data);
      refetch(); // Обновить список
    } catch (error) {
      console.error('Ошибка создания:', error);
    }
  };

  const handleUpdate = async (id: string, formData: UpdateCatalogItemRequest) => {
    try {
      const result = await updateItem({ id, ...formData }).unwrap();
      console.log('Обновлено:', result.data);
      refetch();
    } catch (error) {
      console.error('Ошибка обновления:', error);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Удалить товар?')) return;
    try {
      await deleteItem(id).unwrap();
      refetch();
    } catch (error) {
      console.error('Ошибка удаления:', error);
    }
  };

  return (
    <div>
      <DataTable
        data={data?.data || []}
        onEdit={handleUpdate}
        onDelete={handleDelete}
      />
    </div>
  );
}
```

### Услуги

```tsx
import { useServices, useService } from '@/shared/hooks';

function ServicesPage() {
  const { services, isLoading } = useServices();

  return (
    <div>
      {services.map((service) => (
        <ServiceCard key={service.id} service={service} />
      ))}
    </div>
  );
}
```

### Новости

```tsx
import { useNews, useNewsItem } from '@/shared/hooks';

function NewsPage() {
  const [page, setPage] = useState(1);
  const { news, pagination, isLoading } = useNews({ page, limit: 10 });

  return (
    <div>
      {news.map((item) => (
        <NewsCard key={item.id} news={item} />
      ))}
    </div>
  );
}

function NewsDetailPage() {
  const { id } = useParams();
  const { newsItem, isLoading } = useNewsItem(id);

  return <NewsDetails news={newsItem} />;
}
```

### Команда, Партнёры, Галерея

```tsx
import { useTeam, usePartners, useGallery } from '@/shared/hooks';

function TeamPage() {
  const { team, isLoading } = useTeam();
  return <TeamGrid team={team} />;
}

function PartnersSection() {
  const { partners, isLoading } = usePartners();
  return <PartnersCarousel partners={partners} />;
}

function GalleryPage() {
  const { gallery, isLoading } = useGallery({ page: 1, limit: 20 });
  return <GalleryGrid images={gallery} />;
}
```

### Загрузка файлов

```tsx
import { useUploadImageMutation, useUploadDocumentMutation } from '@/shared/services';

function ImageUploadComponent({ onUpload }: { onUpload: (url: string) => void }) {
  const [uploadImage, { isLoading }] = useUploadImageMutation();

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const result = await uploadImage(file).unwrap();
      onUpload(result.data.url);
    } catch (error) {
      console.error('Ошибка загрузки:', error);
    }
  };

  return (
    <div>
      <input
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        disabled={isLoading}
      />
      {isLoading && <span>Загрузка...</span>}
    </div>
  );
}
```

### Dashboard (Админка)

```tsx
import { useGetDashboardStatsQuery } from '@/shared/services';

function DashboardPage() {
  const { data, isLoading } = useGetDashboardStatsQuery();

  if (isLoading) return <div>Загрузка...</div>;

  const stats = data?.data;

  return (
    <div>
      <StatCard title="Товары" value={stats?.totalProducts} />
      <StatCard title="Услуги" value={stats?.totalServices} />
      <StatCard title="Новости" value={stats?.totalNews} />
      <StatCard title="Команда" value={stats?.totalTeamMembers} />
      <StatCard title="Партнёры" value={stats?.totalPartners} />
    </div>
  );
}
```

### Контакты

```tsx
import { useContacts } from '@/shared/hooks';
import { useUpdateContactsMutation } from '@/shared/services';

function ContactsPage() {
  const { contacts, isLoading } = useContacts();
  const [updateContacts, { isLoading: isUpdating }] = useUpdateContactsMutation();

  const handleSave = async (data: ContactInfo) => {
    try {
      await updateContacts(data).unwrap();
      alert('Контакты обновлены!');
    } catch (error) {
      console.error('Ошибка обновления:', error);
    }
  };

  return <ContactsForm data={contacts} onSave={handleSave} />;
}
```

## 🔄 Автоматическое обновление токена

RTK Query автоматически обрабатывает обновление токена при получении 401 ошибки. Токены сохраняются в `localStorage`:
- `accessToken` - токен доступа
- `refreshToken` - токен обновления
- `user` - данные пользователя

## 📝 Типы данных

Все типы данных экспортируются из:
- `shared/types/admin.ts` - типы для админки
- `shared/types/index.ts` - публичные типы
- `shared/services/*.service.ts` - типы запросов/ответов

## ⚠️ Обработка ошибок

```tsx
const { data, error, isLoading } = useGetCatalogQuery({});

if (error) {
  if ('status' in error) {
    // Ошибка от сервера
    const status = error.status;
    const data = error.data;
    
    if (status === 401) {
      // Не авторизован (автоматически обрабатывается)
    } else if (status === 403) {
      // Доступ запрещён
    } else if (status === 404) {
      // Не найдено
    }
  }
}
```

## 🎯 Лучшие практики

1. **Используйте хуки для публичных данных**
   ```tsx
   const { catalog } = useCatalog({ category: 'vaccines' });
   ```

2. **Используйте прямые мутации для админки**
   ```tsx
   const [createItem] = useCreateCatalogItemMutation();
   ```

3. **Обрабатывайте состояния загрузки**
   ```tsx
   if (isLoading) return <Loader />;
   ```

4. **Используйте refetch после мутаций**
   ```tsx
   await createItem(data).unwrap();
   refetch(); // Обновить список
   ```

5. **Кэширование автоматическое**
   RTK Query автоматически кэширует запросы и обновляет их при мутациях.

## 🔗 Полезные ссылки

- [RTK Query Documentation](https://redux-toolkit.js.org/rtk-query/overview)
- [Redux Toolkit Documentation](https://redux-toolkit.js.org/)


