import { api, prepareRequestBody } from '../store/api';
import type { AdminNews } from '../types/admin';

export interface NewsFilters {
  status?: 'published' | 'draft' | 'scheduled';
  page?: number;
  limit?: number;
  search?: string;
}

export interface NewsListResponse {
  data: AdminNews[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface NewsResponse {
  data: AdminNews;
}

export interface CreateNewsRequest {
  title: string;
  excerpt: string;
  content: string;
  coverImage?: File | string;
  publishedAt: string; // YYYY-MM-DD
  status: 'published' | 'draft' | 'scheduled';
}

export interface UpdateNewsRequest extends Partial<CreateNewsRequest> {
  id: string;
}

export const newsService = api.injectEndpoints({
  endpoints: (builder) => ({
    // Public endpoints
    getNews: builder.query<NewsListResponse, Omit<NewsFilters, 'status'>>({
      query: (filters) => {
        const params = new URLSearchParams();
        if (filters.page) params.append('page', String(filters.page));
        if (filters.limit) params.append('limit', String(filters.limit));
        if (filters.search) params.append('search', filters.search);

        return {
          url: `/news?${params.toString()}`,
          method: 'GET',
        };
      },
      providesTags: ['News'],
    }),
    getNewsItem: builder.query<NewsResponse, string>({
      query: (id) => `/news/${id}`,
      providesTags: (result, error, id) => [{ type: 'News', id }],
    }),

    // Admin endpoints
    getAdminNews: builder.query<NewsListResponse, NewsFilters>({
      query: (filters) => {
        const params = new URLSearchParams();
        if (filters.status) params.append('status', filters.status);
        if (filters.page) params.append('page', String(filters.page));
        if (filters.limit) params.append('limit', String(filters.limit));
        if (filters.search) params.append('search', filters.search);

        return {
          url: `/admin/news?${params.toString()}`,
          method: 'GET',
        };
      },
      providesTags: ['News'],
    }),
    getAdminNewsItem: builder.query<NewsResponse, string>({
      query: (id) => `/admin/news/${id}`,
      providesTags: (result, error, id) => [{ type: 'News', id }],
    }),
    createNews: builder.mutation<NewsResponse, CreateNewsRequest>({
      query: (data) => {
        const body = prepareRequestBody(data);
        return {
          url: '/admin/news',
          method: 'POST',
          body,
        };
      },
      invalidatesTags: ['News'],
    }),
    updateNews: builder.mutation<NewsResponse, UpdateNewsRequest>({
      query: ({ id, ...data }) => {
        const body = prepareRequestBody(data);
        return {
          url: `/admin/news/${id}`,
          method: 'PUT',
          body,
        };
      },
      invalidatesTags: (result, error, { id }) => [{ type: 'News', id }, 'News'],
    }),
    deleteNews: builder.mutation<{ message: string }, string>({
      query: (id) => ({
        url: `/admin/news/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['News'],
    }),
  }),
});

export const {
  useGetNewsQuery,
  useGetNewsItemQuery,
  useGetAdminNewsQuery,
  useGetAdminNewsItemQuery,
  useCreateNewsMutation,
  useUpdateNewsMutation,
  useDeleteNewsMutation,
} = newsService;


