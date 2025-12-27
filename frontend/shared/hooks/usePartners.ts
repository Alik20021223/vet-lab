import { useGetPartnersQuery } from '../services/partners.service';

export function usePartners() {
  const { data, isLoading, error, refetch } = useGetPartnersQuery();

  return {
    partners: data?.data || [],
    isLoading,
    error,
    refetch,
  };
}


