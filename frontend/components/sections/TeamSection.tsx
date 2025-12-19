import { useState, useEffect, useRef } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import { ImageWithFallback } from '../figma/ImageWithFallback';
import { useTeam } from '../../shared/hooks/useTeam';
import { useLanguage } from '../../shared/contexts/LanguageContext';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

// Default avatar if no photo is provided
const DEFAULT_AVATAR = 'https://images.unsplash.com/photo-1511367461989-f85a21fda167?w=400&h=400&fit=crop';

export function TeamSection() {
  const { team, isLoading } = useTeam();
  const { t, language } = useLanguage();
  const [showPagination, setShowPagination] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);
  const titleRef = useRef<HTMLDivElement>(null);
  const swiperRef = useRef<HTMLDivElement>(null);

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

  // GSAP анимации
  useEffect(() => {
    if (sectionRef.current && titleRef.current && swiperRef.current && !isLoading && team && team.length > 0) {
      // Анимация заголовка
      gsap.fromTo(titleRef.current,
        { opacity: 0, y: 40 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 80%',
            toggleActions: 'play none none none',
            once: true,
          },
        }
      );

      // Анимация карточек команды
      const cards = swiperRef.current.querySelectorAll('.swiper-slide');
      if (cards.length > 0) {
        gsap.fromTo(cards,
          { opacity: 0, y: 60, rotationY: -15 },
          {
            opacity: 1,
            y: 0,
            rotationY: 0,
            duration: 0.8,
            ease: 'power3.out',
            stagger: 0.15,
            scrollTrigger: {
              trigger: sectionRef.current,
              start: 'top 75%',
              toggleActions: 'play none none none',
              once: true,
            },
          }
        );
      }
    }

    return () => {
      ScrollTrigger.getAll().forEach((trigger) => {
        if (trigger.vars.trigger === sectionRef.current) {
          trigger.kill();
        }
      });
    };
  }, [isLoading, team]);
  
  if (isLoading || !team || team.length === 0) {
    return null;
  }

  return (
    <section ref={sectionRef} className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div ref={titleRef} className="text-center mb-12">
          <h2 className="mb-4">{t('team.title')}</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            {t('team.subtitle')}
          </p>
        </div>

        <div ref={swiperRef} className="relative">
          <Swiper
            modules={[Navigation, Pagination, Autoplay]}
            spaceBetween={24}
            slidesPerView={1}
            loop={showPagination && team.length > 4}
            navigation={showPagination ? {
              nextEl: '.swiper-button-next-team',
              prevEl: '.swiper-button-prev-team',
            } : false}
            pagination={showPagination ? { 
              clickable: true, 
              el: '.swiper-pagination-team',
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
                <div className="bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-md hover:shadow-xl transition-all duration-300 h-full group hover:-translate-y-2">
                  <div className="relative h-64 overflow-hidden">
                    <ImageWithFallback
                      src={photoUrl}
                      alt={displayName}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                  </div>
                  <div className="p-6 text-center">
                    <h3 className="mb-2 group-hover:text-primary transition-colors duration-300">{displayName}</h3>
                    <p className="text-muted-foreground group-hover:text-gray-700 transition-colors duration-300">{displayPosition}</p>
                  </div>
                </div>
              </SwiperSlide>
            );
          })}
          </Swiper>
          {showPagination && (
            <>
              <button 
                className="swiper-button-prev-team absolute left-0 top-1/2 -translate-y-1/2 z-10 w-10 h-10 bg-white rounded-full shadow-lg flex items-center justify-center cursor-pointer hover:bg-gray-50 transition-colors -left-4 lg:-left-6"
                aria-label="Previous"
              >
                <ChevronLeft className="w-5 h-5 text-gray-700" />
              </button>
              <button 
                className="swiper-button-next-team absolute right-0 top-1/2 -translate-y-1/2 z-10 w-10 h-10 bg-white rounded-full shadow-lg flex items-center justify-center cursor-pointer hover:bg-gray-50 transition-colors -right-4 lg:-right-6"
                aria-label="Next"
              >
                <ChevronRight className="w-5 h-5 text-gray-700" />
              </button>
              <div className="swiper-pagination-team mt-8 !relative !bottom-0 flex justify-center gap-2" />
            </>
          )}
        </div>
      </div>
    </section>
  );
}
