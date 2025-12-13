import { ImageWithFallback } from '../components/figma/ImageWithFallback';
import { Breadcrumbs } from '../components/Breadcrumbs';
import { Pagination } from '../components/ui/pagination';
import { useLanguage } from '../shared/contexts/LanguageContext';
import { useGallery } from '../shared/hooks/useGallery';
import { useState } from 'react';

export function GalleryPage() {
  const { t } = useLanguage();
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 9;
  
  const { gallery, pagination, isLoading } = useGallery({
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
          <p>{t('galleryPage.loading')}</p>
        </div>
      </div>
    );
  }
  
  return (
    <>
      <section className="py-20 bg-gradient-to-br from-[#00AADC] to-[#0088B8] text-white">
        <div className="container mx-auto px-4 text-center">
          <h1 className="mb-6">{t('galleryPage.title')}</h1>
          <p className="text-xl max-w-3xl mx-auto opacity-95">
            {t('galleryPage.subtitle')}
          </p>
        </div>
      </section>

      <section className="py-4 bg-gray-50">
        <div className="container mx-auto px-4">
          <Breadcrumbs items={[{ label: t('nav.gallery') }]} />
        </div>
      </section>

      <section className="py-20">
        <div className="container mx-auto px-4">
          {gallery && gallery.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {gallery.map((item) => (
                <div
                  key={item.id}
                  className="group relative aspect-square overflow-hidden rounded-xl bg-gray-100 hover:shadow-xl transition-all"
                >
                  <ImageWithFallback
                    src={item.image}
                    alt={item.description || item.category || 'Gallery image'}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  {(item.description || item.category) && (
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                      <div className="absolute bottom-0 left-0 right-0 p-6">
                        {item.category && (
                          <div className="text-sm text-white/80 mb-1">{item.category}</div>
                        )}
                        {item.description && (
                          <h3 className="text-white">{item.description}</h3>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-muted-foreground">{t('galleryPage.notFound')}</p>
            </div>
          )}
          
          {/* Pagination */}
          {pagination && pagination.totalPages > 1 && gallery.length > 0 && (
            <div className="mt-12">
              <Pagination
                currentPage={currentPage}
                totalPages={pagination.totalPages}
                onPageChange={handlePageChange}
              />
              <p className="text-sm text-gray-500 mt-4 text-center">
                Показано {gallery.length} из {pagination.total}
              </p>
            </div>
          )}
        </div>
      </section>
    </>
  );
}
