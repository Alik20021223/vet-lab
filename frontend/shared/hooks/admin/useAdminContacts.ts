import {
  useGetAdminContactsQuery,
  useUpdateContactsMutation,
} from '../../services/contacts.service';

export function useAdminContacts() {
  const { data, isLoading, error, refetch } = useGetAdminContactsQuery();

  return {
    contacts: data?.data,
    isLoading,
    error,
    refetch,
  };
}

export function useContactsMutations() {
  const [updateContacts, { isLoading: isUpdating }] = useUpdateContactsMutation();

  return {
    updateContacts,
    isUpdating,
  };
}

