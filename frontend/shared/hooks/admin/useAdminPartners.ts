import {
  useGetAdminPartnersQuery,
  useGetAdminPartnerQuery,
  useCreatePartnerMutation,
  useUpdatePartnerMutation,
  useDeletePartnerMutation,
} from '../../services/partners.service';

export function useAdminPartners() {
  const { data, isLoading, error, refetch } = useGetAdminPartnersQuery({ limit: 1000 });

  return {
    partners: data?.data || [],
    isLoading,
    error,
    refetch,
  };
}

export function useAdminPartner(id: string | undefined) {
  const { data, isLoading, error } = useGetAdminPartnerQuery(id!, {
    skip: !id,
  });

  return {
    partner: data?.data,
    isLoading,
    error,
  };
}

export function usePartnerMutations() {
  const [createPartner, { isLoading: isCreating }] = useCreatePartnerMutation();
  const [updatePartner, { isLoading: isUpdating }] = useUpdatePartnerMutation();
  const [deletePartner, { isLoading: isDeleting }] = useDeletePartnerMutation();

  return {
    createPartner,
    updatePartner,
    deletePartner,
    isCreating,
    isUpdating,
    isDeleting,
  };
}

