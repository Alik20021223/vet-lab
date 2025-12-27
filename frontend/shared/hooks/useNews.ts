import { useGetNewsQuery, useGetNewsItemQuery } from '../services/news.service';
import type { NewsFilters } from '../services/news.service';

export function useNews(filters?: Omit<NewsFilters, 'status'>) {
  const { data, isLoading, error, refetch } = useGetNewsQuery(filters || {}, {
    skip: false,
  });

  return {
    news: data?.data || [],
    pagination: data?.pagination,
    isLoading,
    error,
    refetch,
  };
}

export function useNewsItem(id: string | undefined) {
  const { data, isLoading, error } = useGetNewsItemQuery(id!, {
    skip: !id,
  });

  // API может возвращать данные напрямую или в обертке { data: ... }
  // Проверяем оба варианта
  const newsItem = data?.data || data;

  return {
    newsItem,
    isLoading,
    error,
  };
}


