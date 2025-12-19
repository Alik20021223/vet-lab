/**
 * Константы для категорий каталога
 * 
 * Изображения для категорий хранятся локально в объекте categoryImages.
 * В будущем можно заменить на данные из API/админки.
 * 
 * Для добавления изображений через админку:
 * 1. Добавить поле image в модель категории на бэкенде
 * 2. Создать API endpoint для управления категориями
 * 3. Заменить categoryImages на данные из useCatalogCategories() hook
 * 4. Обновить админ-панель для загрузки изображений категорий
 */

// Изображения для категорий каталога
// Пути указывают на /static/categories/ - эти файлы должны быть загружены на сервер
// Или можно использовать абсолютные URL к изображениям
export const categoryImages: Record<string, string> = {
  vaccines: '/static/categories/vaccines.webp',
  medicines: '/static/categories/medicines.webp',
  disinfection: '/static/categories/disinfection.webp',
  'feed-additives': '/static/categories/feed-additives.webp',
};

// Список всех категорий с их ID
export const CATALOG_CATEGORY_IDS = [
  'vaccines',
  'medicines',
  'disinfection',
  'feed-additives',
  'equipment',
  'antibiotics',
] as const;

export type CatalogCategoryId = typeof CATALOG_CATEGORY_IDS[number];
