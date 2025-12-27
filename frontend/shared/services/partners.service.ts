import { api, prepareRequestBody } from '../store/api';
import type { AdminPartner } from '../types/admin';

export interface PartnerFilters {
  page?: number;
  limit?: number;
}

export interface PartnerListResponse {
  data: AdminPartner[];
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface PartnerResponse {
  data: AdminPartner;
}

export interface CreatePartnerRequest {
  name: string;
  logo?: File | string;
  url?: string;
  sortOrder?: number;
}

export interface UpdatePartnerRequest extends Partial<CreatePartnerRequest> {
  id: string;
}

export const partnersService = api.injectEndpoints({
  endpoints: (builder) => ({
    // Public endpoints
    getPartners: builder.query<PartnerListResponse, void>({
      query: () => '/partners',
      providesTags: ['Partner'],
    }),

    // Admin endpoints
    getAdminPartners: builder.query<PartnerListResponse, PartnerFilters | void>({
      query: (filters) => {
        if (!filters) return '/admin/partners';
        const params = new URLSearchParams();
        if (filters.page) params.append('page', String(filters.page));
        if (filters.limit) params.append('limit', String(filters.limit));
        return `/admin/partners?${params.toString()}`;
      },
      providesTags: ['Partner'],
    }),
    getAdminPartner: builder.query<PartnerResponse, string>({
      query: (id) => `/admin/partners/${id}`,
      providesTags: (result, error, id) => [{ type: 'Partner', id }],
    }),
    createPartner: builder.mutation<PartnerResponse, CreatePartnerRequest>({
      query: (data) => {
        const body = prepareRequestBody(data);
        return {
          url: '/admin/partners',
          method: 'POST',
          body,
        };
      },
      invalidatesTags: ['Partner'],
    }),
    updatePartner: builder.mutation<PartnerResponse, UpdatePartnerRequest>({
      query: ({ id, ...data }) => {
        const body = prepareRequestBody(data);
        return {
          url: `/admin/partners/${id}`,
          method: 'PUT',
          body,
        };
      },
      invalidatesTags: (result, error, { id }) => [{ type: 'Partner', id }, 'Partner'],
    }),
    deletePartner: builder.mutation<{ message: string }, string>({
      query: (id) => ({
        url: `/admin/partners/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Partner'],
    }),
  }),
});

export const {
  useGetPartnersQuery,
  useGetAdminPartnersQuery,
  useGetAdminPartnerQuery,
  useCreatePartnerMutation,
  useUpdatePartnerMutation,
  useDeletePartnerMutation,
} = partnersService;


