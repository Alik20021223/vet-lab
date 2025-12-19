import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import { ArrowRight, Calendar, ChevronLeft, ChevronRight } from 'lucide-react';
import { BRAND } from '../../shared/constants/brand';
import { ImageWithFallback } from '../figma/ImageWithFallback';
import { useNews } from '../../shared/hooks/useNews';
import { useLanguage } from '../../shared/contexts/LanguageContext';
import { getLocalizedField } from '../../shared/utils/localization';
import { resolveImageUrl } from '@/shared/utils/imageUrl';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}


export function NewsSection() {
  const { news, isLoading } = useNews({ limit: 4 });
  const { t, language } = useLanguage();
  const [showPagination, setShowPagination] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const swiperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!news || news.length === 0) return;

    const updateSlidesPerView = () => {
      const width = window.innerWidth;
      let slidesPerView = 1;
      if (width >= 1024) slidesPerView = 3;
      else if (width >= 640) slidesPerView = 2;

      setShowPagination(news.length > slidesPerView);
    };

    updateSlidesPerView();
    window.addEventListener('resize', updateSlidesPerView);
    return () => window.removeEventListener('resize', updateSlidesPerView);
  }, [news]);

  // GSAP анимации
  useEffect(() => {
    if (sectionRef.current && headerRef.current && swiperRef.current && !isLoading && news && news.length > 0) {
      // Анимация заголовка
      gsap.fromTo(headerRef.current,
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

      // Анимация карточек новостей
      const cards = swiperRef.current.querySelectorAll('.swiper-slide');
      if (cards.length > 0) {
        gsap.fromTo(cards,
          { opacity: 0, y: 60, scale: 0.95 },
          {
            opacity: 1,
            y: 0,
            scale: 1,
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
  }, [isLoading, news]);

  if (isLoading || !news || news.length === 0) {
    return null;
  }

  return (
    <section ref={sectionRef} className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div ref={headerRef} className="flex items-end justify-between mb-12">
          <div>
            <h2 className="mb-4">{t('news.title')}</h2>
            <p className="text-muted-foreground max-w-2xl">
              {t('news.subtitle')}
            </p>
          </div>
          <Link
            to="/news"
            className="flex items-center gap-2 hover:gap-3 transition-all duration-200 hover:scale-105"
            style={{ color: BRAND.colors.primary }}
          >
            {t('common.viewAll')}
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>

        <div ref={swiperRef} className="relative">
          <Swiper
            key={`news-${showPagination}-${news.length}`}
            modules={[Navigation, Pagination, Autoplay]}
            spaceBetween={24}
            slidesPerView={1}
            loop={showPagination && news.length > 3}
            navigation={showPagination ? {
              nextEl: '.swiper-button-next-news',
              prevEl: '.swiper-button-prev-news',
            } : false}
            pagination={showPagination ? { 
              clickable: true, 
              el: '.swiper-pagination-news',
              type: 'bullets',
              dynamicBullets: false,
            } : false}
            autoplay={showPagination ? { delay: 2000, disableOnInteraction: false } : false}
            watchOverflow={true}
            breakpoints={{
              640: { slidesPerView: 2 },
              1024: { slidesPerView: 3 },
            }}
            className="news-swiper"
          >
            {news.map((newsItem) => {
              const title = getLocalizedField(newsItem, 'title', language);
              const excerpt = getLocalizedField(newsItem, 'excerpt', language);

              return (
                <SwiperSlide key={newsItem.id}>
                  <Link
                    to={`/news/${newsItem.id}`}
                    className="block bg-white rounded-xl overflow-hidden border border-gray-100 shadow-md hover:shadow-xl transition-all duration-300 h-full group hover:-translate-y-2"
                  >
                    <div className="relative h-48 overflow-hidden">
                      <ImageWithFallback
                        src={resolveImageUrl((newsItem as import('../../shared/types/admin').AdminNews).coverImage || '')}
                        alt={title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                    </div>
                    <div className="p-5">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground mb-3">
                        <Calendar className="w-4 h-4" />
                        <span>{(newsItem as import('../../shared/types/admin').AdminNews).publishedAt || newsItem.createdAt}</span>
                      </div>
                      <h3 className="mb-3 line-clamp-2 group-hover:text-primary transition-colors duration-300">{title}</h3>
                      <p className="text-muted-foreground text-sm line-clamp-3 mb-4 group-hover:text-gray-700 transition-colors duration-300">{excerpt || ''}</p>
                      <span
                        className="inline-flex items-center gap-2 hover:gap-3 transition-all duration-200"
                        style={{ color: BRAND.colors.primary }}
                      >
                        {t('news.readMore')}
                        <ArrowRight className="w-4 h-4" />
                      </span>
                    </div>
                  </Link>
                </SwiperSlide>
              );
            })}
          </Swiper>
          {showPagination && (
            <>
              <button 
                className="swiper-button-prev-news absolute left-0 top-1/2 -translate-y-1/2 z-10 w-10 h-10 bg-white rounded-full shadow-lg flex items-center justify-center cursor-pointer hover:bg-gray-50 transition-colors -left-4 lg:-left-6"
                aria-label="Previous"
              >
                <ChevronLeft className="w-5 h-5 text-gray-700" />
              </button>
              <button 
                className="swiper-button-next-news absolute right-0 top-1/2 -translate-y-1/2 z-10 w-10 h-10 bg-white rounded-full shadow-lg flex items-center justify-center cursor-pointer hover:bg-gray-50 transition-colors -right-4 lg:-right-6"
                aria-label="Next"
              >
                <ChevronRight className="w-5 h-5 text-gray-700" />
              </button>
              <div className="swiper-pagination-news mt-8 !relative !bottom-0 flex justify-center gap-2" />
            </>
          )}
        </div>
      </div>

    </section>
  );
}
