import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import { ArrowRight, Calendar } from 'lucide-react';
import { BRAND } from '../../shared/constants/brand';
import { ImageWithFallback } from '../figma/ImageWithFallback';
import { useNews } from '../../shared/hooks/useNews';
import { useLanguage } from '../../shared/contexts/LanguageContext';
import { getLocalizedField } from '../../shared/utils/localization';

// const NEWS_ITEMS = [
//   {
//     id: '1',
//     title: 'Открытие новой лаборатории в Худжанде',
//     description: 'Мы рады сообщить об открытии нашей новой, современной лаборатории, оснащенной передовым оборудованием.',
//     image: 'https://images.unsplash.com/photo-1742970936099-b68c962278c9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsYWJvcmF0b3J5JTIwZXF1aXBtZW50JTIwbW9kZXJufGVufDF8fHx8MTc2NDU0NDUxMnww&ixlib=rb-4.1.0&q=80&w=1080',
//     date: '15.11.2024',
//   },
//   {
//     id: '2',
//     title: 'Участие в международной конференции',
//     description: 'Команда VET-LAB приняла участие в крупнейшей ветеринарной конференции Центральной Азии.',
//     image: 'https://images.unsplash.com/photo-1700665537650-1bf37979aae0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx2ZXRlcmluYXJ5JTIwY29uZmVyZW5jZSUyMHByb2Zlc3Npb25hbHxlbnwxfHx8fDE3NjQ2MDgwMzV8MA&ixlib=rb-4.1.0&q=80&w=1080',
//     date: '01.11.2024',
//   },
//   {
//     id: '3',
//     title: 'Новая линейка вакцин',
//     description: 'Представляем обновленную линейку вакцин для птицеводства с улучшенной формулой.',
//     image: 'https://images.unsplash.com/photo-1608422050828-485141c98429?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx2YWNjaW5lJTIwbWVkaWNhbCUyMHZldGVyaW5hcnl8ZW58MXx8fHwxNzY0NjA4MDM2fDA&ixlib=rb-4.1.0&q=80&w=1080',
//     date: '20.10.2024',
//   },
//   {
//     id: '4',
//     title: 'Расширение партнерской сети',
//     description: 'VET-LAB заключил соглашения с ведущими производителями ветеринарных препаратов.',
//     image: 'https://images.unsplash.com/photo-1745847768380-2caeadbb3b71?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxidXNpbmVzcyUyMHBhcnRuZXJzaGlwJTIwaGFuZHNoYWtlfGVufDF8fHx8MTc2NDU5Mjc5Nnww&ixlib=rb-4.1.0&q=80&w=1080',
//     date: '10.10.2024',
//   },
// ];

export function NewsSection() {
  const { news, isLoading } = useNews({ limit: 4 });
  const { t, language } = useLanguage();
  const [showPagination, setShowPagination] = useState(false);

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
  
  if (isLoading || !news || news.length === 0) {
    return null;
  }

  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="flex items-end justify-between mb-12">
          <div>
            <h2 className="mb-4">{t('news.title')}</h2>
            <p className="text-muted-foreground max-w-2xl">
              {t('news.subtitle')}
            </p>
          </div>
          <Link
            to="/news"
            className="flex items-center gap-2 hover:gap-3 transition-all"
            style={{ color: BRAND.colors.primary }}
          >
            {t('common.viewAll')}
            <ArrowRight className="w-5 h-5" />
          </Link>
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
          }}
          className="news-swiper"
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
          {news.map((newsItem) => {
            const title = getLocalizedField(newsItem, 'title', language);
            const excerpt = getLocalizedField(newsItem, 'excerpt', language);
            
            return (
              <SwiperSlide key={newsItem.id}>
                <Link
                  to={`/news/${newsItem.id}`}
                  className="block bg-white rounded-xl overflow-hidden border border-gray-100 transition-all h-full group"
                >
                  <div className="relative h-48 overflow-hidden">
                    <ImageWithFallback
                      src={(newsItem as import('../../shared/types/admin').AdminNews).coverImage || ''}
                      alt={title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                  </div>
                  <div className="p-5">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground mb-3">
                      <Calendar className="w-4 h-4" />
                      <span>{(newsItem as import('../../shared/types/admin').AdminNews).publishedAt || newsItem.createdAt}</span>
                    </div>
                    <h3 className="mb-3 line-clamp-2">{title}</h3>
                    <p className="text-muted-foreground text-sm line-clamp-3 mb-4">{excerpt || ''}</p>
                    <span
                      className="inline-flex items-center gap-2 hover:gap-3 transition-all"
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
      </div>

    </section>
  );
}
