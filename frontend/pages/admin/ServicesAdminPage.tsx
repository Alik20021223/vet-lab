import { useState } from 'react';
import { AdminLayout } from '../../components/admin/AdminLayout';
import { DataTable } from '../../components/admin/DataTable';
import { Badge } from '../../components/ui/badge';
import { Button } from '../../components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '../../components/ui/dialog';
import { Input } from '../../components/ui/input';
import { Textarea } from '../../components/ui/textarea';
import { Label } from '../../components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs';
import { ImageUpload } from '../../components/admin/ImageUpload';
import { RichTextEditor } from '../../components/admin/RichTextEditor';
import { AdminService } from '../../shared/types/admin';
import { ImageWithFallback } from '../../components/figma/ImageWithFallback';
import { useAdminServices, useServiceMutations } from '../../shared/hooks/admin/useAdminServices';
import { toast } from 'sonner';
import { resolveImageUrl } from '@/shared/utils/imageUrl';

const TRANSLATION_TABS = [
  { value: 'ru', label: 'Русский 🇷🇺' },
  { value: 'en', label: 'English 🇬🇧' },
] as const;

// const MOCK_SERVICES: AdminService[] = [
//   {
//     id: '1',
//     title: 'Лабораторные услуги',
//     shortDescription: 'Полный спектр лабораторных исследований',
//     fullDescription: '<p>Наша современная лаборатория оснащена передовым оборудованием...</p>',
//     image: 'https://images.unsplash.com/photo-1614308459036-779d0dfe51ff?w=200',
//     icon: 'Microscope',
//     status: 'active',
//     sortOrder: 1,
//     createdAt: '2024-11-01',
//     updatedAt: '2024-11-20',
//   },
// ];

export function ServicesAdminPage() {
  const { services, isLoading } = useAdminServices();
  const { createService, updateService, deleteService, isCreating, isUpdating, isDeleting } = useServiceMutations();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<AdminService | null>(null);
  const [translationTab, setTranslationTab] = useState<'ru' | 'en'>('ru');
  const [formData, setFormData] = useState({
    title: '',
    titleEn: '',
    shortDescription: '',
    shortDescriptionEn: '',
    fullDescription: '',
    fullDescriptionEn: '',
    image: '',
    icon: '',
    status: 'active' as const,
  });

  const handleCreate = () => {
    setEditingItem(null);
    setFormData({
      title: '',
      titleEn: '',
      shortDescription: '',
      shortDescriptionEn: '',
      fullDescription: '',
      fullDescriptionEn: '',
      image: '',
      icon: '',
      status: 'active',
    });
    setIsModalOpen(true);
  };

  const handleEdit = (item: AdminService) => {
    setEditingItem(item);
    setFormData({
      title: item.title,
      titleEn: item.titleEn || '',
      shortDescription: item.shortDescription,
      shortDescriptionEn: item.shortDescriptionEn || '',
      fullDescription: item.fullDescription,
      fullDescriptionEn: item.fullDescriptionEn || '',
      image: item.image || '',
      icon: item.icon || '',
      status: item.status,
    });
    setIsModalOpen(true);
  };

  const columns = [
    {
      key: 'image',
      label: 'Фото',
      render: (item: AdminService) =>
        item.image ? (
          <ImageWithFallback
            src={resolveImageUrl(item.image)}
            alt={item.title}
            className="w-16 h-16 rounded-lg object-cover"
          />
        ) : (
          <div className="w-16 h-16 rounded-lg bg-gray-100" />
        ),
    },
    { key: 'title', label: 'Название', sortable: true },
    {
      key: 'shortDescription',
      label: 'Описание',
      render: (item: AdminService) => (
        <span className="line-clamp-2 max-w-md">{item.shortDescription}</span>
      ),
    },
    {
      key: 'status',
      label: 'Статус',
      render: (item: AdminService) => (
        <Badge variant={item.status === 'active' ? 'default' : 'secondary'}>
          {item.status === 'active' ? 'Активна' : 'Черновик'}
        </Badge>
      ),
    },
    { key: 'sortOrder', label: 'Порядок', sortable: true },
  ];

  return (
    <AdminLayout>
      <div className="space-y-6">
        <DataTable
          data={services}
          columns={columns}
          onCreate={handleCreate}
          onEdit={handleEdit}
          onDelete={async (item) => {
            if (confirm('Удалить услугу?')) {
              try {
                await deleteService(item.id).unwrap();
                toast.success('Услуга успешно удалена');
              } catch (error: any) {
                toast.error(error?.data?.message || 'Произошла ошибка');
              }
            }
          }}
          title="Услуги"
          searchPlaceholder="Поиск услуг..."
          isLoading={isLoading}
        />

        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
          <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingItem ? 'Редактировать услугу' : 'Добавить услугу'}
              </DialogTitle>
              <DialogDescription>
                Заполните информацию об услуге. Все поля рекомендуется заполнить для полноты информации.
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
                      placeholder="Название услуги"
                      className="mt-2.5"
                    />
                  </div>

                  <div>
                    <Label>Краткое описание *</Label>
                    <Textarea
                      value={formData.shortDescription}
                      onChange={(e) => setFormData({ ...formData, shortDescription: e.target.value })}
                      placeholder="Краткое описание услуги"
                      rows={3}
                      className="mt-2.5"
                    />
                  </div>

                  <div>
                    <Label>Полное описание *</Label>
                    <div className="mt-2.5">
                      <RichTextEditor
                        value={formData.fullDescription}
                        onChange={(value) => setFormData({ ...formData, fullDescription: value })}
                        placeholder="Подробное описание услуги с форматированием"
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
                      placeholder="Service title in English"
                      className="mt-2.5"
                    />
                  </div>

                  <div>
                    <Label>Short Description (English)</Label>
                    <Textarea
                      value={formData.shortDescriptionEn}
                      onChange={(e) => setFormData({ ...formData, shortDescriptionEn: e.target.value })}
                      placeholder="Short service description"
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
                        placeholder="Detailed service description with formatting"
                      />
                    </div>
                  </div>
                </TabsContent>
              </Tabs>

              <div>
                <Label>Иконка (название из lucide-react)</Label>
                <Input
                  value={formData.icon}
                  onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
                  placeholder="Microscope"
                  className="mt-2.5"
                />
              </div>

              <div>
                <Label>Статус</Label>
                <Select
                  value={formData.status}
                  onValueChange={(v) => setFormData({ ...formData, status: v as 'active' | 'draft' })}
                >
                  <SelectTrigger className="mt-2.5">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Активна</SelectItem>
                    <SelectItem value="draft">Черновик</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>Изображение</Label>
                <div className="mt-2.5">
                  <ImageUpload
                    value={formData.image}
                    onChange={(url) => setFormData({ ...formData, image: url })}
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-4">
                <Button variant="outline" onClick={() => setIsModalOpen(false)}>
                  Отмена
                </Button>
                <Button
                  onClick={async () => {
                    try {
                      const payload: any = {
                        title: formData.title,
                        shortDescription: formData.shortDescription,
                        fullDescription: formData.fullDescription,
                        image: formData.image,
                        icon: formData.icon,
                        status: formData.status,
                      };

                      if (formData.titleEn) payload.titleEn = formData.titleEn;
                      if (formData.shortDescriptionEn) payload.shortDescriptionEn = formData.shortDescriptionEn;
                      if (formData.fullDescriptionEn) payload.fullDescriptionEn = formData.fullDescriptionEn;

                      if (editingItem) {
                        await updateService({
                          id: editingItem.id,
                          ...payload,
                        }).unwrap();
                        toast.success('Услуга успешно обновлена');
                      } else {
                        await createService(payload).unwrap();
                        toast.success('Услуга успешно создана');
                      }
                      setIsModalOpen(false);
                    } catch (error: any) {
                      toast.error(error?.data?.message || 'Произошла ошибка');
                    }
                  }}
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
