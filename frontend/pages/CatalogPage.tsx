import { useState, useMemo } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Search } from 'lucide-react';
import { Input } from '../components/ui/input';
import { Breadcrumbs } from '../components/Breadcrumbs';
import { Pagination } from '../components/ui/pagination';
import { BRAND } from '../shared/constants/brand';
import { ImageWithFallback } from '../components/figma/ImageWithFallback';
import { useLanguage } from '../shared/contexts/LanguageContext';
import { useCatalog } from '../shared/hooks/useCatalog';
import { useBrands } from '../shared/hooks/useBrands';
import { getLocalizedField } from '../shared/utils/localization';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../components/ui/select';

// Категории остаются как mock данные, но используют переводы

export function CatalogPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const { t, language } = useLanguage();
  
  // Получаем значения из URL параметров
  const selectedCategory = searchParams.get('category') || 'all';
  const brandParam = searchParams.get('brand') || 'all';
  
  const [selectedBrand, setSelectedBrand] = useState(brandParam);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 9; // Показываем по 9 карточек

  // Категории с переводами
  const CATALOG_CATEGORIES = [
    { id: 'all', name: t('catalog.allProducts') },
    { id: 'vaccines', name: t('catalog.vaccines') },
    { id: 'medicines', name: t('catalog.medicines') },
    { id: 'disinfection', name: t('catalog.disinfection') },
    { id: 'feed-additives', name: t('catalog.feed') },
    { id: 'equipment', name: t('catalog.equipment') },
    { id: 'antibiotics', name: t('catalog.antibiotics') },
  ];

  // Загружаем бренды из API
  const { brands, isLoading: isLoadingBrands } = useBrands();

  // Загружаем товары из API с фильтрами
  const catalogFilters = useMemo(() => {
    const filters: {
      category?: 'vaccines' | 'medicines' | 'disinfection' | 'feed-additives' | 'equipment' | 'antibiotics';
      brandId?: string;
      search?: string;
      page?: number;
      limit?: number;
    } = {
      page: currentPage,
      limit: ITEMS_PER_PAGE,
    };
    if (selectedCategory !== 'all') {
      filters.category = selectedCategory as 'vaccines' | 'medicines' | 'disinfection' | 'feed-additives' | 'equipment' | 'antibiotics';
    }
    if (selectedBrand !== 'all') {
      filters.brandId = selectedBrand;
    }
    if (searchQuery.trim()) {
      filters.search = searchQuery.trim();
    }
    return filters;
  }, [selectedCategory, selectedBrand, searchQuery, currentPage]);

  const { catalog: catalogItems, pagination, isLoading: isLoadingCatalog } = useCatalog(catalogFilters);

  const handleCategoryChange = (category: string) => {
    const params = new URLSearchParams(searchParams);
    if (category === 'all') {
      params.delete('category');
    } else {
      params.set('category', category);
    }
    setSearchParams(params);
    setCurrentPage(1); // Сброс страницы при смене категории
  };

  const handleBrandChange = (brand: string) => {
    setSelectedBrand(brand);
    const params = new URLSearchParams(searchParams);
    if (brand === 'all') {
      params.delete('brand');
    } else {
      params.set('brand', brand);
    }
    setSearchParams(params);
    setCurrentPage(1); // Сброс страницы при смене бренда
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const selectedCategoryName = CATALOG_CATEGORIES.find(c => c.id === selectedCategory)?.name;
  const selectedBrandName = brands.find(b => b.id === selectedBrand)?.name;

  return (
    <>
      <section className="py-20 bg-linear-to-br from-[#00AADC] to-[#0088B8] text-white">
        <div className="container mx-auto px-4 text-center">
          <h1 className="mb-6">{t('catalog.title')}</h1>
          <p className="text-xl max-w-3xl mx-auto opacity-95">
            {t('catalog.subtitle')}
          </p>
        </div>
      </section>

      <section className="py-8 bg-[rgb(255,255,255)]">
        <div className="container mx-auto px-4">
          <Breadcrumbs
            items={[
              { label: t('nav.catalog'), href: '/catalog' },
              ...(selectedCategory !== 'all' && selectedCategoryName ? [{ label: selectedCategoryName }] : []),
            ]}
          />
        </div>
      </section>

      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Sidebar Filters */}
            <aside className="lg:w-64 shrink-0 space-y-6">
                    {/* Categories */}
                    <div>
                      <h3 className="mb-4">{t('catalog.categories')}</h3>
                <nav className="space-y-2">
                  {CATALOG_CATEGORIES.map((category) => (
                    <button
                      key={category.id}
                      onClick={() => handleCategoryChange(category.id)}
                      className={`w-full text-left px-4 py-2 rounded-lg transition-colors ${
                        selectedCategory === category.id
                          ? 'text-white'
                          : 'bg-white hover:bg-gray-50 border border-gray-100'
                      }`}
                      style={
                        selectedCategory === category.id
                          ? { backgroundColor: BRAND.colors.primary }
                          : undefined
                      }
                    >
                      {category.name}
                    </button>
                  ))}
                </nav>
              </div>

                    {/* Brands Filter */}
                    <div>
                      <h3 className="mb-4">{t('catalog.brands')}</h3>
                      <div className="bg-white rounded-lg border border-gray-100 p-4">
                        {isLoadingBrands ? (
                          <div className="text-sm text-muted-foreground">{t('catalog.loadingBrands')}</div>
                        ) : (
                          <Select value={selectedBrand} onValueChange={handleBrandChange}>
                            <SelectTrigger>
                              <SelectValue placeholder={t('catalog.allBrands')} />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="all">{t('catalog.allBrands')}</SelectItem>
                        {brands.map((brand) => (
                          <SelectItem key={brand.id} value={brand.id}>
                            {brand.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                </div>
              </div>

              {/* Active Filters */}
              {(selectedCategory !== 'all' || selectedBrand !== 'all' || searchQuery) && (
                <div className="bg-blue-50 rounded-lg p-4">
                  <h4 className="text-sm mb-3">{t('catalog.activeFilters')}</h4>
                  <div className="space-y-2">
                    {selectedCategory !== 'all' && (
                      <div className="flex items-center justify-between text-sm">
                        <span>{CATALOG_CATEGORIES.find(c => c.id === selectedCategory)?.name}</span>
                        <button
                          onClick={() => handleCategoryChange('all')}
                          className="text-primary hover:underline"
                        >
                          ✕
                        </button>
                      </div>
                    )}
                    {selectedBrand !== 'all' && selectedBrandName && (
                      <div className="flex items-center justify-between text-sm">
                        <span>{selectedBrandName}</span>
                        <button
                          onClick={() => handleBrandChange('all')}
                          className="text-primary hover:underline"
                        >
                          ✕
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </aside>

            {/* Main Content */}
            <div className="flex-1">
              {/* Search and Results Count */}
              <div className="mb-8 flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
                <div className="text-gray-600">
                  {isLoadingCatalog ? (
                    <span>{t('common.loading')}</span>
                  ) : (
                    <>
                      {t('catalog.found')} <span className="font-semibold">{pagination?.total || catalogItems.length}</span>
                    </>
                  )}
                </div>
                <div className="relative w-full sm:w-96">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <Input
                    type="text"
                    placeholder={t('catalog.searchPlaceholder')}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>

              {/* Products Grid */}
              {isLoadingCatalog ? (
                <div className="text-center py-16">
                  <p className="text-muted-foreground">{t('catalog.loading')}</p>
                </div>
              ) : (
                <>
                  <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {catalogItems.map((item) => {
                      const title = getLocalizedField(item, 'title', language);
                      const description = getLocalizedField(item, 'description', language);
                      
                      return (
                        <Link
                          key={item.id}
                          to={`/catalog/${item.id}`}
                          className="bg-white rounded-xl overflow-hidden border border-gray-100 hover:shadow-xl transition-all hover:-translate-y-1 group"
                        >
                          <div className="relative h-56 overflow-hidden bg-gray-100">
                            <ImageWithFallback
                              src={item.image || ''}
                              alt={title}
                              className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300"
                            />
                          </div>
                          <div className="p-6">
                            {item.brand && (
                              <div className="text-sm text-gray-500 mb-2">{item.brand.name}</div>
                            )}
                            <h3 className="mb-2 group-hover:text-primary transition-colors">
                              {title}
                            </h3>
                            <p className="text-muted-foreground text-sm mb-4 line-clamp-2">
                              {description}
                            </p>
                          </div>
                        </Link>
                      );
                    })}
                  </div>

                  {catalogItems.length === 0 && (
                    <div className="text-center py-16 bg-gray-50 rounded-xl">
                      <p className="text-muted-foreground text-lg mb-4">
                        {t('catalog.notFound')}
                      </p>
                      <p className="text-sm text-gray-500">
                        {t('catalog.tryFilters')}
                      </p>
                    </div>
                  )}

                  {/* Pagination */}
                  {pagination && pagination.totalPages > 1 && (
                    <div className="mt-12">
                      <Pagination
                        currentPage={currentPage}
                        totalPages={pagination.totalPages}
                        onPageChange={handlePageChange}
                      />
                      <p className="text-sm text-gray-500 mt-4 text-center">
                        Показано {catalogItems.length} из {pagination.total}
                      </p>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
