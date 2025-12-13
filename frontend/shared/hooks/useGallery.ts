import { useGetGalleryQuery } from '../services/gallery.service';
import type { GalleryFilters } from '../services/gallery.service';

export function useGallery(filters?: GalleryFilters) {
  const { data, isLoading, error, refetch } = useGetGalleryQuery(filters || {}, {
    skip: false,
  });

  return {
    gallery: data?.data || [],
    pagination: data?.pagination,
    isLoading,
    error,
    refetch,
  };
}


