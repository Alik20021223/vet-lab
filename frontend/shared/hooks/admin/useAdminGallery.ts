import {
  useGetAdminGalleryQuery,
  useGetAdminGalleryItemQuery,
  useCreateGalleryItemMutation,
  useUpdateGalleryItemMutation,
  useDeleteGalleryItemMutation,
  type GalleryFilters,
} from '../../services/gallery.service';

export function useAdminGallery(filters?: GalleryFilters) {
  const { data, isLoading, error, refetch } = useGetAdminGalleryQuery(filters || {});

  return {
    gallery: data?.data || [],
    pagination: data?.pagination,
    isLoading,
    error,
    refetch,
  };
}

export function useAdminGalleryItem(id: string | undefined) {
  const { data, isLoading, error } = useGetAdminGalleryItemQuery(id!, {
    skip: !id,
  });

  return {
    galleryItem: data?.data,
    isLoading,
    error,
  };
}

export function useGalleryMutations() {
  const [createGalleryItem, { isLoading: isCreating }] = useCreateGalleryItemMutation();
  const [updateGalleryItem, { isLoading: isUpdating }] = useUpdateGalleryItemMutation();
  const [deleteGalleryItem, { isLoading: isDeleting }] = useDeleteGalleryItemMutation();

  return {
    createGalleryItem,
    updateGalleryItem,
    deleteGalleryItem,
    isCreating,
    isUpdating,
    isDeleting,
  };
}

