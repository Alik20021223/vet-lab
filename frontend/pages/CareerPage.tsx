import { Briefcase, MapPin, Clock } from 'lucide-react';
import { Button } from '../components/ui/button';
import { BRAND } from '../shared/constants/brand';
import { Link } from 'react-router-dom';
import { Breadcrumbs } from '../components/Breadcrumbs';
import { Pagination } from '../components/ui/pagination';
import { useLanguage } from '../shared/contexts/LanguageContext';
import { useCareers } from '../shared/hooks/useCareers';
import { getLocalizedField } from '../shared/utils/localization';
import { useState } from 'react';
import carrierImage from '../assets/carrier.png';


export function CareerPage() {
  const { t, language } = useLanguage();
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 9;
  
  const { careers, pagination, isLoading } = useCareers({
    page: currentPage,
    limit: ITEMS_PER_PAGE,
  });
  
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  
  const getTypeLabel = (type: string) => {
    const typeMap: Record<string, string> = {
      'full-time': t('career.typeFullTime'),
      'part-time': t('career.typePartTime'),
      'contract': t('career.typeContract'),
      'internship': t('career.typeInternship'),
    };
    return typeMap[type] || type;
  };

  if (isLoading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-center">
          <p>{t('career.loading')}</p>
        </div>
      </div>
    );
  }
  
  return (
    <>
      <section className="py-20 bg-linear-to-br from-[#00AADC] to-[#0088B8] text-white">
        <div className="container mx-auto px-4 text-center">
          <h1 className="mb-6">{t('career.title')}</h1>
          <p className="text-xl max-w-3xl mx-auto opacity-95">
            {t('career.subtitle')}
          </p>
        </div>
      </section>

      <section className="py-4 bg-gray-50">
        <div className="container mx-auto px-4">
          <Breadcrumbs items={[{ label: t('nav.career') }]} />
        </div>
      </section>

      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center mb-20">
            <div>
              <h2 className="mb-6">{t('career.whyUsTitle')}</h2>
              <ul className="space-y-4">
                {[
                  t('career.benefit1'),
                  t('career.benefit2'),
                  t('career.benefit3'),
                  t('career.benefit4'),
                  t('career.benefit5'),
                  t('career.benefit6'),
                ].map((item, index) => (
                  <li key={index} className="flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full" style={{ backgroundColor: BRAND.colors.accent }} />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="relative">
              <img
                src={carrierImage}
                alt="VET-LAB Office"
                className="rounded-2xl w-full h-[400px] object-cover shadow-xl"
              />
            </div>
          </div>

          <div>
            <h2 className="mb-8">{t('career.openingsTitle')}</h2>
            {careers && careers.length > 0 ? (
              <div className="space-y-4">
                {careers.map((job) => {
                  const title = getLocalizedField(job, 'title', language);
                  const description = getLocalizedField(job, 'description', language);
                  const location = getLocalizedField(job, 'location', language);
                  
                  return (
                    <div
                      key={job.id}
                      className="bg-white rounded-xl p-6 border border-gray-100 hover:shadow-lg transition-shadow"
                    >
                      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                        <div className="flex-1">
                          <h3 className="mb-2">{title}</h3>
                          <p className="text-muted-foreground mb-3">{description}</p>
                          <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                            <div className="flex items-center gap-2">
                              <MapPin className="w-4 h-4" />
                              <span>{location}</span>
                            </div>
                          <div className="flex items-center gap-2">
                            <Clock className="w-4 h-4" />
                            <span>{getTypeLabel(job.type)}</span>
                          </div>
                          {job.salary && (
                            <div className="flex items-center gap-2">
                              <span>
                                {job.salary.min && job.salary.max
                                  ? `${job.salary.min.toLocaleString()} ${t('career.salaryRange')} ${job.salary.max.toLocaleString()} ${job.salary.currency}`
                                  : job.salary.min
                                  ? `${t('career.salaryFrom')} ${job.salary.min.toLocaleString()} ${job.salary.currency}`
                                  : job.salary.max
                                  ? `${t('career.salaryTo')} ${job.salary.max.toLocaleString()} ${job.salary.currency}`
                                  : ''}
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                      <Button
                        style={{ backgroundColor: BRAND.colors.accent }}
                        className="text-white hover:opacity-90 shrink-0"
                        asChild
                      >
                        <Link to="/contacts">
                          <Briefcase className="w-4 h-4 mr-2" />
                          {t('career.apply')}
                        </Link>
                      </Button>
                    </div>
                  </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-muted-foreground">{t('career.noOpenings')}</p>
              </div>
            )}
            
            {/* Pagination */}
            {pagination && pagination.totalPages > 1 && careers.length > 0 && (
              <div className="mt-12">
                <Pagination
                  currentPage={currentPage}
                  totalPages={pagination.totalPages}
                  onPageChange={handlePageChange}
                />
                <p className="text-sm text-gray-500 mt-4 text-center">
                  Показано {careers.length} из {pagination.total}
                </p>
              </div>
            )}
          </div>
        </div>
      </section>
    </>
  );
}
