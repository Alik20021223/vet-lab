import { api, prepareRequestBody } from '../store/api';
import type { CatalogItem } from '../types/admin';

/**
 * Фильтры для каталога товаров
 */
export interface CatalogFilters {
  /** Категория товара */
  category?: 'vaccines' | 'medicines' | 'disinfection' | 'feed-additives' | 'equipment';
  /** ID бренда */
  brandId?: string;
  /** Статус товара (только для админских запросов) */
  status?: 'active' | 'draft' | 'archived';
  /** Поиск по названию или описанию */
  search?: string;
  /** Номер страницы */
  page?: number;
  /** Количество записей на странице */
  limit?: number;
}

export interface CatalogListResponse {
  data: CatalogItem[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface CatalogItemResponse {
  data: CatalogItem;
}

/**
 * Запрос на создание товара каталога
 * Примечание: image и documents должны быть загружены отдельно через /api/upload/image и /api/upload/document
 * В этом запросе передаются только URL строки, не файлы
 */
export interface CreateCatalogItemRequest {
  /** Название товара (обязательное, 3-200 символов) */
  title: string;
  /** Краткое описание (обязательное, 10-500 символов) */
  description: string;
  /** Полное описание с HTML разметкой (опциональное, минимум 20 символов) */
  fullDescription?: string;
  /** Способ применения с HTML разметкой (опциональное, минимум 20 символов) */
  applicationMethod?: string;
  /** Категория товара (обязательное) */
  category: 'vaccines' | 'medicines' | 'disinfection' | 'feed-additives' | 'equipment' | 'antibiotics';
  /** ID бренда (опциональное) */
  brandId?: string;
  /** URL изображения товара (опциональное, должен быть валидным URL) */
  image?: File | string;
  /** Массив URL документов (опциональное) */
  documents?: (File | string)[];
  /** Статус товара (по умолчанию 'draft') */
  status?: 'active' | 'draft' | 'archived';
  /** Порядок сортировки */
  sortOrder?: number;
}

export interface UpdateCatalogItemRequest extends Partial<CreateCatalogItemRequest> {
  id: string;
}

export const catalogService = api.injectEndpoints({
  endpoints: (builder) => ({
    // Public endpoints
    getCatalog: builder.query<CatalogListResponse, CatalogFilters>({
      query: (filters) => {
        const params = new URLSearchParams();
        if (filters.category) params.append('category', filters.category);
        if (filters.brandId) params.append('brandId', filters.brandId);
        if (filters.search) params.append('search', filters.search);
        if (filters.page) params.append('page', String(filters.page));
        if (filters.limit) params.append('limit', String(filters.limit));

        return {
          url: `/catalog?${params.toString()}`,
          method: 'GET',
        };
      },
      providesTags: ['Catalog'],
    }),
    getCatalogItem: builder.query<CatalogItemResponse, string>({
      query: (id) => `/catalog/${id}`,
      providesTags: (result, error, id) => [{ type: 'Catalog', id }],
    }),

    // Admin endpoints
    getAdminCatalog: builder.query<CatalogListResponse, CatalogFilters>({
      query: (filters) => {
        const params = new URLSearchParams();
        if (filters.category) params.append('category', filters.category);
        if (filters.status) params.append('status', filters.status);
        if (filters.brandId) params.append('brandId', filters.brandId);
        if (filters.search) params.append('search', filters.search);
        if (filters.page) params.append('page', String(filters.page));
        if (filters.limit) params.append('limit', String(filters.limit));

        return {
          url: `/admin/catalog?${params.toString()}`,
          method: 'GET',
        };
      },
      providesTags: ['Catalog'],
    }),
    getAdminCatalogItem: builder.query<CatalogItemResponse, string>({
      query: (id) => `/admin/catalog/${id}`,
      providesTags: (result, error, id) => [{ type: 'Catalog', id }],
    }),
    createCatalogItem: builder.mutation<CatalogItemResponse, CreateCatalogItemRequest>({
      query: (data) => {
        const body = prepareRequestBody(data);
        return {
          url: '/admin/catalog',
          method: 'POST',
          body,
        };
      },
      invalidatesTags: ['Catalog'],
    }),
    updateCatalogItem: builder.mutation<CatalogItemResponse, UpdateCatalogItemRequest>({
      query: ({ id, ...data }) => {
        const body = prepareRequestBody(data);
        return {
          url: `/admin/catalog/${id}`,
          method: 'PUT',
          body,
        };
      },
      invalidatesTags: (result, error, { id }) => [{ type: 'Catalog', id }, 'Catalog'],
    }),
    deleteCatalogItem: builder.mutation<{ message: string }, string>({
      query: (id) => ({
        url: `/admin/catalog/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Catalog'],
    }),
  }),
});

export const {
  useGetCatalogQuery,
  useGetCatalogItemQuery,
  useGetAdminCatalogQuery,
  useGetAdminCatalogItemQuery,
  useCreateCatalogItemMutation,
  useUpdateCatalogItemMutation,
  useDeleteCatalogItemMutation,
} = catalogService;


