import { api, prepareRequestBody } from '../store/api';
import type { Brand } from '../types/admin';

export interface BrandListResponse {
  data: Brand[];
}

export interface BrandResponse {
  data: Brand;
}

export interface CreateBrandRequest {
  name: string;
  logo?: File | string;
  description?: string;
  sortOrder?: number;
}

export interface UpdateBrandRequest extends Partial<CreateBrandRequest> {
  id: string;
}

export const brandsService = api.injectEndpoints({
  endpoints: (builder) => ({
    // Public endpoints
    getBrands: builder.query<BrandListResponse, void>({
      query: () => '/brands',
      providesTags: ['Brand'],
    }),
    getBrand: builder.query<BrandResponse, string>({
      query: (id) => `/brands/${id}`,
      providesTags: (result, error, id) => [{ type: 'Brand', id }],
    }),

    // Admin endpoints
    getAdminBrands: builder.query<BrandListResponse, void>({
      query: () => '/admin/brands',
      providesTags: ['Brand'],
    }),
    getAdminBrand: builder.query<BrandResponse, string>({
      query: (id) => `/admin/brands/${id}`,
      providesTags: (result, error, id) => [{ type: 'Brand', id }],
    }),
    createBrand: builder.mutation<BrandResponse, CreateBrandRequest>({
      query: (data) => {
        const body = prepareRequestBody(data);
        return {
          url: '/admin/brands',
          method: 'POST',
          body,
        };
      },
      invalidatesTags: ['Brand'],
    }),
    updateBrand: builder.mutation<BrandResponse, UpdateBrandRequest>({
      query: ({ id, ...data }) => {
        const body = prepareRequestBody(data);
        return {
          url: `/admin/brands/${id}`,
          method: 'PUT',
          body,
        };
      },
      invalidatesTags: (result, error, { id }) => [{ type: 'Brand', id }, 'Brand'],
    }),
    deleteBrand: builder.mutation<{ message: string }, string>({
      query: (id) => ({
        url: `/admin/brands/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Brand'],
    }),
  }),
});

export const {
  useGetBrandsQuery,
  useGetBrandQuery,
  useGetAdminBrandsQuery,
  useGetAdminBrandQuery,
  useCreateBrandMutation,
  useUpdateBrandMutation,
  useDeleteBrandMutation,
} = brandsService;


