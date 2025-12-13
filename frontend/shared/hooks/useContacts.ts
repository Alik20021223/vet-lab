import { useGetContactsQuery } from '../services/contacts.service';

export function useContacts() {
  const { data, isLoading, error, refetch } = useGetContactsQuery();

  return {
    contacts: data?.data,
    isLoading,
    error,
    refetch,
  };
}


