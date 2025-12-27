import { api, prepareRequestBody } from '../store/api';
import type { AdminGalleryItem, GallerySection } from '../types/admin';

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

export interface GallerySectionsResponse {
  data: GallerySection[];
}

export interface GalleryResponse {
  data: AdminGalleryItem;
}

export interface CreateGalleryItemRequest {
  image: File | string;
  sectionId?: string;
  category?: string;
  description?: string;
  sortOrder?: number;
}

export interface UpdateGalleryItemRequest extends Partial<CreateGalleryItemRequest> {
  id: string;
}

export interface CreateGallerySectionRequest {
  title: string;
  titleEn?: string;
  sortOrder?: number;
}

export interface UpdateGallerySectionRequest extends Partial<CreateGallerySectionRequest> {
  id: string;
}

export const galleryService = api.injectEndpoints({
  endpoints: (builder) => ({
    // Public endpoints - get gallery sections
    getGallery: builder.query<GallerySectionsResponse, void>({
      query: () => ({
        url: '/gallery',
        method: 'GET',
      }),
      providesTags: ['Gallery'],
    }),
    
    // Public endpoints - get gallery items (for backward compatibility)
    getGalleryItems: builder.query<GalleryListResponse, GalleryFilters>({
      query: (filters) => {
        const params = new URLSearchParams();
        if (filters.category) params.append('category', filters.category);
        if (filters.page) params.append('page', String(filters.page));
        if (filters.limit) params.append('limit', String(filters.limit));

        return {
          url: `/gallery/items?${params.toString()}`,
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
    
    // Admin sections endpoints
    getAdminGallerySections: builder.query<GallerySectionsResponse, void>({
      query: () => ({
        url: '/admin/gallery/sections/all',
        method: 'GET',
      }),
      providesTags: ['Gallery'],
    }),
    getAdminGallerySection: builder.query<{ data: GallerySection }, string>({
      query: (id) => `/admin/gallery/sections/${id}`,
      providesTags: (result, error, id) => [{ type: 'Gallery', id }],
    }),
    createGallerySection: builder.mutation<{ data: GallerySection }, CreateGallerySectionRequest>({
      query: (data) => ({
        url: '/admin/gallery/sections',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Gallery'],
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled;
          // Принудительно обновляем список секций
          dispatch(galleryService.util.invalidateTags(['Gallery']));
        } catch {}
      },
    }),
    updateGallerySection: builder.mutation<{ data: GallerySection }, UpdateGallerySectionRequest>({
      query: ({ id, ...data }) => ({
        url: `/admin/gallery/sections/${id}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: 'Gallery', id }, 'Gallery'],
    }),
    deleteGallerySection: builder.mutation<{ message: string }, string>({
      query: (id) => ({
        url: `/admin/gallery/sections/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Gallery'],
    }),
  }),
});

export const {
  useGetGalleryQuery,
  useGetGalleryItemsQuery,
  useGetAdminGalleryQuery,
  useGetAdminGalleryItemQuery,
  useCreateGalleryItemMutation,
  useUpdateGalleryItemMutation,
  useDeleteGalleryItemMutation,
  useGetAdminGallerySectionsQuery,
  useGetAdminGallerySectionQuery,
  useCreateGallerySectionMutation,
  useUpdateGallerySectionMutation,
  useDeleteGallerySectionMutation,
} = galleryService;


