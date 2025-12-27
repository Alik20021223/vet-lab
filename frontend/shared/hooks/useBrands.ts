import { useGetBrandsQuery } from '../services/brands.service';

/**
 * Хук для получения списка брендов (публичный)
 * @returns Объект с брендами, состоянием загрузки и ошибками
 */
export function useBrands() {
  const { data, isLoading, error, refetch } = useGetBrandsQuery();

  return {
    brands: data?.data || [],
    isLoading,
    error,
    refetch,
  };
}

