# VET-LAB - Руководство по новым функциям

## 🗺️ Breadcrumbs (Хлебные крошки)

### Описание
Навигационные breadcrumbs добавлены на все страницы сайта для улучшения UX и SEO.

### Использование
```tsx
import { Breadcrumbs } from '../components/Breadcrumbs';

<Breadcrumbs
  items={[
    { label: 'Каталог', href: '/catalog' },
    { label: 'Вакцины', href: '/catalog?category=vaccines' },
    { label: 'Вакцина ND-IB' } // Последний элемент без href
  ]}
/>
```

### Где реализовано
- ✅ HomePage (Главная)
- ✅ AboutPage (О компании)
- ✅ ServicesPage (Услуги)
- ✅ ServiceDetailPage (Детальная страница услуги)
- ✅ CatalogPage (Каталог)
- ✅ ProductDetailPage (Детальная страница продукта)
- ✅ NewsPage (Новости)
- ✅ NewsDetailPage (Детальная страница новости)
- ✅ TeamPage (Команда)
- ✅ ContactsPage (Контакты)
- ✅ GalleryPage (Галерея)
- ✅ CareerPage (Карьера)

---

## 📦 Детальная страница продукта

### Путь
`/catalog/:productId`

### Особенности
1. **Полное описание** - HTML контент с форматированием
2. **Способ применения** - Инструкция по применению продукта
3. **Информация о бренде** - Логотип и название бренда
4. **Рекомендации** - Swiper карусель с похожими продуктами из той же категории
5. **Breadcrumbs** - Навигация: Каталог → Категория → Продукт

### Данные продукта
```typescript
{
  id: string;
  title: string;
  description: string;
  fullDescription?: string; // HTML
  applicationMethod?: string; // HTML
  category: string;
  brand?: {
    id: string;
    name: string;
    logo?: string;
  };
  image: string;
}
```

---

## 🏷️ Фильтр по брендам в каталоге

### Описание
Добавлен фильтр по брендам на странице каталога в боковой панели фильтров.

### Использование
1. Открыть страницу `/catalog`
2. В левой панели выбрать бренд из выпадающего списка
3. Список товаров автоматически отфильтруется
4. URL обновится с параметром `?brand=brandId`

### Активные фильтры
Блок "Активные фильтры" показывает текущие выбранные фильтры с возможностью быстрой очистки.

---

## 🎨 Rich Text Editor в админке

### Путь к компоненту
`/components/admin/RichTextEditor.tsx`

### Возможности
- **Форматирование текста**: жирный, курсив, подчеркнутый
- **Списки**: маркированные и нумерованные
- **Выравнивание**: по левому краю, по центру, по правому краю
- **Ссылки**: вставка гиперссылок
- **Изображения**: вставка изображений по URL

### Использование
```tsx
import { RichTextEditor } from '../../components/admin/RichTextEditor';

<RichTextEditor
  value={formData.fullDescription}
  onChange={(value) => setFormData({ ...formData, fullDescription: value })}
  placeholder="Введите текст..."
/>
```

### Где используется
- Админка каталога - Полное описание продукта
- Админка каталога - Способ применения продукта

---

## 🏢 Управление брендами в админке

### Путь
`/admin/brands`

### Функционал
1. **Список брендов** - Таблица со всеми брендами
2. **Добавление бренда** - Форма создания нового бренда
3. **Редактирование** - Изменение существующего бренда
4. **Удаление** - Удаление бренда
5. **Загрузка логотипа** - ImageUpload компонент

### Поля бренда
- Название (обязательно)
- Логотип (опционально)
- Описание (опционально)
- Порядок сортировки (автоматически)

### API Endpoint
```
GET    /api/brands
POST   /api/admin/brands
PUT    /api/admin/brands/:id
DELETE /api/admin/brands/:id
```

---

## 📝 Обновленная админка каталога

### Новые поля
1. **Краткое описание** - Для карточки товара (обязательно)
2. **Полное описание** - HTML контент через RichTextEditor
3. **Способ применения** - HTML контент через RichTextEditor
4. **Бренд** - Выбор из списка брендов

### Структура формы
```
┌─────────────────────────────────────┐
│ Название *                          │
├─────────────────────────────────────┤
│ Краткое описание *                  │
│ (Textarea - 3 строки)               │
├─────────────────────────────────────┤
│ Полное описание                     │
│ (RichTextEditor)                    │
├─────────────────────────────────────┤
│ Способ применения                   │
│ (RichTextEditor)                    │
├─────────────────────────────────────┤
│ Категория │ Бренд                   │
├─────────────────────────────────────┤
│ Статус                              │
├─────────────────────────────────────┤
│ Фото товара                         │
│ (ImageUpload)                       │
└─────────────────────────────────────┘
```

---

## 🔄 Обновленные типы данных

### /shared/types/admin.ts

```typescript
// Новый тип Brand
export interface Brand {
  id: string;
  name: string;
  logo?: string;
  description?: string;
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
}

// Обновленный CatalogItem
export interface CatalogItem {
  id: string;
  title: string;
  description: string;
  fullDescription?: string; // HTML content
  applicationMethod?: string; // HTML content
  category: string;
  brandId?: string;
  brand?: Brand;
  image?: string;
  documents?: string[];
  status: 'active' | 'draft' | 'archived';
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
}
```

---

## 🌐 Мультиязычность breadcrumbs

### Интеграция с i18n
Breadcrumbs автоматически используют переводы из системы i18n:

```tsx
const { t } = useLanguage();

<Breadcrumbs
  items={[
    { label: t('nav.catalog'), href: '/catalog' },
    { label: categoryName, href: `/catalog?category=${category}` },
    { label: product.title }
  ]}
/>
```

### Ключи переводов
- `nav.home` - Главная
- `nav.about` - О компании
- `nav.catalog` - Каталог
- `nav.services` - Услуги
- `nav.news` - Новости
- `nav.team` - Команда
- `nav.contacts` - Контакты
- `nav.gallery` - Галерея

---

## 🎯 Навигация в админке

### Обновленное меню
```
Dashboard        - /admin
Каталог          - /admin/catalog
Бренды [NEW]     - /admin/brands
Услуги           - /admin/services
Новости          - /admin/news
Команда          - /admin/team
Партнёры         - /admin/partners
Галерея          - /admin/gallery
Контакты         - /admin/contacts
Страницы         - /admin/pages
Настройки        - /admin/settings
```

### Временные ссылки для тестирования
- **В header сайта**: "Админка" → `/admin` (TODO: убрать перед продакшеном)
- **В header админки**: "На сайт" → `/` (TODO: убрать перед продакшеном)

---

## 🔗 Связь компонентов

```
HomePage
  └─> Breadcrumbs (Главная)

CatalogPage
  ├─> Breadcrumbs (Каталог [→ Категория])
  ├─> Brand Filter (Sidebar)
  └─> ProductCard (Link → ProductDetailPage)

ProductDetailPage
  ├─> Breadcrumbs (Каталог → Категория → Продукт)
  ├─> Brand Info
  ├─> Full Description (HTML)
  ├─> Application Method (HTML)
  └─> Related Products (Swiper)
        └─> ProductCard (Same Category)

Admin/BrandsAdminPage
  ├─> DataTable
  └─> Brand Form
        └─> ImageUpload

Admin/CatalogPage
  ├─> DataTable
  └─> Product Form
        ├─> RichTextEditor (Full Description)
        ├─> RichTextEditor (Application Method)
        ├─> Brand Select
        └─> ImageUpload
```

---

## 📱 Responsive Design

Все новые компоненты полностью адаптивны:

### Breakpoints
- Mobile: < 640px
- Tablet: 640px - 1024px
- Desktop: > 1024px

### ProductDetailPage
- **Mobile**: 1 колонка, вертикальное расположение
- **Desktop**: 2 колонки (изображение + информация)

### CatalogPage
- **Mobile**: Фильтры в dropdown, 1 товар в ряду
- **Tablet**: Боковая панель, 2 товара в ряду
- **Desktop**: Боковая панель, 3 товара в ряду

### Breadcrumbs
- **Mobile**: Уменьшенные иконки
- **Desktop**: Полноразмерные элементы

---

## 🎨 Стилизация

### Prose (Rich Text Content)
Для отображения HTML контента используются prose стили в `/styles/globals.css`:

```css
.prose {
  /* Заголовки, списки, ссылки, изображения */
}
```

### Rich Text Editor Placeholder
```css
[contenteditable][data-placeholder]:empty:before {
  content: attr(data-placeholder);
  color: #9ca3af;
}
```

---

## ✅ Checklist для продакшена

- [ ] Убрать временную ссылку "Админка" из header сайта
- [ ] Убрать временную ссылку "На сайт" из header админки
- [ ] Заменить mock данные на реальные API вызовы
- [ ] Подключить реальную загрузку изображений
- [ ] Настроить CORS для API
- [ ] Добавить валидацию форм с Zod
- [ ] Добавить обработку ошибок
- [ ] Добавить loading состояния
- [ ] Настроить SEO мета-теги для ProductDetailPage
- [ ] Добавить Open Graph теги для шаринга
- [ ] Протестировать на всех устройствах
- [ ] Оптимизировать изображения

---

## 📚 Дополнительная документация

- API Endpoints: `/API_ENDPOINTS.md`
- Архитектура проекта: Следует принципам DRY, KISS, SOLID
- Стек: React, TypeScript, Tailwind CSS, Radix UI, React Query, Zod, Zustand
