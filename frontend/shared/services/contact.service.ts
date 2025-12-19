import { api } from '../store/api';

export interface ContactSubmitRequest {
  name: string;
  email?: string;
  phone?: string;
  message: string;
  contextType?: 'product' | 'service' | 'general';
  contextId?: string;
  contextTitle?: string;
}

export interface ContactSubmitResponse {
  success: boolean;
  message: string;
}

export const contactService = api.injectEndpoints({
  endpoints: (builder) => ({
    submitContact: builder.mutation<ContactSubmitResponse, ContactSubmitRequest>({
      query: (data) => ({
        url: '/contacts/submit',
        method: 'POST',
        body: data,
      }),
    }),
  }),
});

export const { useSubmitContactMutation } = contactService;






