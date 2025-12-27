# Frontend Integration Guide

Документация для интеграции фронтенда с VET-LAB Backend API.

## 📋 Содержание

1. [Базовые настройки](#базовые-настройки)
2. [Аутентификация](#аутентификация)
3. [Публичные API](#публичные-api)
4. [Админские API](#админские-api)
5. [Загрузка файлов](#загрузка-файлов)
6. [Обработка ошибок](#обработка-ошибок)
7. [Примеры кода](#примеры-кода)

---

## 🔧 Базовые настройки

### Базовый URL

```javascript
const API_BASE_URL = 'http://localhost:3000/api';
const API_ADMIN_URL = 'http://localhost:3000/api/admin';
```

### Настройка Axios/Fetch

#### Axios

```javascript
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:3000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor для добавления токена
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('accessToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Interceptor для обработки ошибок и refresh token
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      try {
        const refreshToken = localStorage.getItem('refreshToken');
        const response = await axios.post(`${API_BASE_URL}/auth/refresh`, {
          refreshToken,
        });
        
        const { token } = response.data.data;
        localStorage.setItem('accessToken', token);
        
        originalRequest.headers.Authorization = `Bearer ${token}`;
        return api(originalRequest);
      } catch (refreshError) {
        // Refresh failed, redirect to login
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }
    
    return Promise.reject(error);
  }
);
```

#### Fetch

```javascript
const API_BASE_URL = 'http://localhost:3000/api';

async function apiRequest(endpoint, options = {}) {
  const token = localStorage.getItem('accessToken');
  
  const config = {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    },
  };
  
  const response = await fetch(`${API_BASE_URL}${endpoint}`, config);
  
  if (!response.ok) {
    if (response.status === 401) {
      // Try to refresh token
      const refreshed = await refreshAccessToken();
      if (refreshed) {
        // Retry original request
        return apiRequest(endpoint, options);
      }
    }
    throw new Error(`API Error: ${response.status}`);
  }
  
  return response.json();
}

async function refreshAccessToken() {
  const refreshToken = localStorage.getItem('refreshToken');
  if (!refreshToken) return false;
  
  try {
    const response = await fetch(`${API_BASE_URL}/auth/refresh`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refreshToken }),
    });
    
    if (response.ok) {
      const data = await response.json();
      localStorage.setItem('accessToken', data.data.token);
      return true;
    }
  } catch (error) {
    console.error('Token refresh failed:', error);
  }
  
  localStorage.removeItem('accessToken');
  localStorage.removeItem('refreshToken');
  window.location.href = '/login';
  return false;
}
```

---

## 🔐 Аутентификация

### Вход в систему

```javascript
async function login(email, password) {
  try {
    const response = await api.post('/auth/login', {
      email,
      password,
    });
    
    const { token, refreshToken, user, expiresIn } = response.data.data;
    
    // Сохраняем токены
    localStorage.setItem('accessToken', token);
    localStorage.setItem('refreshToken', refreshToken);
    localStorage.setItem('user', JSON.stringify(user));
    
    return { user, expiresIn };
  } catch (error) {
    throw new Error(error.response?.data?.error?.message || 'Login failed');
  }
}
```

### Обновление токена

```javascript
async function refreshToken() {
  const refreshToken = localStorage.getItem('refreshToken');
  
  const response = await api.post('/auth/refresh', {
    refreshToken,
  });
  
  const { token } = response.data.data;
  localStorage.setItem('accessToken', token);
  
  return token;
}
```

### Выход из системы

```javascript
async function logout() {
  try {
    await api.post('/auth/logout');
  } finally {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
  }
}
```

### Получение текущего пользователя

```javascript
async function getCurrentUser() {
  const response = await api.get('/auth/me');
  return response.data.data;
}
```

---

## 🌐 Публичные API

### Каталог товаров

#### Получить список товаров

```javascript
async function getCatalog(filters = {}) {
  const params = new URLSearchParams({
    page: filters.page || 1,
    limit: filters.limit || 20,
    ...(filters.category && { category: filters.category }),
    ...(filters.brandId && { brandId: filters.brandId }),
    ...(filters.search && { search: filters.search }),
  });
  
  const response = await fetch(`${API_BASE_URL}/catalog?${params}`);
  return response.json();
}

// Использование
const catalog = await getCatalog({
  category: 'vaccines',
  page: 1,
  limit: 20,
});

// Ответ:
// {
//   data: [...],
//   pagination: {
//     page: 1,
//     limit: 20,
//     total: 150,
//     totalPages: 8
//   }
// }
```

#### Получить товар по ID

```javascript
async function getCatalogItem(id) {
  const response = await fetch(`${API_BASE_URL}/catalog/${id}`);
  return response.json();
}
```

### Бренды

```javascript
// Список брендов
async function getBrands() {
  const response = await fetch(`${API_BASE_URL}/brands`);
  return response.json();
}

// Бренд по ID
async function getBrand(id) {
  const response = await fetch(`${API_BASE_URL}/brands/${id}`);
  return response.json();
}
```

### Услуги

```javascript
// Список услуг
async function getServices() {
  const response = await fetch(`${API_BASE_URL}/services`);
  return response.json();
}

// Услуга по ID
async function getService(id) {
  const response = await fetch(`${API_BASE_URL}/services/${id}`);
  return response.json();
}
```

### Новости

```javascript
// Список новостей
async function getNews(filters = {}) {
  const params = new URLSearchParams({
    page: filters.page || 1,
    limit: filters.limit || 10,
    ...(filters.search && { search: filters.search }),
  });
  
  const response = await fetch(`${API_BASE_URL}/news?${params}`);
  return response.json();
}

// Новость по ID
async function getNewsItem(id) {
  const response = await fetch(`${API_BASE_URL}/news/${id}`);
  return response.json();
}
```

### Команда

```javascript
async function getTeam() {
  const response = await fetch(`${API_BASE_URL}/team`);
  return response.json();
}
```

### Партнёры

```javascript
async function getPartners() {
  const response = await fetch(`${API_BASE_URL}/partners`);
  return response.json();
}
```

### Галерея

```javascript
async function getGallery(filters = {}) {
  const params = new URLSearchParams({
    page: filters.page || 1,
    limit: filters.limit || 20,
    ...(filters.category && { category: filters.category }),
  });
  
  const response = await fetch(`${API_BASE_URL}/gallery?${params}`);
  return response.json();
}
```

### Контакты

```javascript
async function getContacts() {
  const response = await fetch(`${API_BASE_URL}/contacts`);
  return response.json();
}
```

### Статические страницы

```javascript
async function getPage(slug) {
  const response = await fetch(`${API_BASE_URL}/pages/${slug}`);
  return response.json();
}

// Примеры slug: 'about', 'privacy', 'terms'
```

---

## 🔧 Админские API

Все админские endpoints требуют Bearer токен в заголовке `Authorization`.

### Dashboard

```javascript
async function getDashboardStats() {
  const response = await api.get('/admin/dashboard/stats');
  return response.data.data;
}
```

### Каталог товаров (Admin)

#### Список товаров

```javascript
async function getAdminCatalog(filters = {}) {
  const params = new URLSearchParams({
    page: filters.page || 1,
    limit: filters.limit || 20,
    ...(filters.category && { category: filters.category }),
    ...(filters.status && { status: filters.status }),
    ...(filters.brandId && { brandId: filters.brandId }),
    ...(filters.search && { search: filters.search }),
  });
  
  const response = await api.get(`/admin/catalog?${params}`);
  return response.data;
}
```

#### Создать товар

```javascript
async function createCatalogItem(data) {
  const formData = new FormData();
  
  // Текстовые поля
  formData.append('title', data.title);
  formData.append('description', data.description);
  formData.append('fullDescription', data.fullDescription || '');
  formData.append('applicationMethod', data.applicationMethod || '');
  formData.append('category', data.category); // vaccines, medicines, etc.
  formData.append('status', data.status || 'draft');
  formData.append('sortOrder', data.sortOrder || 0);
  
  if (data.brandId) {
    formData.append('brandId', data.brandId);
  }
  
  if (data.documents && Array.isArray(data.documents)) {
    data.documents.forEach((doc, index) => {
      formData.append(`documents[${index}]`, doc);
    });
  }
  
  // Файл изображения
  if (data.image && data.image instanceof File) {
    formData.append('image', data.image);
  }
  
  const response = await api.post('/admin/catalog', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  
  return response.data.data;
}
```

#### Обновить товар

```javascript
async function updateCatalogItem(id, data) {
  const formData = new FormData();
  
  // Добавляем только измененные поля
  if (data.title) formData.append('title', data.title);
  if (data.description) formData.append('description', data.description);
  if (data.fullDescription !== undefined) formData.append('fullDescription', data.fullDescription);
  if (data.applicationMethod !== undefined) formData.append('applicationMethod', data.applicationMethod);
  if (data.category) formData.append('category', data.category);
  if (data.status) formData.append('status', data.status);
  if (data.sortOrder !== undefined) formData.append('sortOrder', data.sortOrder);
  if (data.brandId) formData.append('brandId', data.brandId);
  
  if (data.image && data.image instanceof File) {
    formData.append('image', data.image);
  }
  
  const response = await api.put(`/admin/catalog/${id}`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  
  return response.data.data;
}
```

#### Удалить товар

```javascript
async function deleteCatalogItem(id) {
  const response = await api.delete(`/admin/catalog/${id}`);
  return response.data;
}
```

### Бренды (Admin)

```javascript
// Список
async function getAdminBrands() {
  const response = await api.get('/admin/brands');
  return response.data.data;
}

// Создать
async function createBrand(data) {
  const formData = new FormData();
  formData.append('name', data.name);
  if (data.description) formData.append('description', data.description);
  if (data.sortOrder !== undefined) formData.append('sortOrder', data.sortOrder);
  if (data.logo && data.logo instanceof File) {
    formData.append('logo', data.logo);
  }
  
  const response = await api.post('/admin/brands', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return response.data.data;
}

// Обновить
async function updateBrand(id, data) {
  const formData = new FormData();
  if (data.name) formData.append('name', data.name);
  if (data.description !== undefined) formData.append('description', data.description);
  if (data.sortOrder !== undefined) formData.append('sortOrder', data.sortOrder);
  if (data.logo && data.logo instanceof File) {
    formData.append('logo', data.logo);
  }
  
  const response = await api.put(`/admin/brands/${id}`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return response.data.data;
}

// Удалить
async function deleteBrand(id) {
  const response = await api.delete(`/admin/brands/${id}`);
  return response.data;
}
```

### Услуги (Admin)

```javascript
// Список
async function getAdminServices(filters = {}) {
  const params = new URLSearchParams({
    page: filters.page || 1,
    limit: filters.limit || 20,
    ...(filters.status && { status: filters.status }),
  });
  
  const response = await api.get(`/admin/services?${params}`);
  return response.data;
}

// Создать
async function createService(data) {
  const formData = new FormData();
  formData.append('title', data.title);
  formData.append('shortDescription', data.shortDescription);
  formData.append('fullDescription', data.fullDescription);
  formData.append('status', data.status || 'draft');
  if (data.icon) formData.append('icon', data.icon);
  if (data.sortOrder !== undefined) formData.append('sortOrder', data.sortOrder);
  if (data.image && data.image instanceof File) {
    formData.append('image', data.image);
  }
  
  const response = await api.post('/admin/services', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return response.data.data;
}
```

### Новости (Admin)

```javascript
// Список
async function getAdminNews(filters = {}) {
  const params = new URLSearchParams({
    page: filters.page || 1,
    limit: filters.limit || 20,
    ...(filters.status && { status: filters.status }),
    ...(filters.search && { search: filters.search }),
  });
  
  const response = await api.get(`/admin/news?${params}`);
  return response.data;
}

// Создать
async function createNews(data) {
  const formData = new FormData();
  formData.append('title', data.title);
  formData.append('excerpt', data.excerpt);
  formData.append('content', data.content);
  formData.append('publishedAt', data.publishedAt); // YYYY-MM-DD
  formData.append('status', data.status); // published, draft, scheduled
  
  if (data.coverImage && data.coverImage instanceof File) {
    formData.append('coverImage', data.coverImage);
  }
  
  const response = await api.post('/admin/news', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return response.data.data;
}
```

### Команда (Admin)

```javascript
// Список
async function getAdminTeam() {
  const response = await api.get('/admin/team');
  return response.data.data;
}

// Создать
async function createTeamMember(data) {
  const formData = new FormData();
  formData.append('name', data.name);
  formData.append('position', data.position);
  if (data.email) formData.append('email', data.email);
  if (data.phone) formData.append('phone', data.phone);
  if (data.social) formData.append('social', JSON.stringify(data.social));
  if (data.sortOrder !== undefined) formData.append('sortOrder', data.sortOrder);
  if (data.photo && data.photo instanceof File) {
    formData.append('photo', data.photo);
  }
  
  const response = await api.post('/admin/team', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return response.data.data;
}
```

### Партнёры (Admin)

```javascript
// Список
async function getAdminPartners() {
  const response = await api.get('/admin/partners');
  return response.data.data;
}

// Создать
async function createPartner(data) {
  const formData = new FormData();
  formData.append('name', data.name);
  formData.append('logo', data.logo); // File или URL
  if (data.url) formData.append('url', data.url);
  if (data.sortOrder !== undefined) formData.append('sortOrder', data.sortOrder);
  
  const response = await api.post('/admin/partners', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return response.data.data;
}
```

### Галерея (Admin)

```javascript
// Список
async function getAdminGallery(filters = {}) {
  const params = new URLSearchParams({
    page: filters.page || 1,
    limit: filters.limit || 20,
    ...(filters.category && { category: filters.category }),
  });
  
  const response = await api.get(`/admin/gallery?${params}`);
  return response.data;
}

// Создать
async function createGalleryItem(data) {
  const formData = new FormData();
  formData.append('image', data.image); // File - обязательное поле
  if (data.category) formData.append('category', data.category);
  if (data.description) formData.append('description', data.description);
  if (data.sortOrder !== undefined) formData.append('sortOrder', data.sortOrder);
  
  const response = await api.post('/admin/gallery', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return response.data.data;
}
```

### Контакты (Admin)

```javascript
// Получить
async function getAdminContacts() {
  const response = await api.get('/admin/contacts');
  return response.data.data;
}

// Обновить
async function updateContacts(data) {
  const response = await api.put('/admin/contacts', {
    phone: data.phone,
    email: data.email,
    address: data.address,
    mapLat: data.mapLat,
    mapLng: data.mapLng,
    workingHours: data.workingHours,
    requisites: data.requisites, // Object
  });
  return response.data.data;
}
```

### Статические страницы (Admin)

```javascript
// Список
async function getAdminPages() {
  const response = await api.get('/admin/pages');
  return response.data.data;
}

// Получить по slug
async function getAdminPage(slug) {
  const response = await api.get(`/admin/pages/${slug}`);
  return response.data.data;
}

// Обновить
async function updatePage(slug, data) {
  const response = await api.put(`/admin/pages/${slug}`, {
    title: data.title,
    content: data.content,
    seo: data.seo, // Object
  });
  return response.data.data;
}
```

---

## 📤 Загрузка файлов

### Загрузка изображения

```javascript
async function uploadImage(file) {
  const formData = new FormData();
  formData.append('file', file);
  
  const response = await api.post('/upload/image', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  
  return response.data.data; // { url, filename, size, mimeType }
}
```

### Загрузка документа

```javascript
async function uploadDocument(file) {
  const formData = new FormData();
  formData.append('file', file);
  
  const response = await api.post('/upload/document', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  
  return response.data.data;
}
```

### Пример использования

```javascript
// В React компоненте
const handleImageUpload = async (event) => {
  const file = event.target.files[0];
  if (!file) return;
  
  try {
    const result = await uploadImage(file);
    console.log('Image uploaded:', result.url);
    // Используйте result.url для сохранения в форме
  } catch (error) {
    console.error('Upload failed:', error);
  }
};
```

---

## ⚠️ Обработка ошибок

### Формат ошибок

Все ошибки возвращаются в следующем формате:

```json
{
  "error": {
    "message": "Описание ошибки",
    "code": "ERROR_CODE"
  }
}
```

### Коды ошибок

- `BAD_REQUEST` (400) - Неверный запрос
- `UNAUTHORIZED` (401) - Не авторизован
- `FORBIDDEN` (403) - Доступ запрещён
- `NOT_FOUND` (404) - Ресурс не найден
- `VALIDATION_ERROR` (422) - Ошибки валидации
- `INTERNAL_SERVER_ERROR` (500) - Внутренняя ошибка сервера

### Обработка ошибок в коде

```javascript
async function handleApiCall(apiFunction) {
  try {
    const result = await apiFunction();
    return { success: true, data: result };
  } catch (error) {
    if (error.response) {
      // Сервер вернул ошибку
      const { message, code } = error.response.data.error || {};
      
      switch (code) {
        case 'UNAUTHORIZED':
          // Перенаправить на логин
          window.location.href = '/login';
          break;
        case 'FORBIDDEN':
          // Показать сообщение о недостатке прав
          alert('Недостаточно прав для выполнения этого действия');
          break;
        case 'VALIDATION_ERROR':
          // Показать ошибки валидации
          console.error('Validation errors:', error.response.data.error.details);
          break;
        default:
          alert(message || 'Произошла ошибка');
      }
      
      return { success: false, error: { message, code } };
    } else {
      // Ошибка сети
      console.error('Network error:', error);
      return { success: false, error: { message: 'Ошибка сети' } };
    }
  }
}
```

---

## 💡 Примеры кода

### React Hook для работы с API

```javascript
import { useState, useEffect } from 'react';
import api from './api'; // ваш настроенный axios instance

export function useCatalog(filters = {}) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState(null);
  
  useEffect(() => {
    async function fetchCatalog() {
      try {
        setLoading(true);
        const params = new URLSearchParams({
          page: filters.page || 1,
          limit: filters.limit || 20,
          ...filters,
        });
        
        const response = await api.get(`/catalog?${params}`);
        setData(response.data.data);
        setPagination(response.data.pagination);
        setError(null);
      } catch (err) {
        setError(err.response?.data?.error || { message: 'Ошибка загрузки' });
      } finally {
        setLoading(false);
      }
    }
    
    fetchCatalog();
  }, [filters.page, filters.category, filters.search]);
  
  return { data, loading, error, pagination };
}
```

### React компонент для формы создания товара

```javascript
import { useState } from 'react';
import api from './api';

function CreateProductForm() {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'vaccines',
    status: 'draft',
  });
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const formDataToSend = new FormData();
      Object.keys(formData).forEach(key => {
        formDataToSend.append(key, formData[key]);
      });
      
      if (image) {
        formDataToSend.append('image', image);
      }
      
      const response = await api.post('/admin/catalog', formDataToSend, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      
      console.log('Product created:', response.data.data);
      // Перенаправить или обновить список
    } catch (error) {
      console.error('Error creating product:', error.response?.data);
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        value={formData.title}
        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
        placeholder="Название"
        required
      />
      <textarea
        value={formData.description}
        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
        placeholder="Описание"
        required
      />
      <select
        value={formData.category}
        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
      >
        <option value="vaccines">Вакцины</option>
        <option value="medicines">Лекарства</option>
        <option value="disinfection">Дезинфекция</option>
        <option value="feed-additives">Кормовые добавки</option>
        <option value="equipment">Оборудование</option>
        <option value="premixes">Премиксы</option>
      </select>
      <input
        type="file"
        accept="image/*"
        onChange={(e) => setImage(e.target.files[0])}
      />
      <button type="submit" disabled={loading}>
        {loading ? 'Создание...' : 'Создать товар'}
      </button>
    </form>
  );
}
```

### Vue.js Composition API пример

```javascript
import { ref, onMounted } from 'vue';
import api from './api';

export function useCatalog() {
  const catalog = ref([]);
  const loading = ref(false);
  const error = ref(null);
  
  const fetchCatalog = async (filters = {}) => {
    loading.value = true;
    error.value = null;
    
    try {
      const params = new URLSearchParams({
        page: filters.page || 1,
        limit: filters.limit || 20,
        ...filters,
      });
      
      const response = await api.get(`/catalog?${params}`);
      catalog.value = response.data.data;
    } catch (err) {
      error.value = err.response?.data?.error || { message: 'Ошибка загрузки' };
    } finally {
      loading.value = false;
    }
  };
  
  onMounted(() => {
    fetchCatalog();
  });
  
  return {
    catalog,
    loading,
    error,
    fetchCatalog,
  };
}
```

---

## 🔗 Полезные ссылки

- **Базовый URL:** `http://localhost:3000`
- **Health Check:** `GET /health`
- **Документация API:** См. `BACKEND_API_SPECIFICATION.md`

## 📝 Примечания

1. **Токены:** Access token истекает через 1 час, refresh token - через 7 дней
2. **Пагинация:** По умолчанию `page=1`, `limit=20`. Максимальный `limit=100`
3. **Файлы:** Максимальный размер файла - 10MB для изображений, 20MB для документов
4. **Категории:** Используйте значения: `vaccines`, `medicines`, `disinfection`, `feed-additives`, `equipment`, `premixes`
5. **Статусы товаров:** `active`, `draft`, `archived`
6. **Статусы новостей:** `published`, `draft`, `scheduled`

---

**Версия документа:** 1.0  
**Дата обновления:** 2024-12-04

