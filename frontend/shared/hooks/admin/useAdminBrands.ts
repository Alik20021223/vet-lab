import {
  useGetAdminBrandsQuery,
  useGetAdminBrandQuery,
  useCreateBrandMutation,
  useUpdateBrandMutation,
  useDeleteBrandMutation,
} from '../../services/brands.service';

export function useAdminBrands() {
  const { data, isLoading, error, refetch } = useGetAdminBrandsQuery();

  return {
    brands: data?.data || [],
    isLoading,
    error,
    refetch,
  };
}

export function useAdminBrand(id: string | undefined) {
  const { data, isLoading, error } = useGetAdminBrandQuery(id!, {
    skip: !id,
  });

  return {
    brand: data?.data,
    isLoading,
    error,
  };
}

export function useBrandMutations() {
  const [createBrand, { isLoading: isCreating }] = useCreateBrandMutation();
  const [updateBrand, { isLoading: isUpdating }] = useUpdateBrandMutation();
  const [deleteBrand, { isLoading: isDeleting }] = useDeleteBrandMutation();

  return {
    createBrand,
    updateBrand,
    deleteBrand,
    isCreating,
    isUpdating,
    isDeleting,
  };
}

