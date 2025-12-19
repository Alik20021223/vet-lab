import { useState, useMemo } from 'react';
import { AdminLayout } from '../../components/admin/AdminLayout';
import { DataTable } from '../../components/admin/DataTable';
import { Badge } from '../../components/ui/badge';
import { Button } from '../../components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '../../components/ui/dialog';
import { Input } from '../../components/ui/input';
import { Textarea } from '../../components/ui/textarea';
import { Label } from '../../components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../../components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs';
import { ImageUpload } from '../../components/admin/ImageUpload';
import { RichTextEditor } from '../../components/admin/RichTextEditor';
import { CatalogItem, CATALOG_CATEGORIES } from '../../shared/types/admin';
import { ImageWithFallback } from '../../components/figma/ImageWithFallback';
import { useAdminCatalog, useCatalogMutations } from '../../shared/hooks/admin/useAdminCatalog';
import { useBrands } from '../../shared/hooks/useBrands';
import { toast } from 'sonner';
import { resolveImageUrl } from '@/shared/utils/imageUrl';

const TRANSLATION_TABS = [
  { value: 'ru', label: 'Русский 🇷🇺' },
  { value: 'en', label: 'English 🇬🇧' },
] as const;

export function CatalogPage() {
  const [activeCategory, setActiveCategory] = useState<keyof typeof CATALOG_CATEGORIES>('vaccines');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<CatalogItem | null>(null);
  const [translationTab, setTranslationTab] = useState<'ru' | 'en'>('ru');
  const [formData, setFormData] = useState<{
    title: string;
    titleEn: string;
    description: string;
    descriptionEn: string;
    fullDescription: string;
    fullDescriptionEn: string;
    applicationMethod: string;
    applicationMethodEn: string;
    brandId: string;
    image: string;
    status: 'active' | 'draft' | 'archived';
    category: keyof typeof CATALOG_CATEGORIES;
  }>({
    title: '',
    titleEn: '',
    description: '',
    descriptionEn: '',
    fullDescription: '',
    fullDescriptionEn: '',
    applicationMethod: '',
    applicationMethodEn: '',
    brandId: '',
    image: '',
    status: 'active',
    category: 'vaccines',
  });

  // Загружаем данные из API
  const { catalog, refetch } = useAdminCatalog();
  const { createCatalogItem, updateCatalogItem, deleteCatalogItem, isCreating, isUpdating } = useCatalogMutations();
  const { brands, isLoading: isLoadingBrands } = useBrands();

  // Фильтруем товары по выбранной категории
  const filteredData = useMemo(() => {
    return catalog.filter((item) => item.category === activeCategory);
  }, [catalog, activeCategory]);

  const handleCreate = () => {
    setEditingItem(null);
    setFormData({
      title: '',
      titleEn: '',
      description: '',
      descriptionEn: '',
      fullDescription: '',
      fullDescriptionEn: '',
      applicationMethod: '',
      applicationMethodEn: '',
      brandId: '',
      image: '',
      status: 'active',
      category: activeCategory,
    });
    setIsModalOpen(true);
  };

  const handleEdit = (item: CatalogItem) => {
    setEditingItem(item);
    setFormData({
      title: item.title,
      titleEn: item.titleEn || '',
      description: item.description,
      descriptionEn: item.descriptionEn || '',
      fullDescription: item.fullDescription || '',
      fullDescriptionEn: item.fullDescriptionEn || '',
      applicationMethod: item.applicationMethod || '',
      applicationMethodEn: item.applicationMethodEn || '',
      brandId: item.brandId || '',
      image: item.image || '',
      status: item.status,
      category: item.category as keyof typeof CATALOG_CATEGORIES,
    });
    setActiveCategory(item.category as keyof typeof CATALOG_CATEGORIES);
    setIsModalOpen(true);
  };

  const handleSave = async () => {
    try {
      // Создаем payload со всеми полями, включая пустые строки для очистки полей в БД
      const payload: {
        title: string;
        titleEn?: string;
        description: string;
        descriptionEn?: string;
        category: 'vaccines' | 'medicines' | 'disinfection' | 'feed-additives' | 'equipment' | 'antibiotics';
        status: 'active' | 'draft' | 'archived';
        fullDescription?: string;
        fullDescriptionEn?: string;
        applicationMethod?: string;
        applicationMethodEn?: string;
        brandId?: string;
        image?: string;
      } = {
        title: formData.title,
        description: formData.description,
        category: formData.category as 'vaccines' | 'medicines' | 'disinfection' | 'feed-additives' | 'equipment' | 'antibiotics',
        status: formData.status,
      };

      // Передаем все поля, даже если они пустые (для очистки в БД)
      payload.titleEn = formData.titleEn || undefined;
      payload.descriptionEn = formData.descriptionEn || undefined;
      payload.fullDescription = formData.fullDescription || undefined;
      payload.fullDescriptionEn = formData.fullDescriptionEn || undefined;
      payload.applicationMethod = formData.applicationMethod || undefined;
      payload.applicationMethodEn = formData.applicationMethodEn || undefined;
      payload.brandId = formData.brandId || undefined;
      payload.image = formData.image || undefined;
      
      // Логирование для отладки
      console.log('📤 Sending update payload:', payload);

      if (editingItem) {
        await updateCatalogItem({
          id: editingItem.id,
          ...payload,
        }).unwrap();
        toast.success('Товар успешно обновлен');
        // Принудительно обновляем данные после обновления
        await refetch();
      } else {
        await createCatalogItem(payload).unwrap();
        toast.success('Товар успешно создан');
        // Принудительно обновляем данные после создания
        await refetch();
      }
      setActiveCategory(payload.category as keyof typeof CATALOG_CATEGORIES);
      setIsModalOpen(false);
    } catch (error: unknown) {
      const errorMessage = error && typeof error === 'object' && 'data' in error && error.data && typeof error.data === 'object' && 'message' in error.data
        ? String(error.data.message)
        : 'Произошла ошибка';
      toast.error(errorMessage);
    }
  };

  const columns = [
    {
      key: 'image',
      label: 'Фото',
      render: (item: CatalogItem) =>
        item.image ? (
          <ImageWithFallback
            src={resolveImageUrl(item.image)}
            alt={item.title}
            className="w-12 h-12 rounded-lg object-cover"
          />
        ) : (
          <div className="w-12 h-12 rounded-lg bg-gray-100" />
        ),
    },
    { key: 'title', label: 'Название', sortable: true },
    {
      key: 'brand',
      label: 'Бренд',
      render: (item: CatalogItem) => (
        <span className="text-sm text-gray-600">{item.brand?.name || '—'}</span>
      ),
    },
    {
      key: 'description',
      label: 'Описание',
      render: (item: CatalogItem) => (
        <span className="line-clamp-2 max-w-md">{item.description}</span>
      ),
    },
    {
      key: 'status',
      label: 'Статус',
      render: (item: CatalogItem) => (
        <Badge variant={item.status === 'active' ? 'default' : 'secondary'}>
          {item.status === 'active' ? 'Активен' : 'Черновик'}
        </Badge>
      ),
    },
    { key: 'updatedAt', label: 'Обновлён', sortable: true },
  ];

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="mb-2">Каталог товаров</h1>
          <p className="text-muted-foreground">
            Управление товарами по категориям
          </p>
        </div>

        <Tabs value={activeCategory} onValueChange={(v) => setActiveCategory(v as typeof activeCategory)}>
          <div className="w-full overflow-x-auto">
            <TabsList className="inline-flex w-auto min-w-full">
              {Object.entries(CATALOG_CATEGORIES).map(([key, label]) => (
                <TabsTrigger key={key} value={key} className="flex-shrink-0">
                  {label}
                </TabsTrigger>
              ))}
            </TabsList>
          </div>

          {Object.keys(CATALOG_CATEGORIES).map((category) => (
            <TabsContent key={category} value={category} className="mt-6">
              <DataTable
                data={filteredData}
                columns={columns}
                onCreate={handleCreate}
                onEdit={handleEdit}
                onDelete={async (item) => {
                  if (confirm('Удалить товар?')) {
                    try {
                      await deleteCatalogItem(item.id).unwrap();
                      toast.success('Товар успешно удален');
                    } catch (error: unknown) {
                      const errorMessage = error && typeof error === 'object' && 'data' in error && error.data && typeof error.data === 'object' && 'message' in error.data
                        ? String(error.data.message)
                        : 'Произошла ошибка';
                      toast.error(errorMessage);
                    }
                  }
                }}
                searchPlaceholder="Поиск товаров..."
              />
            </TabsContent>
          ))}
        </Tabs>

        {/* Create/Edit Modal */}
        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingItem ? 'Редактировать товар' : 'Добавить товар'}
              </DialogTitle>
              <DialogDescription>
                Заполните информацию о товаре. Поля, отмеченные *, обязательны для заполнения.
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4">
              {/* Language Tabs */}
              <Tabs value={translationTab} onValueChange={(v) => setTranslationTab(v as 'ru' | 'en')}>
                <TabsList className="grid grid-cols-2 w-full max-w-md">
                  {TRANSLATION_TABS.map((tab) => (
                    <TabsTrigger key={tab.value} value={tab.value}>
                      {tab.label}
                    </TabsTrigger>
                  ))}
                </TabsList>

                {/* Russian Content */}
                <TabsContent value="ru" className="space-y-4 mt-4">
                  <div>
                    <Label>Название *</Label>
                    <Input
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      placeholder="Название товара"
                      className="mt-2.5"
                    />
                  </div>

                  <div>
                    <Label>Краткое описание *</Label>
                    <Textarea
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      placeholder="Краткое описание для карточки товара"
                      rows={3}
                      className="mt-2.5"
                    />
                  </div>

                  <div>
                    <Label>Полное описание</Label>
                    <div className="mt-2.5">
                      <RichTextEditor
                        value={formData.fullDescription}
                        onChange={(value) => setFormData({ ...formData, fullDescription: value })}
                        placeholder="Подробное описание продукта с форматированием"
                      />
                    </div>
                  </div>

                  <div>
                    <Label>Способ применения</Label>
                    <div className="mt-2.5">
                      <RichTextEditor
                        value={formData.applicationMethod}
                        onChange={(value) => setFormData({ ...formData, applicationMethod: value })}
                        placeholder="Инструкция по применению продукта"
                      />
                    </div>
                  </div>
                </TabsContent>

                {/* English Content */}
                <TabsContent value="en" className="space-y-4 mt-4">
                  <div>
                    <Label>Title (English)</Label>
                    <Input
                      value={formData.titleEn}
                      onChange={(e) => setFormData({ ...formData, titleEn: e.target.value })}
                      placeholder="Product title in English"
                      className="mt-2.5"
                    />
                  </div>

                  <div>
                    <Label>Short Description (English)</Label>
                    <Textarea
                      value={formData.descriptionEn}
                      onChange={(e) => setFormData({ ...formData, descriptionEn: e.target.value })}
                      placeholder="Short description for product card"
                      rows={3}
                      className="mt-2.5"
                    />
                  </div>

                  <div>
                    <Label>Full Description (English)</Label>
                    <div className="mt-2.5">
                      <RichTextEditor
                        value={formData.fullDescriptionEn}
                        onChange={(value) => setFormData({ ...formData, fullDescriptionEn: value })}
                        placeholder="Detailed product description with formatting"
                      />
                    </div>
                  </div>

                  <div>
                    <Label>Application Method (English)</Label>
                    <div className="mt-2.5">
                      <RichTextEditor
                        value={formData.applicationMethodEn}
                        onChange={(value) => setFormData({ ...formData, applicationMethodEn: value })}
                        placeholder="Product application instructions"
                      />
                    </div>
                  </div>
                </TabsContent>
              </Tabs>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Категория</Label>
                  <Select
                    value={formData.category}
                    onValueChange={(v) => {
                      setFormData({ ...formData, category: v as keyof typeof CATALOG_CATEGORIES });
                      setActiveCategory(v as keyof typeof CATALOG_CATEGORIES);
                    }}
                  >
                    <SelectTrigger className="mt-2.5">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.entries(CATALOG_CATEGORIES).map(([key, label]) => (
                        <SelectItem key={key} value={key}>
                          {label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label>Бренд</Label>
                  {isLoadingBrands ? (
                    <div className="mt-2.5 text-sm text-muted-foreground">Загрузка брендов...</div>
                  ) : (
                    <Select
                      value={formData.brandId || 'none'}
                      onValueChange={(v) => setFormData({ ...formData, brandId: v === 'none' ? '' : v })}
                    >
                      <SelectTrigger className="mt-2.5">
                        <SelectValue placeholder="Выберите бренд" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="none">Без бренда</SelectItem>
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

              <div>
                <Label>Статус</Label>
                <Select
                  value={formData.status}
                  onValueChange={(v) => setFormData({ ...formData, status: v as 'active' | 'draft' | 'archived' })}
                >
                  <SelectTrigger className="mt-2.5">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Активен</SelectItem>
                    <SelectItem value="draft">Черновик</SelectItem>
                    <SelectItem value="archived">Архив</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <ImageUpload
                value={formData.image}
                onChange={(url) => setFormData({ ...formData, image: url })}
                label="Фото товара"
              />

              <div className="flex justify-end gap-2 pt-4">
                <Button variant="outline" onClick={() => setIsModalOpen(false)}>
                  Отмена
                </Button>
                <Button
                  onClick={handleSave}
                  disabled={isCreating || isUpdating}
                >
                  {editingItem ? (isUpdating ? 'Сохранение...' : 'Сохранить') : (isCreating ? 'Создание...' : 'Создать')}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </AdminLayout>
  );
}
