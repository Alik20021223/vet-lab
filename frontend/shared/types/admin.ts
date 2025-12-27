export interface AdminUser {
  id: string;
  email: string;
  name: string;
  role: 'super_admin' | 'admin' | 'editor';
  avatar?: string;
  createdAt: string;
  lastLogin?: string;
}

export interface DashboardStats {
  totalProducts: number;
  totalServices: number;
  totalNews: number;
  totalTeamMembers: number;
  totalPartners: number;
  totalGalleryItems?: number;
  totalBrands?: number;
  totalCareers?: number;
  productsByCategory: {
    category: string;
    count: number;
    percentage?: number;
  }[];
  changes?: {
    products?: ChangeStat;
    services?: ChangeStat;
    news?: ChangeStat;
    teamMembers?: ChangeStat;
    partners?: ChangeStat;
    galleryItems?: ChangeStat;
    brands?: ChangeStat;
    careers?: ChangeStat;
  };
  recentActivity?: ActivityLog[];
}

export interface ChangeStat {
  value: number;
  type: 'percent' | 'absolute';
  period: 'day' | 'week' | 'month' | 'year';
}

export interface ActivityLog {
  id: string;
  action: 'create' | 'update' | 'delete';
  entity: string;
  entityId: string;
  entityName?: string;
  user: {
    id: string;
    name: string;
    email: string;
  } | string; // Поддержка старого формата (string) и нового (object)
  timestamp: string;
  details: string;
  metadata?: {
    ip?: string;
    userAgent?: string;
    changes?: string[];
    [key: string]: any;
  };
}

export interface Brand {
  id: string;
  name: string;
  logo?: string;
  description?: string;
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
}

export interface CatalogItem {
  id: string;
  title: string;
  titleEn?: string;
  description: string;
  descriptionEn?: string;
  fullDescription?: string; // HTML content
  fullDescriptionEn?: string;
  applicationMethod?: string; // HTML content
  applicationMethodEn?: string;
  category: 'vaccines' | 'medicines' | 'disinfection' | 'feed-additives' | 'equipment' | 'antibiotics';
  brandId?: string;
  brand?: Brand;
  image?: string;
  documents?: string[];
  status: 'active' | 'draft' | 'archived';
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
}

export interface AdminService {
  id: string;
  title: string;
  titleEn?: string;
  description?: string; // Поле из API
  shortDescription?: string;
  shortDescriptionEn?: string;
  fullDescription: string;
  fullDescriptionEn?: string;
  image?: string;
  icon?: string;
  status: 'active' | 'draft';
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
  href?: string;
  benefits?: string[];
}

export interface AdminNews {
  id: string;
  title: string;
  titleEn?: string;
  excerpt: string;
  excerptEn?: string;
  content: string;
  contentEn?: string;
  coverImage?: string;
  publishedAt: string;
  status: 'published' | 'draft' | 'scheduled';
  author?: string;
  createdAt: string;
  updatedAt: string;
}

export interface AdminTeamMember {
  id: string;
  name: string;
  nameEn?: string;
  position: string;
  positionEn?: string;
  photo?: string;
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
}

export interface AdminPartner {
  id: string;
  name: string;
  logo?: string;
  url?: string;
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
}

export interface GalleryItem {
  id: string;
  image: string;
  sectionId?: string;
  category?: string;
  description?: string;
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
}

export interface GallerySection {
  id: string;
  title: string;
  titleEn?: string;
  sortOrder: number;
  items: GalleryItem[];
  createdAt: string;
  updatedAt: string;
}

export interface AdminGalleryItem {
  id: string;
  image: string;
  sectionId?: string;
  category?: string;
  description?: string;
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
}

export interface HeroSlide {
  id: string;
  image: string;
  title: string;
  titleEn?: string;
  sortOrder: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ContactInfo {
  phone: string;
  email: string;
  address: string;
  addressEn?: string | null;
  mapLat: number;
  mapLng: number;
  workingHours?: string | null;
  workingHoursEn?: string | null;
  facebook?: string | null;
  instagram?: string | null;
  telegram?: string | null;
}

export interface StaticPage {
  slug: string;
  title: string;
  content: string;
  seo?: {
    metaTitle?: string;
    metaDescription?: string;
    metaKeywords?: string;
  };
  updatedAt: string;
}

export interface AdminJob {
  id: string;
  title: string;
  titleEn?: string;
  description: string;
  descriptionEn?: string;
  fullDescription: string;
  fullDescriptionEn?: string;
  location: string;
  locationEn?: string;
  type: 'full-time' | 'part-time' | 'contract' | 'internship';
  department?: string;
  departmentEn?: string;
  requirements: string[];
  requirementsEn?: string[];
  responsibilities: string[];
  responsibilitiesEn?: string[];
  benefits: string[];
  benefitsEn?: string[];
  salary?: {
    min: number;
    max: number;
    currency: string;
  };
  status: 'active' | 'draft' | 'closed' | 'expired';
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
  expiresAt?: string;
}

export const CATALOG_CATEGORIES = {
  vaccines: 'Вакцины',
  medicines: 'Ветеринарные препараты',
  disinfection: 'Средства для дезинфекции и мойки',
  'feed-additives': 'Кормовые добавки',
  equipment: 'Оборудование/инструменты',
  antibiotics: 'Антибиотики',
} as const;

export type CatalogCategory = keyof typeof CATALOG_CATEGORIES;
