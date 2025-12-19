import { useState } from 'react';
import { AdminLayout } from '../../components/admin/AdminLayout';
import { DataTable } from '../../components/admin/DataTable';
import { Badge } from '../../components/ui/badge';
import { Button } from '../../components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '../../components/ui/dialog';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs';
import { ImageUpload } from '../../components/admin/ImageUpload';
import { HeroSlide } from '../../shared/types/admin';
import { ImageWithFallback } from '../../components/figma/ImageWithFallback';
import { Plus, Trash2, Edit2 } from 'lucide-react';
import { useAdminHeroSlides, useHeroSlidesMutations } from '../../shared/hooks/admin/useAdminHeroSlides';
import { toast } from 'sonner';
import { resolveImageUrl } from '../../shared/utils/imageUrl';

const TRANSLATION_TABS = [
  { value: 'ru', label: 'Русский 🇷🇺' },
  { value: 'en', label: 'English 🇬🇧' },
] as const;

export function HeroSlidesAdminPage() {
  const { heroSlides, isLoading } = useAdminHeroSlides();
  const { createHeroSlide, updateHeroSlide, deleteHeroSlide, isCreating, isUpdating, isDeleting } = useHeroSlidesMutations();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<HeroSlide | null>(null);
  const [translationTab, setTranslationTab] = useState<'ru' | 'en'>('ru');
  const [formData, setFormData] = useState({
    image: '',
    title: '',
    titleEn: '',
    sortOrder: 0,
    isActive: true,
  });

  const handleCreate = () => {
    setEditingItem(null);
    setFormData({
      image: '',
      title: '',
      titleEn: '',
      sortOrder: heroSlides.length,
      isActive: true,
    });
    setIsModalOpen(true);
  };

  const handleEdit = (item: HeroSlide) => {
    setEditingItem(item);
    setFormData({
      image: item.image,
      title: item.title,
      titleEn: item.titleEn || '',
      sortOrder: item.sortOrder,
      isActive: item.isActive,
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (item: HeroSlide) => {
    if (confirm(`Удалить слайд "${item.title}"?`)) {
      try {
        await deleteHeroSlide(item.id).unwrap();
        toast.success('Слайд успешно удален');
      } catch (error: any) {
        toast.error(error?.data?.message || 'Произошла ошибка');
      }
    }
  };

  const handleSubmit = async () => {
    try {
      if (editingItem) {
        await updateHeroSlide({
          id: editingItem.id,
          ...formData,
        }).unwrap();
        toast.success('Слайд успешно обновлен');
      } else {
        await createHeroSlide(formData).unwrap();
        toast.success('Слайд успешно создан');
      }
      setIsModalOpen(false);
    } catch (error: any) {
      toast.error(error?.data?.message || 'Произошла ошибка');
    }
  };

  const columns = [
    {
      key: 'image',
      label: 'Изображение',
      render: (item: HeroSlide) =>
        item.image ? (
          <ImageWithFallback
            src={resolveImageUrl(item.image)}
            alt={item.title}
            className="w-20 h-12 rounded-lg object-cover"
          />
        ) : (
          <div className="w-20 h-12 rounded-lg bg-gray-100" />
        ),
    },
    { key: 'title', label: 'Заголовок', sortable: true },
    {
      key: 'sortOrder',
      label: 'Порядок',
      render: (item: HeroSlide) => (
        <span className="text-sm text-gray-600">{item.sortOrder}</span>
      ),
    },
    {
      key: 'isActive',
      label: 'Статус',
      render: (item: HeroSlide) => (
        <Badge variant={item.isActive ? 'default' : 'secondary'}>
          {item.isActive ? 'Активен' : 'Неактивен'}
        </Badge>
      ),
    },
    { key: 'updatedAt', label: 'Обновлён', sortable: true },
  ];

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="mb-2">Слайды Hero секции</h1>
            <p className="text-muted-foreground">
              Управление слайдами главной секции сайта
            </p>
          </div>
          <Button onClick={handleCreate}>
            <Plus className="w-4 h-4 mr-2" />
            Добавить слайд
          </Button>
        </div>

        <DataTable
          data={heroSlides}
          columns={columns}
          isLoading={isLoading}
          onEdit={handleEdit}
          onDelete={handleDelete}
          isDeleting={isDeleting}
        />

        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingItem ? 'Редактировать слайд' : 'Добавить слайд'}
              </DialogTitle>
              <DialogDescription>
                Загрузите изображение и добавьте заголовок для слайда
              </DialogDescription>
            </DialogHeader>

            <Tabs value={translationTab} onValueChange={(v) => setTranslationTab(v as 'ru' | 'en')}>
              <TabsList className="mb-4">
                {TRANSLATION_TABS.map((tab) => (
                  <TabsTrigger key={tab.value} value={tab.value}>
                    {tab.label}
                  </TabsTrigger>
                ))}
              </TabsList>

              <TabsContent value="ru" className="space-y-4">
                <div>
                  <Label>Изображение *</Label>
                  <ImageUpload
                    value={formData.image}
                    onChange={(url) => setFormData({ ...formData, image: url })}
                    label=""
                  />
                </div>

                <div>
                  <Label>Заголовок (RU) *</Label>
                  <Input
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="Профессиональные ветеринарные услуги"
                    className="mt-2.5"
                  />
                </div>
              </TabsContent>

              <TabsContent value="en" className="space-y-4">
                <div>
                  <Label>Заголовок (EN)</Label>
                  <Input
                    value={formData.titleEn}
                    onChange={(e) => setFormData({ ...formData, titleEn: e.target.value })}
                    placeholder="Professional veterinary services"
                    className="mt-2.5"
                  />
                </div>
              </TabsContent>
            </Tabs>

            <div className="grid grid-cols-2 gap-4 mt-4">
              <div>
                <Label>Порядок сортировки</Label>
                <Input
                  type="number"
                  value={formData.sortOrder}
                  onChange={(e) => setFormData({ ...formData, sortOrder: Number(e.target.value) })}
                  className="mt-2.5"
                />
              </div>

              <div className="flex items-center gap-2 mt-8">
                <input
                  type="checkbox"
                  id="isActive"
                  checked={formData.isActive}
                  onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                  className="w-4 h-4"
                />
                <Label htmlFor="isActive" className="cursor-pointer">
                  Активен
                </Label>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-4">
              <Button variant="outline" onClick={() => setIsModalOpen(false)}>
                Отмена
              </Button>
              <Button
                onClick={handleSubmit}
                disabled={isCreating || isUpdating || !formData.image || !formData.title}
              >
                {editingItem ? (isUpdating ? 'Сохранение...' : 'Сохранить') : (isCreating ? 'Создание...' : 'Создать')}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </AdminLayout>
  );
}
