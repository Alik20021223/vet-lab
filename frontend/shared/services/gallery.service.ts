import { api, prepareRequestBody } from '../store/api';
import type { AdminGalleryItem } from '../types/admin';

export interface GalleryFilters {
  category?: string;
  page?: number;
  limit?: number;
}

export interface GalleryListResponse {
  data: AdminGalleryItem[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface GalleryResponse {
  data: AdminGalleryItem;
}

export interface CreateGalleryItemRequest {
  image: File | string;
  category?: string;
  description?: string;
  sortOrder?: number;
}

export interface UpdateGalleryItemRequest extends Partial<CreateGalleryItemRequest> {
  id: string;
}

export const galleryService = api.injectEndpoints({
  endpoints: (builder) => ({
    // Public endpoints
    getGallery: builder.query<GalleryListResponse, GalleryFilters>({
      query: (filters) => {
        const params = new URLSearchParams();
        if (filters.category) params.append('category', filters.category);
        if (filters.page) params.append('page', String(filters.page));
        if (filters.limit) params.append('limit', String(filters.limit));

        return {
          url: `/gallery?${params.toString()}`,
          method: 'GET',
        };
      },
      providesTags: ['Gallery'],
    }),

    // Admin endpoints
    getAdminGallery: builder.query<GalleryListResponse, GalleryFilters>({
      query: (filters) => {
        const params = new URLSearchParams();
        if (filters.category) params.append('category', filters.category);
        if (filters.page) params.append('page', String(filters.page));
        if (filters.limit) params.append('limit', String(filters.limit));

        return {
          url: `/admin/gallery?${params.toString()}`,
          method: 'GET',
        };
      },
      providesTags: ['Gallery'],
    }),
    getAdminGalleryItem: builder.query<GalleryResponse, string>({
      query: (id) => `/admin/gallery/${id}`,
      providesTags: (result, error, id) => [{ type: 'Gallery', id }],
    }),
    createGalleryItem: builder.mutation<GalleryResponse, CreateGalleryItemRequest>({
      query: (data) => {
        const body = prepareRequestBody(data);
        return {
          url: '/admin/gallery',
          method: 'POST',
          body,
        };
      },
      invalidatesTags: ['Gallery'],
    }),
    updateGalleryItem: builder.mutation<GalleryResponse, UpdateGalleryItemRequest>({
      query: ({ id, ...data }) => {
        const body = prepareRequestBody(data);
        return {
          url: `/admin/gallery/${id}`,
          method: 'PUT',
          body,
        };
      },
      invalidatesTags: (result, error, { id }) => [{ type: 'Gallery', id }, 'Gallery'],
    }),
    deleteGalleryItem: builder.mutation<{ message: string }, string>({
      query: (id) => ({
        url: `/admin/gallery/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Gallery'],
    }),
  }),
});

export const {
  useGetGalleryQuery,
  useGetAdminGalleryQuery,
  useGetAdminGalleryItemQuery,
  useCreateGalleryItemMutation,
  useUpdateGalleryItemMutation,
  useDeleteGalleryItemMutation,
} = galleryService;


