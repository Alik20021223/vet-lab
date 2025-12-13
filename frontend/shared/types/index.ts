export interface Service {
  id: string;
  title: string;
  description: string;
  icon: string;
  image?: string;
  href: string;
  fullDescription?: string;
  benefits?: string[];
}

export interface NewsItem {
  id: string;
  title: string;
  description: string;
  image: string;
  date: string;
  content?: string;
}

export interface TeamMember {
  id: string;
  name: string;
  position: string;
  photo?: string;
  image?: string; // for backwards compatibility
}

export interface Partner {
  id: string;
  name: string;
  logo?: string;
}

export interface CatalogItem {
  id: string;
  title: string;
  category: string;
  description: string;
  fullDescription?: string;
  applicationMethod?: string;
  brand?: {
    id: string;
    name: string;
    logo?: string;
  };
  image: string;
  price?: string;
}
