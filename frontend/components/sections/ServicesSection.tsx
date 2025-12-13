import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
// import { SERVICES } from '../../shared/data/services';
import { ImageWithFallback } from '../figma/ImageWithFallback';
import { useLanguage } from '../../shared/contexts/LanguageContext';
import { useServices } from '../../shared/hooks/useServices';
import { getLocalizedField } from '../../shared/utils/localization';

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
    <section className="py-12 md:py-16 lg:py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-8 md:mb-12">
          <h2 className="mb-3 md:mb-4">{t('services.title')}</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto text-sm md:text-base">
            {t('services.subtitle')}
          </p>
        </div>

        <Swiper
          modules={[Navigation, Pagination, Autoplay]}
          spaceBetween={24}
          slidesPerView={1}
          loop={showPagination}
          navigation={showPagination}
          pagination={showPagination ? { clickable: true } : false}
          autoplay={{ delay: 2000, disableOnInteraction: false }}
          breakpoints={{
            640: { slidesPerView: 2 },
            1024: { slidesPerView: 3 },
            1280: { slidesPerView: 4 },
          }}
          className="services-swiper"
          onSwiper={(swiper) => {
            // Prevent link navigation when clicking navigation buttons
            const nextBtn = swiper.navigation?.nextEl;
            const prevBtn = swiper.navigation?.prevEl;
            if (nextBtn) {
              nextBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                e.preventDefault();
              });
            }
            if (prevBtn) {
              prevBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                e.preventDefault();
              });
            }
          }}
        >
          {services.map((service) => {
            const title = getLocalizedField(service, 'title', language);
            const description = getLocalizedField(service, 'shortDescription', language) || 
                               getLocalizedField(service, 'description', language);
            
            return (
              <SwiperSlide key={service.id}>
                <Link
                  to={`/services/${service.id}`}
                  className="block bg-white rounded-2xl overflow-hidden transition-all h-full group"
                >
                  <div className="relative h-48 overflow-hidden">
                    <ImageWithFallback
                      src={service.image || ''}
                      alt={title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div
                      className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"
                    />
                    <h3 className="absolute bottom-4 left-4 right-4 text-white">
                      {title}
                    </h3>
                  </div>
                  <div className="p-6">
                    <p className="text-muted-foreground text-sm">{description}</p>
                  </div>
                </Link>
              </SwiperSlide>
            );
          })}
        </Swiper>
      </div>

    </section>
  );
}
