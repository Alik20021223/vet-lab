import { api, prepareRequestBody } from '../store/api';
import type { AdminService } from '../types/admin';

export interface ServiceFilters {
  status?: 'active' | 'draft';
  page?: number;
  limit?: number;
}

export interface PublicServiceFilters {
  page?: number;
  limit?: number;
}

export interface ServiceListResponse {
  data: AdminService[];
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface ServiceResponse {
  data: AdminService;
}

export interface CreateServiceRequest {
  title: string;
  shortDescription: string;
  fullDescription: string;
  image?: File | string;
  icon?: string;
  status?: 'active' | 'draft';
  sortOrder?: number;
}

export interface UpdateServiceRequest extends Partial<CreateServiceRequest> {
  id: string;
}

export const servicesService = api.injectEndpoints({
  endpoints: (builder) => ({
    // Public endpoints
    getServices: builder.query<ServiceListResponse, PublicServiceFilters | void>({
      query: (filters) => {
        if (!filters) return '/services';
        const params = new URLSearchParams();
        if (filters.page) params.append('page', String(filters.page));
        if (filters.limit) params.append('limit', String(filters.limit));
        return `/services?${params.toString()}`;
      },
      providesTags: ['Service'],
    }),
    getService: builder.query<ServiceResponse, string>({
      query: (id) => `/services/${id}`,
      providesTags: (result, error, id) => [{ type: 'Service', id }],
    }),

    // Admin endpoints
    getAdminServices: builder.query<ServiceListResponse, ServiceFilters>({
      query: (filters) => {
        const params = new URLSearchParams();
        if (filters.status) params.append('status', filters.status);
        if (filters.page) params.append('page', String(filters.page));
        if (filters.limit) params.append('limit', String(filters.limit));

        return {
          url: `/admin/services?${params.toString()}`,
          method: 'GET',
        };
      },
      providesTags: ['Service'],
    }),
    getAdminService: builder.query<ServiceResponse, string>({
      query: (id) => `/admin/services/${id}`,
      providesTags: (result, error, id) => [{ type: 'Service', id }],
    }),
    createService: builder.mutation<ServiceResponse, CreateServiceRequest>({
      query: (data) => {
        const body = prepareRequestBody(data);
        return {
          url: '/admin/services',
          method: 'POST',
          body,
        };
      },
      invalidatesTags: ['Service'],
    }),
    updateService: builder.mutation<ServiceResponse, UpdateServiceRequest>({
      query: ({ id, ...data }) => {
        const body = prepareRequestBody(data);
        return {
          url: `/admin/services/${id}`,
          method: 'PUT',
          body,
        };
      },
      invalidatesTags: (result, error, { id }) => [{ type: 'Service', id }, 'Service'],
    }),
    deleteService: builder.mutation<{ message: string }, string>({
      query: (id) => ({
        url: `/admin/services/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Service'],
    }),
  }),
});

export const {
  useGetServicesQuery,
  useGetServiceQuery,
  useGetAdminServicesQuery,
  useGetAdminServiceQuery,
  useCreateServiceMutation,
  useUpdateServiceMutation,
  useDeleteServiceMutation,
} = servicesService;


