export const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

export const API_ENDPOINTS = {
  // AUTH
  AUTH: {
    LOGIN: '/admin/login',
    LOGOUT: '/admin/logout',
    PROFILE: '/admin/profile',
  },

  // DASHBOARD
  DASHBOARD: {
    STATS: '/admin/dashboard/stats',
    ACTIVITY: '/admin/dashboard/activity',
  },

  // CATALOG
  CATALOG: {
    LIST: (category: string) => `/admin/catalog/${category}`,
    CREATE: (category: string) => `/admin/catalog/${category}`,
    GET: (category: string, id: string) => `/admin/catalog/${category}/${id}`,
    UPDATE: (category: string, id: string) => `/admin/catalog/${category}/${id}`,
    DELETE: (category: string, id: string) => `/admin/catalog/${category}/${id}`,
  },

  // SERVICES
  SERVICES: {
    LIST: '/admin/services',
    CREATE: '/admin/services',
    GET: (id: string) => `/admin/services/${id}`,
    UPDATE: (id: string) => `/admin/services/${id}`,
    DELETE: (id: string) => `/admin/services/${id}`,
  },

  // NEWS
  NEWS: {
    LIST: '/admin/news',
    CREATE: '/admin/news',
    GET: (id: string) => `/admin/news/${id}`,
    UPDATE: (id: string) => `/admin/news/${id}`,
    DELETE: (id: string) => `/admin/news/${id}`,
  },

  // TEAM
  TEAM: {
    LIST: '/admin/team',
    CREATE: '/admin/team',
    GET: (id: string) => `/admin/team/${id}`,
    UPDATE: (id: string) => `/admin/team/${id}`,
    DELETE: (id: string) => `/admin/team/${id}`,
  },

  // PARTNERS
  PARTNERS: {
    LIST: '/admin/partners',
    CREATE: '/admin/partners',
    GET: (id: string) => `/admin/partners/${id}`,
    UPDATE: (id: string) => `/admin/partners/${id}`,
    DELETE: (id: string) => `/admin/partners/${id}`,
  },

  // GALLERY
  GALLERY: {
    LIST: '/admin/gallery',
    CREATE: '/admin/gallery',
    GET: (id: string) => `/admin/gallery/${id}`,
    UPDATE: (id: string) => `/admin/gallery/${id}`,
    DELETE: (id: string) => `/admin/gallery/${id}`,
  },

  // CONTACTS
  CONTACTS: {
    GET: '/admin/contacts',
    UPDATE: '/admin/contacts',
  },

  // STATIC PAGES
  PAGES: {
    GET: (slug: string) => `/admin/page/${slug}`,
    UPDATE: (slug: string) => `/admin/page/${slug}`,
  },

  // UPLOADS
  UPLOADS: {
    IMAGE: '/admin/upload/image',
    FILE: '/admin/upload/file',
  },

  // ADMIN USERS
  USERS: {
    LIST: '/admin/users',
    CREATE: '/admin/users',
    GET: (id: string) => `/admin/users/${id}`,
    UPDATE: (id: string) => `/admin/users/${id}`,
    DELETE: (id: string) => `/admin/users/${id}`,
  },
} as const;
