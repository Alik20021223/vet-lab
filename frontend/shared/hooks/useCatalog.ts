import { useGetCatalogQuery, useGetCatalogItemQuery } from '../services/catalog.service';
import type { CatalogFilters } from '../services/catalog.service';

/**
 * Хук для получения списка товаров каталога (публичный)
 * @param filters - Фильтры для поиска товаров (category, brandId, search, page, limit)
 * @returns Объект с товарами, пагинацией, состоянием загрузки и ошибками
 */
export function useCatalog(filters?: Omit<CatalogFilters, 'status'>) {
  const { data, isLoading, error, refetch } = useGetCatalogQuery(filters || {}, {
    skip: false,
  });

  return {
    catalog: data?.data || [],
    pagination: data?.pagination,
    isLoading,
    error,
    refetch,
  };
}

/**
 * Хук для получения детальной информации о товаре (публичный)
 * @param id - ID товара
 * @returns Объект с товаром, состоянием загрузки и ошибками
 */
export function useCatalogItem(id: string | undefined) {
  const { data, isLoading, error } = useGetCatalogItemQuery(id!, {
    skip: !id,
  });

  // API может возвращать данные напрямую или в обертке { data: ... }
  // Проверяем оба варианта
  const item = data?.data || data;

  return {
    item,
    isLoading,
    error,
  };
}


