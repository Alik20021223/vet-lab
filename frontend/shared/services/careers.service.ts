import { api, prepareRequestBody } from '../store/api';
import type { AdminJob } from '../types/admin';

export interface CareerFilters {
  status?: 'active' | 'draft' | 'closed' | 'expired';
  page?: number;
  limit?: number;
  search?: string;
  location?: string;
  type?: 'full-time' | 'part-time' | 'contract' | 'internship';
}

export interface CareerListResponse {
  data: AdminJob[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface CareerResponse {
  data: AdminJob;
}

export interface CreateCareerRequest {
  title: string;
  description: string;
  fullDescription: string;
  location: string;
  type: 'full-time' | 'part-time' | 'contract' | 'internship';
  department?: string;
  requirements: string[];
  responsibilities: string[];
  benefits: string[];
  salary?: {
    min: number;
    max: number;
    currency: string;
  };
  status: 'active' | 'draft' | 'closed' | 'expired';
  sortOrder?: number;
  expiresAt?: string;
}

export interface UpdateCareerRequest extends Partial<CreateCareerRequest> {
  id: string;
}

export const careersService = api.injectEndpoints({
  endpoints: (builder) => ({
    // Public endpoints
    getCareers: builder.query<CareerListResponse, Omit<CareerFilters, 'status'>>({
      query: (filters) => {
        const params = new URLSearchParams();
        if (filters.page) params.append('page', String(filters.page));
        if (filters.limit) params.append('limit', String(filters.limit));
        if (filters.search) params.append('search', filters.search);
        if (filters.location) params.append('location', filters.location);
        if (filters.type) params.append('type', filters.type);

        return {
          url: `/careers?${params.toString()}`,
          method: 'GET',
        };
      },
      providesTags: ['Career'],
    }),
    getCareerItem: builder.query<CareerResponse, string>({
      query: (id) => `/careers/${id}`,
      providesTags: (result, error, id) => [{ type: 'Career', id }],
    }),

    // Admin endpoints
    getAdminCareers: builder.query<CareerListResponse, CareerFilters>({
      query: (filters) => {
        const params = new URLSearchParams();
        if (filters.status) params.append('status', filters.status);
        if (filters.page) params.append('page', String(filters.page));
        if (filters.limit) params.append('limit', String(filters.limit));
        if (filters.search) params.append('search', filters.search);
        if (filters.location) params.append('location', filters.location);
        if (filters.type) params.append('type', filters.type);

        return {
          url: `/admin/careers?${params.toString()}`,
          method: 'GET',
        };
      },
      providesTags: ['Career'],
    }),
    getAdminCareerItem: builder.query<CareerResponse, string>({
      query: (id) => `/admin/careers/${id}`,
      providesTags: (result, error, id) => [{ type: 'Career', id }],
    }),
    createCareer: builder.mutation<CareerResponse, CreateCareerRequest>({
      query: (data) => {
        const body = prepareRequestBody(data);
        return {
          url: '/admin/careers',
          method: 'POST',
          body,
        };
      },
      invalidatesTags: ['Career'],
    }),
    updateCareer: builder.mutation<CareerResponse, UpdateCareerRequest>({
      query: ({ id, ...data }) => {
        const body = prepareRequestBody(data);
        return {
          url: `/admin/careers/${id}`,
          method: 'PUT',
          body,
        };
      },
      invalidatesTags: (result, error, { id }) => [{ type: 'Career', id }, 'Career'],
    }),
    deleteCareer: builder.mutation<{ message: string }, string>({
      query: (id) => ({
        url: `/admin/careers/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Career'],
    }),
  }),
});

export const {
  useGetCareersQuery,
  useGetCareerItemQuery,
  useGetAdminCareersQuery,
  useGetAdminCareerItemQuery,
  useCreateCareerMutation,
  useUpdateCareerMutation,
  useDeleteCareerMutation,
} = careersService;

