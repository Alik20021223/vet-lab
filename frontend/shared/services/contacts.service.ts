import { api } from '../store/api';
import type { ContactInfo } from '../types/admin';

export interface ContactsResponse {
  data: ContactInfo;
}

export const contactsService = api.injectEndpoints({
  endpoints: (builder) => ({
    // Public endpoints
    getContacts: builder.query<ContactsResponse, void>({
      query: () => '/contacts',
      providesTags: ['Contacts'],
    }),

    // Admin endpoints
    getAdminContacts: builder.query<ContactsResponse, void>({
      query: () => '/admin/contacts',
      providesTags: ['Contacts'],
    }),
    updateContacts: builder.mutation<ContactsResponse, ContactInfo>({
      query: (data) => ({
        url: '/admin/contacts',
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: ['Contacts'],
    }),
  }),
});

export const { useGetContactsQuery, useGetAdminContactsQuery, useUpdateContactsMutation } =
  contactsService;


