import { useGetContactsQuery } from '../services/contacts.service';
import type { ContactInfo } from '../types/admin';

export function useContacts() {
  const { data, isLoading, error, refetch } = useGetContactsQuery();

  // Backend returns data directly, not wrapped in { data: ... }
  const contacts: ContactInfo | undefined = (data as any)?.data || (data as any);

  return {
    contacts,
    isLoading,
    error,
    refetch,
  };
}


