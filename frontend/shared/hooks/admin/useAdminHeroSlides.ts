import {
  useGetAdminHeroSlidesQuery,
  useGetAdminHeroSlideQuery,
  useCreateHeroSlideMutation,
  useUpdateHeroSlideMutation,
  useDeleteHeroSlideMutation,
  type HeroSlidesFilters,
} from '../../services/hero-slides.service';

export function useAdminHeroSlides(filters?: HeroSlidesFilters) {
  const { data, isLoading, error, refetch } = useGetAdminHeroSlidesQuery(filters || {});

  return {
    heroSlides: data?.data || [],
    pagination: data?.pagination,
    isLoading,
    error,
    refetch,
  };
}

export function useAdminHeroSlide(id: string | undefined) {
  const { data, isLoading, error } = useGetAdminHeroSlideQuery(id!, {
    skip: !id,
  });

  return {
    heroSlide: data?.data,
    isLoading,
    error,
  };
}

export function useHeroSlidesMutations() {
  const [createHeroSlide, { isLoading: isCreating }] = useCreateHeroSlideMutation();
  const [updateHeroSlide, { isLoading: isUpdating }] = useUpdateHeroSlideMutation();
  const [deleteHeroSlide, { isLoading: isDeleting }] = useDeleteHeroSlideMutation();

  return {
    createHeroSlide,
    updateHeroSlide,
    deleteHeroSlide,
    isCreating,
    isUpdating,
    isDeleting,
  };
}
