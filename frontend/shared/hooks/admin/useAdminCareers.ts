import {
  useGetAdminCareersQuery,
  useCreateCareerMutation,
  useUpdateCareerMutation,
  useDeleteCareerMutation,
  type CareerFilters,
} from '../../services/careers.service';

export function useAdminCareers(filters?: CareerFilters) {
  const { data, isLoading, error, refetch } = useGetAdminCareersQuery(filters || {}, {
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

export function useCareerMutations() {
  const [createCareer, { isLoading: isCreating }] = useCreateCareerMutation();
  const [updateCareer, { isLoading: isUpdating }] = useUpdateCareerMutation();
  const [deleteCareer, { isLoading: isDeleting }] = useDeleteCareerMutation();

  return {
    createCareer,
    updateCareer,
    deleteCareer,
    isCreating,
    isUpdating,
    isDeleting,
  };
}

