import { useState } from 'react';
import { AdminLayout } from '../../components/admin/AdminLayout';
import { Button } from '../../components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '../../components/ui/dialog';
import { Input } from '../../components/ui/input';
import { Textarea } from '../../components/ui/textarea';
import { Label } from '../../components/ui/label';
import { ImageUpload } from '../../components/admin/ImageUpload';
import { AdminGalleryItem } from '../../shared/types/admin';
import { ImageWithFallback } from '../../components/figma/ImageWithFallback';
import { Plus, Trash2 } from 'lucide-react';
import { useAdminGallery, useGalleryMutations } from '../../shared/hooks/admin/useAdminGallery';
import { toast } from 'sonner';

// const MOCK_GALLERY: AdminGalleryItem[] = [
//   {
//     id: '1',
//     image: 'https://images.unsplash.com/photo-1631557676757-fcc7b1160be8?w=400',
//     category: 'Лаборатория',
//     description: 'Современное оборудование',
//     sortOrder: 1,
//     createdAt: '2024-11-01',
//     updatedAt: '2024-11-15',
//   },
//   {
//     id: '2',
//     image: 'https://images.unsplash.com/photo-1614308459036-779d0dfe51ff?w=400',
//     category: 'Лаборатория',
//     description: 'Микроскоп',
//     sortOrder: 2,
//     createdAt: '2024-11-02',
//     updatedAt: '2024-11-16',
//   },
// ];

export function GalleryAdminPage() {
  const { gallery, isLoading } = useAdminGallery();
  const { createGalleryItem, updateGalleryItem, deleteGalleryItem, isCreating, isUpdating, isDeleting } = useGalleryMutations();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<AdminGalleryItem | null>(null);
  const [formData, setFormData] = useState({
    image: '',
    category: '',
    description: '',
    sortOrder: 0,
  });

  const handleCreate = () => {
    setEditingItem(null);
    setFormData({
      image: '',
      category: '',
      description: '',
      sortOrder: gallery.length + 1,
    });
    setIsModalOpen(true);
  };

  const handleEdit = (item: AdminGalleryItem) => {
    setEditingItem(item);
    setFormData({
      image: item.image,
      category: item.category || '',
      description: item.description || '',
      sortOrder: item.sortOrder,
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (item: AdminGalleryItem) => {
    if (confirm('Удалить изображение?')) {
      try {
        await deleteGalleryItem(item.id).unwrap();
        toast.success('Изображение успешно удалено');
      } catch (error: any) {
        toast.error(error?.data?.message || 'Произошла ошибка');
      }
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="mb-2">Галерея</h1>
            <p className="text-muted-foreground">
              Всего изображений: {gallery.length}
            </p>
          </div>
          <Button onClick={handleCreate}>
            <Plus className="w-4 h-4 mr-2" />
            Добавить изображение
          </Button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {gallery.map((item) => (
            <div
              key={item.id}
              className="group relative bg-white rounded-xl overflow-hidden border border-gray-200 hover:shadow-lg transition-shadow"
            >
              <ImageWithFallback
                src={item.image}
                alt={item.description || 'Gallery image'}
                className="w-full h-48 object-cover"
              />
              <div className="p-3">
                {item.category && (
                  <p className="text-xs text-muted-foreground mb-1">
                    {item.category}
                  </p>
                )}
                {item.description && (
                  <p className="text-sm line-clamp-2">{item.description}</p>
                )}
              </div>
              <div className="absolute top-2 right-2 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <Button
                  size="sm"
                  variant="outline"
                  className="bg-white/90 backdrop-blur-sm"
                  onClick={() => handleEdit(item)}
                >
                  Изменить
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  className="bg-white/90 backdrop-blur-sm text-red-600 border-red-200 hover:bg-red-50"
                  onClick={() => handleDelete(item)}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
          ))}

          {/* Add New Card */}
          <button
            onClick={handleCreate}
            className="h-48 border-2 border-dashed border-gray-300 rounded-xl hover:border-primary transition-colors flex flex-col items-center justify-center gap-2 text-muted-foreground hover:text-primary"
          >
            <Plus className="w-8 h-8" />
            <span className="text-sm">Добавить изображение</span>
          </button>
        </div>

        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
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
              <div>
                <ImageUpload
                  value={formData.image}
                  onChange={(url) => setFormData({ ...formData, image: url })}
                  label="Изображение"
                />
              </div>

              <div>
                <Label>Категория</Label>
                <Input
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  placeholder="Лаборатория, Офис, Мероприятие..."
                  className="mt-2.5"
                />
              </div>

              <div>
                <Label>Описание</Label>
                <Textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={3}
                  placeholder="Описание изображения"
                  className="mt-2.5"
                />
              </div>

              <div>
                <Label>Порядок сортировки</Label>
                <Input
                  type="number"
                  value={formData.sortOrder}
                  onChange={(e) => setFormData({ ...formData, sortOrder: Number(e.target.value) })}
                  className="mt-2.5"
                />
              </div>

              <div className="flex justify-end gap-2 pt-4">
                <Button variant="outline" onClick={() => setIsModalOpen(false)}>
                  Отмена
                </Button>
                <Button
                  onClick={async () => {
                    try {
                      if (editingItem) {
                        await updateGalleryItem({
                          id: editingItem.id,
                          image: formData.image,
                          category: formData.category,
                          description: formData.description,
                          sortOrder: formData.sortOrder,
                        }).unwrap();
                        toast.success('Изображение успешно обновлено');
                      } else {
                        await createGalleryItem({
                          image: formData.image,
                          category: formData.category,
                          description: formData.description,
                          sortOrder: formData.sortOrder,
                        }).unwrap();
                        toast.success('Изображение успешно добавлено');
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
