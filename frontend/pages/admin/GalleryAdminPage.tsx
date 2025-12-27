import { useState } from 'react';
import { AdminLayout } from '../../components/admin/AdminLayout';
import { Button } from '../../components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '../../components/ui/dialog';
import { Input } from '../../components/ui/input';
import { Textarea } from '../../components/ui/textarea';
import { Label } from '../../components/ui/label';
import { ImageUpload } from '../../components/admin/ImageUpload';
import { AdminGalleryItem, GallerySection } from '../../shared/types/admin';
import { ImageWithFallback } from '../../components/figma/ImageWithFallback';
import { Plus, Trash2, Edit2, ChevronDown, ChevronUp } from 'lucide-react';
import { 
  useAdminGallery, 
  useGalleryMutations,
  useAdminGallerySections,
  useGallerySectionMutations,
} from '../../shared/hooks/admin/useAdminGallery';
import { toast } from 'sonner';

export function GalleryAdminPage() {
  const { gallery, isLoading: isLoadingItems } = useAdminGallery();
  const { sections, isLoading: isLoadingSections, refetch: refetchSections } = useAdminGallerySections();
  const { createGalleryItem, updateGalleryItem, deleteGalleryItem, isCreating, isUpdating, isDeleting } = useGalleryMutations();
  const { createSection, updateSection, deleteSection, isCreating: isCreatingSection, isUpdating: isUpdatingSection, isDeleting: isDeletingSection } = useGallerySectionMutations();

  console.log(sections);
  
  
  const [isItemModalOpen, setIsItemModalOpen] = useState(false);
  const [isSectionModalOpen, setIsSectionModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<AdminGalleryItem | null>(null);
  const [editingSection, setEditingSection] = useState<GallerySection | null>(null);
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set());
  const [selectedSectionId, setSelectedSectionId] = useState<string>('');
  
  const [itemFormData, setItemFormData] = useState({
    image: '',
    sectionId: '',
    description: '',
    sortOrder: 0,
  });
  
  const [sectionFormData, setSectionFormData] = useState({
    title: '',
    titleEn: '',
    sortOrder: 0,
  });

  const toggleSection = (sectionId: string) => {
    const newExpanded = new Set(expandedSections);
    if (newExpanded.has(sectionId)) {
      newExpanded.delete(sectionId);
    } else {
      newExpanded.add(sectionId);
    }
    setExpandedSections(newExpanded);
  };

  const handleCreateSection = () => {
    setEditingSection(null);
    setSectionFormData({
      title: '',
      titleEn: '',
      sortOrder: sections.length + 1,
    });
    setIsSectionModalOpen(true);
  };

  const handleEditSection = (section: GallerySection) => {
    setEditingSection(section);
    setSectionFormData({
      title: section.title,
      titleEn: section.titleEn || '',
      sortOrder: section.sortOrder,
    });
    setIsSectionModalOpen(true);
  };

  const handleDeleteSection = async (section: GallerySection) => {
    if (confirm(`Удалить секцию "${section.title}" и все её изображения?`)) {
      try {
        await deleteSection(section.id).unwrap();
        toast.success('Секция успешно удалена');
      } catch (error: any) {
        toast.error(error?.data?.message || 'Произошла ошибка');
      }
    }
  };

  const handleCreateItem = (sectionId?: string) => {
    setEditingItem(null);
    setItemFormData({
      image: '',
      sectionId: sectionId || '',
      description: '',
      sortOrder: 0,
    });
    setSelectedSectionId(sectionId || '');
    // Обновляем список секций перед открытием формы
    refetchSections();
    setIsItemModalOpen(true);
  };

  const handleEditItem = (item: AdminGalleryItem) => {
    setEditingItem(item);
    setItemFormData({
      image: item.image,
      sectionId: item.sectionId || '',
      description: item.description || '',
      sortOrder: item.sortOrder,
    });
    setSelectedSectionId(item.sectionId || '');
    setIsItemModalOpen(true);
  };

  const handleDeleteItem = async (item: AdminGalleryItem) => {
    if (confirm('Удалить изображение?')) {
      try {
        await deleteGalleryItem(item.id).unwrap();
        toast.success('Изображение успешно удалено');
      } catch (error: any) {
        toast.error(error?.data?.message || 'Произошла ошибка');
      }
    }
  };

  const getSectionItems = (sectionId: string) => {
    return gallery.filter(item => item.sectionId === sectionId);
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="mb-2">Галерея</h1>
            <p className="text-muted-foreground">
              Секций: {sections.length} | Всего изображений: {gallery.length}
            </p>
          </div>
          <div className="flex gap-2">
            <Button onClick={handleCreateSection} variant="outline">
              <Plus className="w-4 h-4 mr-2" />
              Добавить секцию
            </Button>
            <Button onClick={() => handleCreateItem()}>
              <Plus className="w-4 h-4 mr-2" />
              Добавить изображение
            </Button>
          </div>
        </div>

        {/* Sections List */}
        <div className="space-y-4">
          {sections.map((section) => {
            const sectionItems = getSectionItems(section.id);
            const isExpanded = expandedSections.has(section.id);
            
            return (
              <div key={section.id} className="border border-gray-200 rounded-xl overflow-hidden">
                <div className="bg-gray-50 p-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => toggleSection(section.id)}
                      className="p-1 hover:bg-gray-200 rounded transition-colors"
                    >
                      {isExpanded ? (
                        <ChevronUp className="w-5 h-5" />
                      ) : (
                        <ChevronDown className="w-5 h-5" />
                      )}
                    </button>
                    <div>
                      <h3 className="font-semibold">{section.title}</h3>
                      <p className="text-sm text-muted-foreground">
                        {sectionItems.length} изображений
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleEditSection(section)}
                    >
                      <Edit2 className="w-4 h-4 mr-1" />
                      Изменить
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="text-red-600 border-red-200 hover:bg-red-50"
                      onClick={() => handleDeleteSection(section)}
                      disabled={isDeletingSection}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                    <Button
                      size="sm"
                      onClick={() => handleCreateItem(section.id)}
                    >
                      <Plus className="w-4 h-4 mr-1" />
                      Добавить фото
                    </Button>
                  </div>
                </div>
                
                {isExpanded && (
                  <div className="p-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                      {sectionItems.map((item) => (
                        <div
                          key={item.id}
                          className="group relative bg-white rounded-xl overflow-hidden border border-gray-200 shadow-md hover:shadow-lg transition-shadow"
                        >
                          <ImageWithFallback
                            src={item.image}
                            alt={item.description || 'Gallery image'}
                            className="w-full h-48 object-cover"
                          />
                          <div className="p-3">
                            {item.description && (
                              <p className="text-sm line-clamp-2">{item.description}</p>
                            )}
                          </div>
                          <div className="absolute top-2 right-2 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <Button
                              size="sm"
                              variant="outline"
                              className="bg-white/90 backdrop-blur-sm"
                              onClick={() => handleEditItem(item)}
                            >
                              <Edit2 className="w-4 h-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              className="bg-white/90 backdrop-blur-sm text-red-600 border-red-200 hover:bg-red-50"
                              onClick={() => handleDeleteItem(item)}
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      ))}
                      <button
                        onClick={() => handleCreateItem(section.id)}
                        className="h-48 border-2 border-dashed border-gray-300 rounded-xl hover:border-primary transition-colors flex flex-col items-center justify-center gap-2 text-muted-foreground hover:text-primary"
                      >
                        <Plus className="w-8 h-8" />
                        <span className="text-sm">Добавить изображение</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Section Modal */}
        <Dialog open={isSectionModalOpen} onOpenChange={setIsSectionModalOpen}>
          <DialogContent className="max-w-xl">
            <DialogHeader>
              <DialogTitle>
                {editingSection ? 'Редактировать секцию' : 'Добавить секцию'}
              </DialogTitle>
              <DialogDescription>
                Создайте секцию галереи с названием на русском и английском языках.
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4">
              <div>
                <Label>Название (RU) *</Label>
                <Input
                  value={sectionFormData.title}
                  onChange={(e) => setSectionFormData({ ...sectionFormData, title: e.target.value })}
                  placeholder="Лаборатория"
                  className="mt-2.5"
                />
              </div>

              <div>
                <Label>Название (EN)</Label>
                <Input
                  value={sectionFormData.titleEn}
                  onChange={(e) => setSectionFormData({ ...sectionFormData, titleEn: e.target.value })}
                  placeholder="Laboratory"
                  className="mt-2.5"
                />
              </div>

              <div>
                <Label>Порядок сортировки</Label>
                <Input
                  type="number"
                  value={sectionFormData.sortOrder}
                  onChange={(e) => setSectionFormData({ ...sectionFormData, sortOrder: Number(e.target.value) })}
                  className="mt-2.5"
                />
              </div>

              <div className="flex justify-end gap-2 pt-4">
                <Button variant="outline" onClick={() => setIsSectionModalOpen(false)}>
                  Отмена
                </Button>
                <Button
                  onClick={async () => {
                    try {
                      if (editingSection) {
                        await updateSection({
                          id: editingSection.id,
                          ...sectionFormData,
                        }).unwrap();
                        toast.success('Секция успешно обновлена');
                      } else {
                        await createSection(sectionFormData).unwrap();
                        toast.success('Секция успешно создана');
                        // Обновляем список секций
                        await refetchSections();
                      }
                      setIsSectionModalOpen(false);
                    } catch (error: any) {
                      toast.error(error?.data?.message || 'Произошла ошибка');
                    }
                  }}
                  disabled={isCreatingSection || isUpdatingSection || !sectionFormData.title}
                >
                  {editingSection ? (isUpdatingSection ? 'Сохранение...' : 'Сохранить') : (isCreatingSection ? 'Создание...' : 'Создать')}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* Item Modal */}
        <Dialog open={isItemModalOpen} onOpenChange={setIsItemModalOpen}>
          <DialogContent className="max-w-xl">
            <DialogHeader>
              <DialogTitle>
                {editingItem ? 'Редактировать изображение' : 'Добавить изображение'}
              </DialogTitle>
              <DialogDescription>
                Загрузите изображение для галереи и добавьте описание при необходимости.
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4">
              {/* Изображение - на всю ширину */}
              <div className="col-span-2">
                <Label>Изображение *</Label>
                <ImageUpload
                  value={itemFormData.image}
                  onChange={(url) => setItemFormData({ ...itemFormData, image: url })}
                  label=""
                />
              </div>

              {/* Описание - на всю ширину */}
              <div className="col-span-2">
                <Label>Описание</Label>
                <Textarea
                  value={itemFormData.description}
                  onChange={(e) => setItemFormData({ ...itemFormData, description: e.target.value })}
                  rows={3}
                  placeholder="Описание изображения (отображается только в админке)"
                  className="mt-2.5"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Это описание видно только в админ-панели
                </p>
              </div>

              {/* Секция и Порядок сортировки - в 2 колонки */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Секция *</Label>
                  <select
                    value={itemFormData.sectionId}
                    onChange={(e) => {
                      setItemFormData({ ...itemFormData, sectionId: e.target.value });
                      setSelectedSectionId(e.target.value);
                    }}
                    className="mt-2.5 w-full px-3 py-2 border border-gray-300 rounded-md"
                    required
                    disabled={isLoadingSections}
                  >
                    <option value="">Выберите секцию</option>
                    {isLoadingSections ? (
                      <option value="" disabled>Загрузка секций...</option>
                    ) : (
                      sections.map((section) => (
                        <option key={section.id} value={section.id}>
                          {section.title}
                        </option>
                      ))
                    )}
                  </select>
                  {!isLoadingSections && sections.length === 0 && (
                    <p className="text-xs text-muted-foreground mt-1">
                      Сначала создайте секцию, чтобы добавить изображения
                    </p>
                  )}
                  {isLoadingSections && (
                    <p className="text-xs text-muted-foreground mt-1">
                      Загрузка секций...
                    </p>
                  )}
                </div>

                <div>
                  <Label>Порядок сортировки</Label>
                  <Input
                    type="number"
                    value={itemFormData.sortOrder}
                    onChange={(e) => setItemFormData({ ...itemFormData, sortOrder: Number(e.target.value) })}
                    className="mt-2.5"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-4">
                <Button variant="outline" onClick={() => setIsItemModalOpen(false)}>
                  Отмена
                </Button>
                <Button
                  onClick={async () => {
                    try {
                      if (editingItem) {
                        await updateGalleryItem({
                          id: editingItem.id,
                          image: itemFormData.image,
                          sectionId: itemFormData.sectionId || undefined,
                          description: itemFormData.description,
                          sortOrder: itemFormData.sortOrder,
                        }).unwrap();
                        toast.success('Изображение успешно обновлено');
                      } else {
                        if (!itemFormData.sectionId) {
                          toast.error('Выберите секцию для изображения');
                          return;
                        }
                        await createGalleryItem({
                          image: itemFormData.image,
                          sectionId: itemFormData.sectionId,
                          description: itemFormData.description,
                          sortOrder: itemFormData.sortOrder,
                        }).unwrap();
                        toast.success('Изображение успешно добавлено');
                      }
                      setIsItemModalOpen(false);
                    } catch (error: any) {
                      toast.error(error?.data?.message || 'Произошла ошибка');
                    }
                  }}
                  disabled={isCreating || isUpdating || !itemFormData.image || !itemFormData.sectionId}
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
