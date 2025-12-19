import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
// import { SERVICES } from '../../shared/data/services';
import { ImageWithFallback } from '../figma/ImageWithFallback';
import { useLanguage } from '../../shared/contexts/LanguageContext';
import { useServices } from '../../shared/hooks/useServices';
import { getLocalizedField } from '../../shared/utils/localization';
import { resolveImageUrl } from '../../shared/utils/imageUrl';

export function ServicesSection() {
  const { t, language } = useLanguage();
  const { services, isLoading } = useServices();
  const [showPagination, setShowPagination] = useState(false);

  useEffect(() => {
    if (!services || services.length === 0) return;

    const updateSlidesPerView = () => {
      const width = window.innerWidth;
      let slidesPerView = 1;
      if (width >= 1280) slidesPerView = 4;
      else if (width >= 1024) slidesPerView = 3;
      else if (width >= 640) slidesPerView = 2;

      setShowPagination(services.length > slidesPerView);
    };

    updateSlidesPerView();
    window.addEventListener('resize', updateSlidesPerView);
    return () => window.removeEventListener('resize', updateSlidesPerView);
  }, [services]);

  if (isLoading || !services || services.length === 0) {
    return null;
  }

  return (
    <section className="py-12 md:py-16 lg:py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-8 md:mb-12">
          <h2 className="mb-3 md:mb-4">{t('services.title')}</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto text-sm md:text-base">
            {t('services.subtitle')}
          </p>
        </div>

        <div className="relative">
          <Swiper
            key={`services-${showPagination}-${services.length}`}
            modules={[Navigation, Pagination, Autoplay]}
            spaceBetween={24}
            slidesPerView={1}
            loop={showPagination && services.length > 4}
            navigation={showPagination ? {
              nextEl: '.swiper-button-next-services',
              prevEl: '.swiper-button-prev-services',
            } : false}
            pagination={showPagination ? { 
              clickable: true, 
              el: '.swiper-pagination-services',
              type: 'bullets',
              dynamicBullets: false,
            } : false}
            autoplay={showPagination ? { delay: 2000, disableOnInteraction: false } : false}
            watchOverflow={true}
            breakpoints={{
              640: { slidesPerView: 2 },
              1024: { slidesPerView: 3 },
              1280: { slidesPerView: 4 },
            }}
            className="services-swiper"
          >
          {services.map((service) => {
            const title = getLocalizedField(service, 'title', language);
            const description = getLocalizedField(service, 'shortDescription', language) ||
              getLocalizedField(service, 'description', language);

            return (
              <SwiperSlide key={service.id}>
                <Link
                  to={`/services/${service.id}`}
                  className="block bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 h-full group hover:-translate-y-2"
                >
                  <div className="relative h-48 overflow-hidden">
                    <ImageWithFallback
                      src={resolveImageUrl(service.image || '')}
                      alt={title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div
                      className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent group-hover:from-black/70 transition-colors duration-300"
                    />
                    <h3 className="absolute bottom-4 left-4 right-4 text-white group-hover:translate-y-[-4px] transition-transform duration-300">
                      {title}
                    </h3>
                  </div>
                  <div className="p-6">
                    <p className="text-muted-foreground text-sm group-hover:text-gray-900 transition-colors duration-300">{description}</p>
                  </div>
                </Link>
              </SwiperSlide>
            );
          })}
          </Swiper>
          {showPagination && (
            <>
              <button 
                className="swiper-button-prev-services absolute left-0 top-1/2 -translate-y-1/2 z-10 w-10 h-10 bg-white rounded-full shadow-lg flex items-center justify-center cursor-pointer hover:bg-gray-50 transition-colors -left-4 lg:-left-6"
                aria-label="Previous"
              >
                <ChevronLeft className="w-5 h-5 text-gray-700" />
              </button>
              <button 
                className="swiper-button-next-services absolute right-0 top-1/2 -translate-y-1/2 z-10 w-10 h-10 bg-white rounded-full shadow-lg flex items-center justify-center cursor-pointer hover:bg-gray-50 transition-colors -right-4 lg:-right-6"
                aria-label="Next"
              >
                <ChevronRight className="w-5 h-5 text-gray-700" />
              </button>
              <div className="swiper-pagination-services mt-8 !relative !bottom-0 flex justify-center gap-2" />
            </>
          )}
        </div>
      </div>
    </section>
  );
}
