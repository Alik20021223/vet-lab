import {
  useGetAdminServicesQuery,
  useGetAdminServiceQuery,
  useCreateServiceMutation,
  useUpdateServiceMutation,
  useDeleteServiceMutation,
  type ServiceFilters,
} from '../../services/services.service';

export function useAdminServices(filters?: ServiceFilters) {
  const { data, isLoading, error, refetch } = useGetAdminServicesQuery({
    limit: 1000,
    ...filters,
  });

  return {
    services: data?.data || [],
    pagination: data?.pagination,
    isLoading,
    error,
    refetch,
  };
}

export function useAdminService(id: string | undefined) {
  const { data, isLoading, error } = useGetAdminServiceQuery(id!, {
    skip: !id,
  });

  return {
    service: data?.data,
    isLoading,
    error,
  };
}

export function useServiceMutations() {
  const [createService, { isLoading: isCreating }] = useCreateServiceMutation();
  const [updateService, { isLoading: isUpdating }] = useUpdateServiceMutation();
  const [deleteService, { isLoading: isDeleting }] = useDeleteServiceMutation();

  return {
    createService,
    updateService,
    deleteService,
    isCreating,
    isUpdating,
    isDeleting,
  };
}

