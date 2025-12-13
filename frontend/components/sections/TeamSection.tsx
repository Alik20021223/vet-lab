import { useState, useEffect } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import { ImageWithFallback } from '../figma/ImageWithFallback';
import { useTeam } from '../../shared/hooks/useTeam';
import { useLanguage } from '../../shared/contexts/LanguageContext';

// Default avatar if no photo is provided
const DEFAULT_AVATAR = 'https://images.unsplash.com/photo-1511367461989-f85a21fda167?w=400&h=400&fit=crop';

export function TeamSection() {
  const { team, isLoading } = useTeam();
  const { t, language } = useLanguage();
  const [showPagination, setShowPagination] = useState(false);

  useEffect(() => {
    if (!team || team.length === 0) return;
    
    const updateSlidesPerView = () => {
      const width = window.innerWidth;
      let slidesPerView = 1;
      if (width >= 1280) slidesPerView = 4;
      else if (width >= 1024) slidesPerView = 3;
      else if (width >= 640) slidesPerView = 2;
      
      setShowPagination(team.length > slidesPerView);
    };

    updateSlidesPerView();
    window.addEventListener('resize', updateSlidesPerView);
    return () => window.removeEventListener('resize', updateSlidesPerView);
  }, [team]);
  
  if (isLoading || !team || team.length === 0) {
    return null;
  }

  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="mb-4">{t('team.title')}</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            {t('team.subtitle')}
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
          className="team-swiper"
        >
          {team.map((member) => {
            const displayName = language === 'en' && (member as any).nameEn 
              ? (member as any).nameEn 
              : member.name;
            const displayPosition = language === 'en' && (member as any).positionEn 
              ? (member as any).positionEn 
              : member.position;
            const photoUrl = (member as any).photo || (member as any).image || DEFAULT_AVATAR;

            return (
              <SwiperSlide key={member.id}>
                <div className="bg-white rounded-2xl overflow-hidden border border-gray-100 transition-all h-full group">
                  <div className="relative h-64 overflow-hidden">
                    <ImageWithFallback
                      src={photoUrl}
                      alt={displayName}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                  </div>
                  <div className="p-6 text-center">
                    <h3 className="mb-2">{displayName}</h3>
                    <p className="text-muted-foreground">{displayPosition}</p>
                  </div>
                </div>
              </SwiperSlide>
            );
          })}
        </Swiper>
      </div>

    </section>
  );
}
