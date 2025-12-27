import { useGetGalleryQuery, useGetGalleryItemsQuery } from '../services/gallery.service';
import type { GalleryFilters } from '../services/gallery.service';

export function useGallery(filters?: GalleryFilters) {
  const { data, isLoading, error, refetch } = useGetGalleryQuery(undefined, {
    skip: false,
  });

  return {
    sections: data?.data || [],
    isLoading,
    error,
    refetch,
  };
}

export function useGalleryItems(filters?: GalleryFilters) {
  const { data, isLoading, error, refetch } = useGetGalleryItemsQuery(filters || {}, {
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


