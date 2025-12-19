import {
  useGetAdminCatalogQuery,
  useGetAdminCatalogItemQuery,
  useCreateCatalogItemMutation,
  useUpdateCatalogItemMutation,
  useDeleteCatalogItemMutation,
  type CatalogFilters,
} from '../../services/catalog.service';

/**
 * Хук для получения списка товаров каталога (админ)
 * @param filters - Фильтры для поиска товаров (category, brandId, status, search, page, limit)
 * @returns Объект с товарами, пагинацией, состоянием загрузки и ошибками
 */
export function useAdminCatalog(filters?: CatalogFilters) {
  const { data, isLoading, error, refetch } = useGetAdminCatalogQuery(
    { limit: 1000, ...filters },
    { skip: false }
  );

  return {
    catalog: data?.data || [],
    pagination: data?.pagination,
    isLoading,
    error,
    refetch,
  };
}

/**
 * Хук для получения детальной информации о товаре (админ)
 * @param id - ID товара
 * @returns Объект с товаром, состоянием загрузки и ошибками
 */
export function useAdminCatalogItem(id: string | undefined) {
  const { data, isLoading, error } = useGetAdminCatalogItemQuery(id!, {
    skip: !id,
  });

  // API может возвращать данные напрямую или в обертке { data: ... }
  // Проверяем оба варианта
  const catalogItem = data?.data || data;

  return {
    catalogItem,
    isLoading,
    error,
  };
}

/**
 * Хук для мутаций каталога (создание, обновление, удаление)
 * @returns Объект с функциями мутаций и состояниями загрузки
 */
export function useCatalogMutations() {
  const [createCatalogItem, { isLoading: isCreating }] = useCreateCatalogItemMutation();
  const [updateCatalogItem, { isLoading: isUpdating }] = useUpdateCatalogItemMutation();
  const [deleteCatalogItem, { isLoading: isDeleting }] = useDeleteCatalogItemMutation();

  return {
    createCatalogItem,
    updateCatalogItem,
    deleteCatalogItem,
    isCreating,
    isUpdating,
    isDeleting,
  };
}

