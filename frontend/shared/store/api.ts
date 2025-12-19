import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type { BaseQueryFn, FetchArgs, FetchBaseQueryError } from '@reduxjs/toolkit/query';

// API Base URL from environment variable
// 
// ⚠️ ВАЖНО: Vite встраивает переменные во время СБОРКИ, не во время выполнения!
// Установите VITE_API_URL ПЕРЕД запуском: npm run build
//
// Для production (рекомендуется относительный путь, если фронт и бэк на одном домене):
//   VITE_API_URL=/api
//
// Или полный URL (если API на другом домене):
//   VITE_API_URL=https://api.ваш-реальный-домен.com/api
//   ⚠️ НЕ используйте placeholder "yourdomain.com" - замените на реальный домен!
//
// Для разработки:
//   VITE_API_URL=http://localhost:4000/api
//
// Если не установлено, используется /api (относительный путь)
const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

// Debug: Log API base URL (remove in production)
if (import.meta.env.DEV) {
  console.log('🔧 API_BASE_URL:', API_BASE_URL);
  console.log('🔧 VITE_API_URL from env:', import.meta.env.VITE_API_URL);
}

// Base query with authentication
const baseQuery = fetchBaseQuery({
  baseUrl: API_BASE_URL,
  prepareHeaders: (headers) => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      headers.set('authorization', `Bearer ${token}`);
    }
    // Не устанавливаем Content-Type для FormData - браузер сделает это автоматически
    // Для JSON запросов fetchBaseQuery установит Content-Type автоматически
    return headers;
  },
});

// Base query with re-authentication
const baseQueryWithReauth: BaseQueryFn<string | FetchArgs, unknown, FetchBaseQueryError> = async (
  args,
  api,
  extraOptions
) => {
  let result = await baseQuery(args, api, extraOptions);

  if (result.error && result.error.status === 401) {
    // Проверяем, не это ли запрос на логин - если да, просто возвращаем ошибку
    const url = typeof args === 'string' ? args : args.url;
    const isLoginRequest = url?.includes('/auth/login');
    
    // Для запросов логина просто возвращаем ошибку без попытки refresh
    if (isLoginRequest) {
      return result;
    }

    // Try to refresh token
    const refreshToken = localStorage.getItem('refreshToken');
    if (refreshToken) {
      const refreshResult = await baseQuery(
        {
          url: '/auth/refresh',
          method: 'POST',
          body: { refreshToken },
        },
        api,
        extraOptions
      );

      if (refreshResult.data) {
        const { token } = refreshResult.data as { token: string };
        localStorage.setItem('accessToken', token);
        // Retry original query
        result = await baseQuery(args, api, extraOptions);
      } else {
        // Refresh failed, logout
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('user');
        // Не перезагружаем страницу, просто возвращаем ошибку
        // Навигация будет обработана в компонентах через ProtectedRoute
      }
    } else {
      // No refresh token, logout
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('user');
      // Не перезагружаем страницу, просто возвращаем ошибку
    }
  }

  return result;
};

// Helper to prepare JSON body (files are uploaded separately)
// Всегда возвращает JSON объект, так как файлы загружаются отдельно
export const prepareRequestBody = (data: Record<string, any>): Record<string, any> => {
  // Очищаем данные от undefined и null значений
  const cleanData: Record<string, any> = {};
  Object.keys(data).forEach((key) => {
    const value = data[key];
    if (value !== null && value !== undefined) {
            // Если это File объект, пропускаем (файлы должны быть загружены отдельно)
            if (value instanceof File) {
              return;
            }
            // Если это массив с файлами, пропускаем
            if (Array.isArray(value) && value.some(item => item instanceof File)) {
              return;
            }
      cleanData[key] = value;
    }
  });

  return cleanData;
};

// Legacy function for backward compatibility
export const prepareFormData = (data: Record<string, any>): FormData => {
  const result = prepareRequestBody(data);
  if (result instanceof FormData) {
    return result;
  }
  // Если нет файлов, но нужен FormData, создаем его
  const formData = new FormData();
  Object.keys(result).forEach((key) => {
    const value = result[key];
    if (value !== null && value !== undefined) {
      if (typeof value === 'object' && !(value instanceof File)) {
        formData.append(key, JSON.stringify(value));
      } else {
        formData.append(key, String(value));
      }
    }
  });
  return formData;
};

// Main API slice
export const api = createApi({
  reducerPath: 'api',
  baseQuery: baseQueryWithReauth,
        tagTypes: [
          'Auth',
          'Catalog',
          'Brand',
          'Service',
          'News',
          'Team',
          'Partner',
          'Gallery',
          'Contacts',
          'Page',
          'Dashboard',
          'Career',
        ],
  endpoints: () => ({}),
});

