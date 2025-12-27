import { Link } from 'react-router-dom';
import { Calendar, ArrowRight } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
// import { NEWS } from '../shared/data/news';
import { BRAND } from '../shared/constants/brand';
import { ImageWithFallback } from '../components/figma/ImageWithFallback';
import { Breadcrumbs } from '../components/Breadcrumbs';
import { Pagination } from '../components/ui/pagination';
import { useLanguage } from '../shared/contexts/LanguageContext';
import { useNews } from '../shared/hooks/useNews';
import { getLocalizedField } from '../shared/utils/localization';

const NEWS_IMAGES = [
  'https://images.unsplash.com/photo-1742970936099-b68c962278c9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsYWJvcmF0b3J5JTIwZXF1aXBtZW50JTIwbW9kZXJufGVufDF8fHx8MTc2NDU0NDUxMnww&ixlib=rb-4.1.0&q=80&w=1080',
  'https://images.unsplash.com/photo-1700665537650-1bf37979aae0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx2ZXRlcmluYXJ5JTIwY29uZmVyZW5jZSUyMHByb2Zlc3Npb25hbHxlbnwxfHx8fDE3NjQ2MDgwMzV8MA&ixlib=rb-4.1.0&q=80&w=1080',
  'https://images.unsplash.com/photo-1608422050828-485141c98429?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx2YWNjaW5lJTIwbWVkaWNhbCUyMHZldGVyaW5hcnl8ZW58MXx8fHwxNzY0NjA4MDM2fDA&ixlib=rb-4.1.0&q=80&w=1080',
  'https://images.unsplash.com/photo-1745847768380-2caeadbb3b71?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxidXNpbmVzcyUyMHBhcnRuZXJzaGlwJTIwaGFuZHNoYWtlfGVufDF8fHx8MTc2NDU5Mjc5Nnww&ixlib=rb-4.1.0&q=80&w=1080',
];

export function NewsPage() {
  const { t, language } = useLanguage();
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 9;
  
  const { news, pagination, isLoading } = useNews({
    page: currentPage,
    limit: ITEMS_PER_PAGE,
  });
  const prevPageRef = useRef(currentPage);

  // Прокрутка вверх после загрузки данных при смене страницы
  useEffect(() => {
    if (prevPageRef.current !== currentPage && !isLoading && news.length > 0) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      prevPageRef.current = currentPage;
    }
  }, [currentPage, isLoading, news.length]);
  
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    // Прокрутка будет выполнена в useEffect после загрузки данных
  };
  
  if (isLoading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-center">
          <p>{t('newsPage.loading')}</p>
        </div>
      </div>
    );
  }
  
  return (
    <>
      <section className="py-20 bg-linear-to-br from-[#00AADC] to-[#0088B8] text-white">
        <div className="container mx-auto px-4 text-center">
          <h1 className="mb-6">{t('newsPage.title')}</h1>
          <p className="text-xl max-w-3xl mx-auto opacity-95">
            {t('newsPage.subtitle')}
          </p>
        </div>
      </section>

      <section className="py-4 bg-white">
        <div className="container mx-auto px-4">
          <Breadcrumbs items={[{ label: t('nav.news') }]} />
        </div>
      </section>

      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {news && news.length > 0 ? news.map((newsItem, index) => {
              const title = getLocalizedField(newsItem, 'title', language);
              const excerpt = getLocalizedField(newsItem, 'excerpt', language) || 
                             getLocalizedField(newsItem, 'description', language) ||
                             getLocalizedField(newsItem, 'shortDescription', language);
              
              return (
                <Link
                  key={newsItem.id}
                  to={`/news/${newsItem.id}`}
                  className="bg-white rounded-xl overflow-hidden border border-gray-100 hover:shadow-xl transition-all hover:-translate-y-1"
                >
                  <div className="relative h-[350px] overflow-hidden">
                    <ImageWithFallback
                      src={(newsItem as any).coverImage || (newsItem as any).image || NEWS_IMAGES[index % NEWS_IMAGES.length]}
                      alt={title}
                      className="w-full h-full object-cover object-center hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <div className="p-6">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground mb-3">
                      <Calendar className="w-4 h-4" />
                      <span>{(newsItem as any).publishedAt || newsItem.createdAt}</span>
                    </div>
                    <h3 className="mb-3">{title}</h3>
                    <p className="text-muted-foreground text-sm line-clamp-3 mb-4">{excerpt}</p>
                    <span
                      className="inline-flex items-center gap-2 hover:gap-3 transition-all"
                      style={{ color: BRAND.colors.primary }}
                    >
                      {t('newsPage.readMore')}
                      <ArrowRight className="w-4 h-4" />
                    </span>
                  </div>
                </Link>
              );
            }) : (
              <div className="col-span-full text-center py-12">
                <p className="text-muted-foreground">{t('newsPage.notFound')}</p>
              </div>
            )}
          </div>
          
          {/* Pagination */}
          {pagination && pagination.totalPages > 1 && (
            <div className="mt-12">
              <Pagination
                currentPage={currentPage}
                totalPages={pagination.totalPages}
                onPageChange={handlePageChange}
              />
              <p className="text-sm text-gray-500 mt-4 text-center">
                Показано {news.length} из {pagination.total}
              </p>
            </div>
          )}
        </div>
      </section>
    </>
  );
}
