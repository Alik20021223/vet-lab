import {
  useGetAdminPagesQuery,
  useGetAdminPageQuery,
  useUpdatePageMutation,
} from '../../services/pages.service';

export function useAdminPages() {
  const { data, isLoading, error, refetch } = useGetAdminPagesQuery();

  return {
    pages: data?.data || [],
    isLoading,
    error,
    refetch,
  };
}

export function useAdminPage(slug: string | undefined) {
  const { data, isLoading, error } = useGetAdminPageQuery(slug!, {
    skip: !slug,
  });

  return {
    page: data?.data,
    isLoading,
    error,
  };
}

export function usePageMutations() {
  const [updatePage, { isLoading: isUpdating }] = useUpdatePageMutation();

  return {
    updatePage,
    isUpdating,
  };
}

