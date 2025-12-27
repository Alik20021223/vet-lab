import { api, prepareRequestBody } from '../store/api';
import type { HeroSlide } from '../types/admin';

export interface HeroSlidesFilters {
  isActive?: boolean;
  page?: number;
  limit?: number;
}

export interface HeroSlidesListResponse {
  data: HeroSlide[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface HeroSlideResponse {
  data: HeroSlide;
}

export interface CreateHeroSlideRequest {
  image: File | string;
  title: string;
  titleEn?: string;
  sortOrder?: number;
  isActive?: boolean;
}

export interface UpdateHeroSlideRequest extends Partial<CreateHeroSlideRequest> {
  id: string;
}

export const heroSlidesService = api.injectEndpoints({
  endpoints: (builder) => ({
    // Public endpoint - get active hero slides
    getHeroSlides: builder.query<{ data: HeroSlide[] }, void>({
      query: () => ({
        url: '/hero-slides',
        method: 'GET',
      }),
      providesTags: ['HeroSlides'],
    }),

    // Admin endpoints
    getAdminHeroSlides: builder.query<HeroSlidesListResponse, HeroSlidesFilters>({
      query: (filters) => {
        const params = new URLSearchParams();
        if (filters.isActive !== undefined) params.append('isActive', String(filters.isActive));
        if (filters.page) params.append('page', String(filters.page));
        if (filters.limit) params.append('limit', String(filters.limit));

        return {
          url: `/admin/hero-slides?${params.toString()}`,
          method: 'GET',
        };
      },
      providesTags: ['HeroSlides'],
    }),
    getAdminHeroSlide: builder.query<HeroSlideResponse, string>({
      query: (id) => `/admin/hero-slides/${id}`,
      providesTags: (result, error, id) => [{ type: 'HeroSlides', id }],
    }),
    createHeroSlide: builder.mutation<HeroSlideResponse, CreateHeroSlideRequest>({
      query: (data) => {
        const body = prepareRequestBody(data);
        return {
          url: '/admin/hero-slides',
          method: 'POST',
          body,
        };
      },
      invalidatesTags: ['HeroSlides'],
    }),
    updateHeroSlide: builder.mutation<HeroSlideResponse, UpdateHeroSlideRequest>({
      query: ({ id, ...data }) => {
        const body = prepareRequestBody(data);
        return {
          url: `/admin/hero-slides/${id}`,
          method: 'PUT',
          body,
        };
      },
      invalidatesTags: (result, error, { id }) => [{ type: 'HeroSlides', id }, 'HeroSlides'],
    }),
    deleteHeroSlide: builder.mutation<{ message: string }, string>({
      query: (id) => ({
        url: `/admin/hero-slides/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['HeroSlides'],
    }),
  }),
});

export const {
  useGetHeroSlidesQuery,
  useGetAdminHeroSlidesQuery,
  useGetAdminHeroSlideQuery,
  useCreateHeroSlideMutation,
  useUpdateHeroSlideMutation,
  useDeleteHeroSlideMutation,
} = heroSlidesService;
