import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { useState } from 'react';
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

export function ServicesPage() {
  const { t, language } = useLanguage();
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 9;
  
  const { services, pagination, isLoading } = useServices({
    page: currentPage,
    limit: ITEMS_PER_PAGE,
  });
  
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
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
      <section className="py-20 bg-linear-to-br from-[#00AADC] to-[#0088B8] text-white">
        <div className="container mx-auto px-4 text-center">
          <h1 className="mb-6">{t('servicesPage.title')}</h1>
          <p className="text-xl max-w-3xl mx-auto opacity-95">
            {t('servicesPage.subtitle')}
          </p>
        </div>
      </section>

      <section className="py-4 bg-gray-50">
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
                  className="bg-white rounded-2xl overflow-hidden border border-gray-100 hover:shadow-xl transition-all hover:-translate-y-1"
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
      <section className="py-20 bg-gray-50">
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
