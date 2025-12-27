import { useGetServicesQuery, useGetServiceQuery, type PublicServiceFilters } from '../services/services.service';

export function useServices(filters?: PublicServiceFilters) {
  const { data, isLoading, error, refetch } = useGetServicesQuery(filters);

  return {
    services: data?.data || [],
    pagination: data?.pagination,
    isLoading,
    error,
    refetch,
  };
}

export function useService(id: string | undefined) {
  const { data, isLoading, error } = useGetServiceQuery(id!, {
    skip: !id,
  });

  // API может возвращать данные напрямую или в обертке { data: ... }
  // Проверяем оба варианта
  const service = data?.data || data;

  return {
    service,
    isLoading,
    error,
  };
}


