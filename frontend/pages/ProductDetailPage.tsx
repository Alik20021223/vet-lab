import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Breadcrumbs } from '../components/Breadcrumbs';
import { ImageWithFallback } from '../components/figma/ImageWithFallback';
import { RichTextContent } from '../components/shared/RichTextContent';
import { Button } from '../components/ui/button';
import { ArrowLeft, ChevronLeft, ChevronRight } from 'lucide-react';
import { useLanguage } from '../shared/contexts/LanguageContext';
import { CATALOG_CATEGORIES } from '../shared/types/admin';
import { BRAND } from '../shared/constants/brand';
import { useCatalogItem, useCatalog } from '../shared/hooks/useCatalog';
import { getLocalizedField } from '../shared/utils/localization';

// Swiper
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

// Мок-данные удалены - данные теперь берутся из API

export function ProductDetailPage() {
  const { productId } = useParams<{ productId: string }>();
  const { t, language } = useLanguage();
  const navigate = useNavigate();
  const [showPagination, setShowPagination] = useState(false);
  const { item: product, isLoading, error } = useCatalogItem(productId);

  // Загружаем все продукты каталога для навигации
  const { catalog: allCatalogProducts } = useCatalog({ limit: 1000 });

  // Загружаем похожие продукты (та же категория и бренд)
  // Приводим product к правильному типу для использования в фильтрах
  const productForFilters = product && 'category' in product ? product as import('../shared/types/admin').CatalogItem : null;
  const { catalog: allSimilarProducts } = useCatalog(
    productForFilters
      ? {
          category: productForFilters.category,
          brandId: productForFilters.brandId,
          limit: 10,
        }
      : undefined
  );

  // Исключаем текущий продукт из списка похожих
  const similarProducts = (allSimilarProducts || []).filter(
    (item) => {
      // Строгое сравнение - исключаем текущий продукт
      if (!productId || !item.id) return true;
      return String(item.id) !== String(productId);
    }
  );

  // Находим следующий и предыдущий продукты в той же категории
  // Фильтруем продукты по категории текущего продукта
  const categoryProducts = productForFilters
    ? (allCatalogProducts || []).filter(
        (item) => item.category === productForFilters.category
      )
    : [];
  
  // Находим индекс текущего продукта в отфильтрованном списке
  const currentIndex = categoryProducts.findIndex(
    (item) => String(item.id) === String(productId)
  );
  
  // Находим следующий и предыдущий продукты в той же категории
  const nextProduct = 
    currentIndex >= 0 && currentIndex < categoryProducts.length - 1
      ? categoryProducts[currentIndex + 1]
      : null;
  const prevProduct = 
    currentIndex > 0
      ? categoryProducts[currentIndex - 1]
      : null;

  // Все хуки должны быть вызваны до условных возвратов
  useEffect(() => {
    const updateSlidesPerView = () => {
      const width = window.innerWidth;
      let slidesPerView = 1;
      if (width >= 1024) slidesPerView = 3;
      else if (width >= 640) slidesPerView = 2;
      
      // Показываем пагинацию и навигацию только если продуктов больше, чем видно на экране
      setShowPagination(similarProducts.length > slidesPerView);
    };

    updateSlidesPerView();
    window.addEventListener('resize', updateSlidesPerView);
    return () => window.removeEventListener('resize', updateSlidesPerView);
  }, [similarProducts.length]);

  if (isLoading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-center">
          <p>{t('productDetail.loading')}</p>
        </div>
      </div>
    );
  }


  if (!product) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="text-center">
          <h1 className="text-2xl mb-4">{t('productDetail.notFound')}</h1>
          {error && (
            <p className="text-sm text-muted-foreground mb-4">
              {t('common.error')}: {'data' in error && error.data && typeof error.data === 'object' && 'message' in error.data 
                ? String(error.data.message) 
                : t('common.unknownError')}
            </p>
          )}
          <Button asChild>
            <Link to="/catalog">
              <ArrowLeft className="w-4 h-4 mr-2" />
              {t('productDetail.backToCatalog')}
            </Link>
          </Button>
        </div>
      </div>
    );
  }

  // API возвращает данные напрямую, не в обертке { data: ... }
  const productData = product as import('../shared/types/admin').CatalogItem;
  const categoryName = CATALOG_CATEGORIES[productData.category as keyof typeof CATALOG_CATEGORIES] || productData.category;
  
  // Локализованные данные
  const title = getLocalizedField(productData, 'title', language);
  const description = getLocalizedField(productData, 'description', language);
  const fullDescription = getLocalizedField(productData, 'fullDescription', language);
  const applicationMethod = getLocalizedField(productData, 'applicationMethod', language);

  return (
    <div className="min-h-screen bg-white">
      <div className="container mx-auto px-4 py-8">
        {/* Breadcrumbs */}
        <Breadcrumbs
          items={[
            { label: t('nav.catalog'), href: '/catalog' },
            { label: categoryName, href: `/catalog?category=${productData.category}` },
            { label: title },
          ]}
          className="mb-8"
        />

        {/* Navigation Buttons */}
        {(nextProduct || prevProduct) && (
          <div className="flex justify-between items-center mb-8 gap-4">
            <Button
              variant="outline"
              size="lg"
              disabled={!prevProduct}
              onClick={() => prevProduct && navigate(`/catalog/${prevProduct.id}`)}
              className="flex items-center gap-2 min-w-[140px] justify-center"
            >
              <ChevronLeft className="w-5 h-5" />
              {t('common.previous' as any)}
            </Button>
            <Button
              variant="outline"
              size="lg"
              disabled={!nextProduct}
              onClick={() => nextProduct && navigate(`/catalog/${nextProduct.id}`)}
              className="flex items-center gap-2 min-w-[140px] justify-center ml-auto"
            >
              {t('common.next' as any)}
              <ChevronRight className="w-5 h-5" />
            </Button>
          </div>
        )}

        {/* Product Info */}
        <div className="grid lg:grid-cols-2 gap-12 mb-16">
          {/* Image */}
          <div className="rounded-2xl overflow-hidden bg-white">
            {productData.image && (
              <ImageWithFallback
                src={productData.image}
                alt={title}
                className="w-full h-[500px] object-contain"
              />
            )}
          </div>

          {/* Details */}
          <div className="space-y-6">
            {productData.brand && (
              <div className="flex items-center gap-3 pb-4 border-b border-gray-200">
                {productData.brand.logo && (
                  <ImageWithFallback
                    src={productData.brand.logo}
                    alt={productData.brand.name}
                    className="h-12 w-auto object-contain"
                  />
                )}
                <span className="text-gray-600">{productData.brand.name}</span>
              </div>
            )}

            <div>
              <h1 className="mb-4">{title}</h1>
              <p className="text-gray-600 text-lg">{description}</p>
            </div>

            <div className="bg-white rounded-xl p-6 border border-gray-100">
              <div className="text-sm text-gray-600 mb-2">{t('productDetail.category')}</div>
              <div className="text-lg">{categoryName}</div>
            </div>

            <Button
              variant="outline"
              size="lg"
              style={{ backgroundColor: BRAND.colors.primary }}
              className="w-full text-white hover:text-white hover:opacity-90"
              asChild
            >
              <Link to="/contacts">{t('productDetail.contactUs')}</Link>
            </Button>
          </div>
        </div>

        {/* Full Description */}
        {fullDescription && fullDescription.trim().replace(/<[^>]*>/g, '').trim().length > 0 && (
          <div className="mb-16">
            <div className="max-w-5xl">
              <h2 className="mb-6 text-2xl font-semibold text-gray-900">{t('catalog.description')}</h2>
              <div className="rounded-3xl bg-gradient-to-br from-gray-50 via-white to-gray-50 border border-gray-100 shadow-sm p-6 md:p-10">
                <RichTextContent
                  content={fullDescription}
                  className="text-black prose prose-base md:prose-lg lg:prose-xl max-w-none"
                />
              </div>
            </div>
          </div>
        )}

        {/* Application Method */}
        {applicationMethod && applicationMethod.trim().replace(/<[^>]*>/g, '').trim().length > 0 && (
          <div className="mb-16">
            <div className="max-w-5xl">
              <h2 className="mb-6 text-2xl font-semibold text-gray-900">{t('catalog.application')}</h2>
              <div className="rounded-3xl bg-blue-50/70 border border-blue-100 shadow-sm p-6 md:p-10">
                <RichTextContent
                  content={applicationMethod}
                  className="text-black prose prose-base md:prose-lg lg:prose-xl max-w-none"
                />
              </div>
            </div>
          </div>
        )}

        {/* Similar Products */}
        {similarProducts.length > 0 && (
          <div>
            <h2 className="mb-8 text-2xl font-semibold text-gray-900">{t('catalog.similarProducts')}</h2>
            <Swiper
              modules={[Navigation, Pagination, Autoplay]}
              spaceBetween={24}
              slidesPerView={1}
              loop={false}
              navigation={showPagination}
              pagination={showPagination ? { 
                clickable: true,
                type: 'bullets'
              } : false}
              autoplay={showPagination ? { delay: 5000, disableOnInteraction: false } : false}
              watchOverflow={true}
              breakpoints={{
                640: { slidesPerView: 2 },
                1024: { slidesPerView: 3 },
              }}
              className="pb-12! [&_.swiper-wrapper]:!flex [&_.swiper-slide]:!h-auto [&_.swiper-slide]:!flex news-swiper"
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
              {similarProducts.map((item) => {
                const itemTitle = getLocalizedField(item, 'title', language);
                const itemDescription = getLocalizedField(item, 'description', language);
                return (
                  <SwiperSlide key={item.id} className="!h-auto">
                    <Link
                      to={`/catalog/${item.id}`}
                      className="block h-full bg-white rounded-2xl overflow-hidden border border-gray-200 transition-all group hover:shadow-lg flex flex-col"
                    >
                      <div className="aspect-4/3 overflow-hidden bg-white flex-shrink-0">
                        {item.image && (
                          <ImageWithFallback
                            src={item.image}
                            alt={itemTitle}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                          />
                        )}
                      </div>
                      <div className="p-6 flex flex-col flex-1">
                        {item.brand && (
                          <div className="text-sm text-gray-500 mb-2">
                            {item.brand.name}
                          </div>
                        )}
                        <h3 className="text-xl mb-2 group-hover:text-primary transition-colors line-clamp-2 min-h-[3.5rem]">
                          {itemTitle}
                        </h3>
                        <p className="text-gray-600 line-clamp-2 mt-auto">
                          {itemDescription}
                        </p>
                      </div>
                    </Link>
                  </SwiperSlide>
                );
              })}
            </Swiper>
          </div>
        )}
      </div>
    </div>
  );
}
