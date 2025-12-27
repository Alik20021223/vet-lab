import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
// import { SERVICES } from '../shared/data/services';
import { BRAND } from '../shared/constants/brand';
import { ImageWithFallback } from '../components/figma/ImageWithFallback';
import { Breadcrumbs } from '../components/Breadcrumbs';
import { Pagination } from '../components/ui/pagination';
import { useLanguage } from '../shared/contexts/LanguageContext';
import { useServices } from '../shared/hooks/useServices';
import { getLocalizedField } from '../shared/utils/localization';
import price1Image from '../assets/price-1.png';
import price2Image from '../assets/price-2.png';
import whyUsImage from '../assets/why-us.png';

export function ServicesPage() {
  const { t, language } = useLanguage();
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 9;
  const heroRef = useRef<HTMLElement>(null);
  
  const { services, pagination, isLoading } = useServices({
    page: currentPage,
    limit: ITEMS_PER_PAGE,
  });
  const prevPageRef = useRef(currentPage);

  // Прокрутка вверх после загрузки данных при смене страницы
  useEffect(() => {
    if (prevPageRef.current !== currentPage && !isLoading && services.length > 0) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      prevPageRef.current = currentPage;
    }
  }, [currentPage, isLoading, services.length]);
  
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    // Прокрутка будет выполнена в useEffect после загрузки данных
  };
  
  if (isLoading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-center">
          <p>{t('servicesPage.loading')}</p>
        </div>
      </div>
    );
  }
  
  return (
    <>
      <section ref={heroRef} className="relative h-[400px] md:h-[500px] lg:h-[600px] overflow-hidden">
        <div className="absolute inset-0">
          <img
            src={whyUsImage}
            alt="Services"
            className="w-full h-full object-cover"
          />
        </div>
        <div className="absolute inset-0 bg-black/30"></div>
        <div className="absolute inset-0 flex items-center justify-center pt-16 lg:pt-20">
          <div className="container mx-auto px-4 text-center text-white">
            <h1 className="text-3xl md:text-5xl lg:text-6xl xl:text-7xl mb-4 md:mb-6 max-w-4xl mx-auto font-bold tracking-tight drop-shadow-lg">
              {t('servicesPage.title')}
            </h1>
            <p className="text-xl md:text-3xl lg:text-4xl xl:text-5xl mb-8 md:mb-10 max-w-4xl mx-auto font-semibold tracking-wide drop-shadow-md">
              {t('servicesPage.subtitle')}
            </p>
          </div>
        </div>
      </section>

      <section className="py-4 bg-white">
        <div className="container mx-auto px-4">
          <Breadcrumbs items={[{ label: t('nav.services') }]} />
        </div>
      </section>

      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-8">
            {services && services.length > 0 ? services.map((service) => {
              const title = getLocalizedField(service, 'title', language);
              const description = getLocalizedField(service, 'shortDescription', language) || 
                                 getLocalizedField(service, 'description', language);
              
              return (
                <Link
                  key={service.id}
                  to={`/services/${service.id}`}
                  className="bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-lg hover:shadow-xl transition-all hover:-translate-y-1"
                >
                  <div className="relative h-64 overflow-hidden">
                    <ImageWithFallback
                      src={service.image || ''}
                      alt={title}
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-linear-to-t from-black/70 to-transparent" />
                    <h2 className="absolute bottom-6 left-6 right-6 text-white">{title}</h2>
                  </div>
                  <div className="p-8">
                    <p className="text-muted-foreground mb-6">{description}</p>
                    <span
                      className="inline-flex items-center gap-2 hover:gap-3 transition-all"
                      style={{ color: BRAND.colors.primary }}
                    >
                      {t('servicesPage.learnMore')}
                      <ArrowRight className="w-5 h-5" />
                    </span>
                  </div>
                </Link>
              );
            }) : (
              <div className="col-span-full text-center py-12">
                <p className="text-muted-foreground">{t('servicesPage.notFound')}</p>
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
                Показано {services.length} из {pagination.total}
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="mb-4">{t('servicesPage.pricingTitle')}</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              {t('servicesPage.pricingSubtitle')}
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto">
            <div className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow">
              <img
                src={price1Image}
                alt="Price List 1"
                className="w-full h-auto object-contain"
              />
            </div>
            <div className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow">
              <img
                src={price2Image}
                alt="Price List 2"
                className="w-full h-auto object-contain"
              />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
