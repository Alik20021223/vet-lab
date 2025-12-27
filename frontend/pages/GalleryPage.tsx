import { ImageWithFallback } from '../components/figma/ImageWithFallback';
import { Breadcrumbs } from '../components/Breadcrumbs';
import { useLanguage } from '../shared/contexts/LanguageContext';
import { useGallery } from '../shared/hooks/useGallery';
import { getLocalizedField } from '../shared/utils/localization';

// Swiper
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

export function GalleryPage() {
  const { t, language } = useLanguage();
  const { sections, isLoading } = useGallery();
  
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
        <div className="container mx-auto px-4 space-y-16">
          {sections && sections.length > 0 ? (
            sections.map((section) => {
              const sectionTitle = getLocalizedField(section, 'title', language);
              return (
                <div key={section.id} className="space-y-6">
                  <h2 className="text-3xl font-bold text-center">{sectionTitle}</h2>
                  {section.items && section.items.length > 0 ? (
                    <Swiper
                      modules={[Navigation, Pagination, Autoplay]}
                      spaceBetween={20}
                      slidesPerView={1}
                      breakpoints={{
                        640: {
                          slidesPerView: 2,
                        },
                        1024: {
                          slidesPerView: 3,
                        },
                        1280: {
                          slidesPerView: 4,
                        },
                      }}
                      navigation
                      pagination={{ clickable: true }}
                      autoplay={{
                        delay: 3000,
                        disableOnInteraction: false,
                      }}
                      className="gallery-swiper"
                    >
                      {section.items.map((item) => (
                        <SwiperSlide key={item.id}>
                          <div className="group relative aspect-square overflow-hidden rounded-xl bg-gray-100 hover:shadow-xl transition-all">
                            <ImageWithFallback
                              src={item.image}
                              alt={item.description || item.category || 'Gallery image'}
                              className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-300"
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
                        </SwiperSlide>
                      ))}
                    </Swiper>
                  ) : (
                    <div className="text-center py-8">
                      <p className="text-muted-foreground">{t('galleryPage.noImages')}</p>
                    </div>
                  )}
                </div>
              );
            })
          ) : (
            <div className="text-center py-12">
              <p className="text-muted-foreground">{t('galleryPage.notFound')}</p>
            </div>
          )}
        </div>
      </section>
    </>
  );
}
