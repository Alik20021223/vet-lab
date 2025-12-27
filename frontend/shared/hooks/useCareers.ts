import { useGetCareersQuery, useGetCareerItemQuery } from '../services/careers.service';
import type { CareerFilters } from '../services/careers.service';

export function useCareers(filters?: Omit<CareerFilters, 'status'>) {
  const { data, isLoading, error, refetch } = useGetCareersQuery(filters || {}, {
    skip: false,
  });

  return {
    careers: data?.data || [],
    pagination: data?.pagination,
    isLoading,
    error,
    refetch,
  };
}

export function useCareerItem(id: string | undefined) {
  const { data, isLoading, error } = useGetCareerItemQuery(id!, {
    skip: !id,
  });

  // API может возвращать данные напрямую или в обертке { data: ... }
  // Проверяем оба варианта
  const career = data?.data || data;

  return {
    career,
    isLoading,
    error,
  };
}

