import { api } from '../store/api';
import type { StaticPage } from '../types/admin';

export interface PageResponse {
  data: StaticPage;
}

export interface PageListResponse {
  data: StaticPage[];
}

export interface UpdatePageRequest {
  title: string;
  content: string;
  seo?: {
    metaTitle?: string;
    metaDescription?: string;
    metaKeywords?: string;
  };
}

export const pagesService = api.injectEndpoints({
  endpoints: (builder) => ({
    // Public endpoints
    getPage: builder.query<PageResponse, string>({
      query: (slug) => `/pages/${slug}`,
      providesTags: (result, error, slug) => [{ type: 'Page', id: slug }],
    }),

    // Admin endpoints
    getAdminPages: builder.query<PageListResponse, void>({
      query: () => '/admin/pages',
      providesTags: ['Page'],
    }),
    getAdminPage: builder.query<PageResponse, string>({
      query: (slug) => `/admin/pages/${slug}`,
      providesTags: (result, error, slug) => [{ type: 'Page', id: slug }],
    }),
    updatePage: builder.mutation<PageResponse, { slug: string; data: UpdatePageRequest }>({
      query: ({ slug, data }) => ({
        url: `/admin/pages/${slug}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: (result, error, { slug }) => [{ type: 'Page', id: slug }, 'Page'],
    }),
  }),
});

export const {
  useGetPageQuery,
  useGetAdminPagesQuery,
  useGetAdminPageQuery,
  useUpdatePageMutation,
} = pagesService;


