# Структура проекта Frontend

## Обзор

Проект использует современную архитектуру React с TypeScript и организован по принципу feature-based структуры.

## Основные директории

### `/components`
Компоненты React, организованные по категориям:

- **`/admin`** - Компоненты для админ-панели
  - `AdminLayout.tsx` - Основной layout админки
  - `DataTable.tsx` - Таблица данных
  - `ImageUpload.tsx` - Загрузка изображений
  - `ProtectedRoute.tsx` - Защищенные маршруты
  - `RichTextEditor.tsx` - Редактор текста

- **`/figma`** - Компоненты из Figma дизайна
  - `ImageWithFallback.tsx` - Изображение с fallback

- **`/layout`** - Компоненты макета
  - `Header.tsx` - Шапка сайта
  - `Footer.tsx` - Подвал сайта
  - `Layout.tsx` - Основной layout

- **`/sections`** - Секции страниц
  - `AboutSection.tsx` - Секция "О нас"
  - `CatalogAndServicesSection.tsx` - Каталог и услуги
  - `ContactFormSection.tsx` - Форма контактов
  - `HeroSection.tsx` - Главная секция
  - `MapSection.tsx` - Карта
  - `NewsSection.tsx` - Новости
  - `PartnersSection.tsx` - Партнеры
  - `ServicesSection.tsx` - Услуги
  - `TeamSection.tsx` - Команда

- **`/shared`** - Общие компоненты
  - `ContactDialog.tsx` - Диалог контактов
  - `RichTextContent.tsx` - Отображение rich text

- **`/ui`** - UI компоненты (shadcn/ui)
  - Базовые компоненты: `button.tsx`, `input.tsx`, `card.tsx` и т.д.

### `/pages`
Страницы приложения:

- **`/admin`** - Страницы админ-панели
- Основные страницы: `HomePage.tsx`, `CatalogPage.tsx`, `ProductDetailPage.tsx` и т.д.

### `/shared`
Общая логика и утилиты:

- **`/constants`** - Константы
  - `brand.ts` - Брендинг
  - `catalogCategories.ts` - Категории каталога

- **`/contexts`** - React контексты
  - `LanguageContext.tsx` - Контекст языка

- **`/hooks`** - Кастомные хуки
  - **`/admin`** - Хуки для админки
  - Основные хуки: `useCatalog.ts` и т.д.

- **`/i18n`** - Интернационализация
  - `translations.ts` - Переводы

- **`/services`** - API сервисы (RTK Query)
  - `catalog.service.ts` - Сервис каталога
  - И другие сервисы

- **`/store`** - Redux store
  - `api.ts` - Настройка RTK Query API
  - `store.ts` - Настройка store

- **`/types`** - TypeScript типы
  - `admin.ts` - Типы для админки

- **`/utils`** - Утилиты
  - `localization.ts` - Утилиты локализации

### `/assets`
Статические ресурсы (изображения, иконки и т.д.)

### `/styles`
Глобальные стили

### `/docs`
Документация проекта

## Принципы организации

1. **Feature-based структура** - Компоненты группируются по функциональности
2. **Разделение concerns** - UI компоненты отделены от бизнес-логики
3. **Переиспользование** - Общие компоненты в `/shared` и `/components/shared`
4. **Типизация** - Все компоненты типизированы через TypeScript
5. **Документация** - Документация в папке `/docs`

## Импорты

Используйте абсолютные импорты относительно корня `frontend/`:

```typescript
import { Button } from '@/components/ui/button';
import { useCatalog } from '@/shared/hooks/useCatalog';
import { getLocalizedField } from '@/shared/utils/localization';
```
