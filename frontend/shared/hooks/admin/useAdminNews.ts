import {
  useGetAdminNewsQuery,
  useGetAdminNewsItemQuery,
  useCreateNewsMutation,
  useUpdateNewsMutation,
  useDeleteNewsMutation,
  type NewsFilters,
} from '../../services/news.service';

export function useAdminNews(filters?: NewsFilters) {
  const { data, isLoading, error, refetch } = useGetAdminNewsQuery({
    limit: 1000,
    ...filters,
  });

  return {
    news: data?.data || [],
    pagination: data?.pagination,
    isLoading,
    error,
    refetch,
  };
}

export function useAdminNewsItem(id: string | undefined) {
  const { data, isLoading, error } = useGetAdminNewsItemQuery(id!, {
    skip: !id,
  });

  return {
    newsItem: data?.data,
    isLoading,
    error,
  };
}

export function useNewsMutations() {
  const [createNews, { isLoading: isCreating }] = useCreateNewsMutation();
  const [updateNews, { isLoading: isUpdating }] = useUpdateNewsMutation();
  const [deleteNews, { isLoading: isDeleting }] = useDeleteNewsMutation();

  return {
    createNews,
    updateNews,
    deleteNews,
    isCreating,
    isUpdating,
    isDeleting,
  };
}

