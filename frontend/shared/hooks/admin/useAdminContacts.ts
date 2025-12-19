import {
  useGetAdminContactsQuery,
  useUpdateContactsMutation,
} from '../../services/contacts.service';
import type { ContactInfo } from '../../types/admin';

export function useAdminContacts(): {
  contacts: ContactInfo | undefined;
  isLoading: boolean;
  error: any;
  refetch: () => void;
} {
  const { data, isLoading, error, refetch } = useGetAdminContactsQuery();

  // Handle both wrapped response { data: ContactInfo } and direct ContactInfo
  // Backend returns data directly, not wrapped
  const contacts: ContactInfo | undefined = (data as any)?.data || (data as any);

  return {
    contacts: contacts as ContactInfo | undefined,
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

