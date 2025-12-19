import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import { ImageWithFallback } from '../figma/ImageWithFallback';
import { useLanguage } from '../../shared/contexts/LanguageContext';
import { useServices } from '../../shared/hooks/useServices';
import { getLocalizedField } from '../../shared/utils/localization';
import { resolveImageUrl } from '../../shared/utils/imageUrl';
import { categoryImages } from '../../shared/constants/catalogCategories';

export function CatalogAndServicesSection() {
  const { t, language } = useLanguage();
  const { services, isLoading: isLoadingServices } = useServices();
  const [showPagination, setShowPagination] = useState(false);

  // Категории каталога (только 4 категории для главной страницы)
  const catalogCategories = [
    { id: 'vaccines', name: t('catalog.vaccines'), image: categoryImages.vaccines },
    { id: 'feed-additives', name: t('catalog.feed'), image: categoryImages['feed-additives'] },
    { id: 'medicines', name: t('catalog.medicines'), image: categoryImages.medicines },
    { id: 'disinfection', name: t('catalog.disinfection'), image: categoryImages.disinfection },
  ];

  // Объединяем категории и услуги в один массив для свайпера
  const allItems = [
    ...catalogCategories.map(cat => ({ type: 'category' as const, ...cat })),
    ...(services || []).map(service => ({
      type: 'service' as const,
      id: service.id,
      name: getLocalizedField(service, 'title', language),
      image: service.image,
    })),
  ];

  useEffect(() => {
    if (allItems.length === 0) {
      setShowPagination(false);
      return;
    }

    const updateSlidesPerView = () => {
      const width = window.innerWidth;
      let slidesPerView = 1;
      if (width >= 1280) slidesPerView = 4;
      else if (width >= 1024) slidesPerView = 3;
      else if (width >= 640) slidesPerView = 2;

      // Показываем пагинацию только если элементов больше чем может поместиться
      setShowPagination(allItems.length > slidesPerView);
    };

    updateSlidesPerView();
    window.addEventListener('resize', updateSlidesPerView);
    return () => window.removeEventListener('resize', updateSlidesPerView);
  }, [allItems.length]);

  if (isLoadingServices && allItems.length === 0) {
    return null;
  }

  if (allItems.length === 0) {
    return null;
  }

  return (
    <section className="py-12 md:py-16 lg:py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-8 md:mb-12">
          <h2 className="mb-3 md:mb-4">{t('catalogAndServices.title') || 'Каталог и услуги'}</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto text-sm md:text-base">
            {t('catalogAndServices.subtitle') || 'Изучите наш каталог продукции и услуги'}
          </p>
        </div>

        <div className="relative">
          <Swiper
            key={`catalog-services-${showPagination}-${allItems.length}`}
            modules={[Navigation, Pagination, Autoplay]}
            spaceBetween={24}
            slidesPerView={1}
            loop={showPagination && allItems.length > 4}
            navigation={showPagination ? {
              nextEl: '.swiper-button-next-catalog',
              prevEl: '.swiper-button-prev-catalog',
            } : false}
            pagination={
              showPagination
                ? { 
                    clickable: true, 
                    el: '.swiper-pagination-catalog',
                    type: 'bullets',
                    dynamicBullets: false,
                  }
                : false
            }
            autoplay={showPagination ? { delay: 3000, disableOnInteraction: false } : false}
            watchOverflow={true}
            breakpoints={{
              640: { slidesPerView: 2 },
              1024: { slidesPerView: 3 },
              1280: { slidesPerView: 4 },
            }}
            className="catalog-services-swiper"
          >
          {allItems.map((item, index) => {
            const isCategory = item.type === 'category';
            const href = isCategory
              ? `/catalog?category=${item.id}`
              : `/services/${item.id}`;

            return (
              <SwiperSlide key={`${item.type}-${item.id || index}`}>
                <Link
                  to={href}
                  className="block bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 h-full group hover:-translate-y-2"
                >
                  <div className="relative h-72 overflow-hidden">
                    <ImageWithFallback
                      src={resolveImageUrl(item.image || '')}
                      alt={item.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent group-hover:from-black/90 transition-colors duration-300" />
                    <div className="absolute bottom-0 left-0 right-0 p-6">
                      <h3 className="text-white text-xl font-semibold group-hover:translate-y-[-4px] transition-transform duration-300">
                        {item.name}
                      </h3>
                    </div>
                  </div>
                </Link>
              </SwiperSlide>
            );
          })}
          </Swiper>
          {showPagination && (
            <>
              <button 
                className="swiper-button-prev-catalog absolute left-0 top-1/2 -translate-y-1/2 z-10 w-10 h-10 bg-white rounded-full shadow-lg flex items-center justify-center cursor-pointer hover:bg-gray-50 transition-colors -left-4 lg:-left-6"
                aria-label="Previous"
              >
                <ChevronLeft className="w-5 h-5 text-gray-700" />
              </button>
              <button 
                className="swiper-button-next-catalog absolute right-0 top-1/2 -translate-y-1/2 z-10 w-10 h-10 bg-white rounded-full shadow-lg flex items-center justify-center cursor-pointer hover:bg-gray-50 transition-colors -right-4 lg:-right-6"
                aria-label="Next"
              >
                <ChevronRight className="w-5 h-5 text-gray-700" />
              </button>
              <div className="swiper-pagination-catalog mt-8 !relative !bottom-0 flex justify-center gap-2" />
            </>
          )}
        </div>
      </div>
    </section>
  );
}
