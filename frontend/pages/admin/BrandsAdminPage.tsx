import { useState } from 'react';
import { AdminLayout } from '../../components/admin/AdminLayout';
import { DataTable } from '../../components/admin/DataTable';
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
import { ImageUpload } from '../../components/admin/ImageUpload';
import { Brand } from '../../shared/types/admin';
import { ImageWithFallback } from '../../components/figma/ImageWithFallback';
import { useAdminBrands, useBrandMutations } from '../../shared/hooks/admin/useAdminBrands';
import { toast } from 'sonner';

// const MOCK_DATA: Brand[] = [
//   {
//     id: '1',
//     name: 'Zoetis',
//     logo: 'https://images.unsplash.com/photo-1599305445671-ac291c95aaa9?w=200',
//     description: 'Мировой лидер в производстве ветеринарных препаратов',
//     sortOrder: 1,
//     createdAt: '2024-11-20',
//     updatedAt: '2024-11-25',
//   },
//   {
//     id: '2',
//     name: 'Bayer Animal Health',
//     logo: 'https://images.unsplash.com/photo-1599305446671-ac291c95aaa9?w=200',
//     description: 'Инновационные решения для здоровья животных',
//     sortOrder: 2,
//     createdAt: '2024-11-18',
//     updatedAt: '2024-11-20',
//   },
// ];

export function BrandsAdminPage() {
  const { brands, isLoading } = useAdminBrands();
  const { createBrand, updateBrand, deleteBrand, isCreating, isUpdating, isDeleting } = useBrandMutations();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<Brand | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    logo: '',
    description: '',
  });

  const handleCreate = () => {
    setEditingItem(null);
    setFormData({ name: '', logo: '', description: '' });
    setIsModalOpen(true);
  };

  const handleEdit = (item: Brand) => {
    setEditingItem(item);
    setFormData({
      name: item.name,
      logo: item.logo || '',
      description: item.description || '',
    });
    setIsModalOpen(true);
  };

  const handleSave = async () => {
    try {
      if (editingItem) {
        await updateBrand({
          id: editingItem.id,
          name: formData.name,
          logo: formData.logo,
          description: formData.description,
        }).unwrap();
        toast.success('Бренд успешно обновлен');
      } else {
        await createBrand({
          name: formData.name,
          logo: formData.logo,
          description: formData.description,
        }).unwrap();
        toast.success('Бренд успешно создан');
      }
      setIsModalOpen(false);
    } catch (error: any) {
      toast.error(error?.data?.message || 'Произошла ошибка');
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm('Вы уверены, что хотите удалить этот бренд?')) {
      try {
        await deleteBrand(id).unwrap();
        toast.success('Бренд успешно удален');
      } catch (error: any) {
        toast.error(error?.data?.message || 'Произошла ошибка');
      }
    }
  };

  const columns = [
    {
      key: 'logo',
      label: 'Логотип',
      render: (item: Brand) =>
        item.logo ? (
          <ImageWithFallback
            src={item.logo}
            alt={item.name}
            className="w-16 h-16 rounded-lg object-contain bg-gray-50 p-2"
          />
        ) : (
          <div className="w-16 h-16 rounded-lg bg-gray-100" />
        ),
    },
    {
      key: 'name',
      label: 'Название',
      render: (item: Brand) => <div>{item.name}</div>,
    },
    {
      key: 'description',
      label: 'Описание',
      render: (item: Brand) => (
        <div className="text-sm text-gray-600 max-w-md truncate">
          {item.description || '—'}
        </div>
      ),
    },
    {
      key: 'createdAt',
      label: 'Создано',
      render: (item: Brand) => (
        <div className="text-sm text-gray-600">
          {new Date(item.createdAt).toLocaleDateString('ru-RU')}
        </div>
      ),
    },
  ];

  return (
    <AdminLayout>
      <div className="space-y-6">
        <DataTable
          title="Бренды"
          description="Управление брендами продукции"
          data={brands}
          columns={columns}
          onCreate={handleCreate}
          onEdit={handleEdit}
          onDelete={handleDelete}
          createButtonLabel="Добавить бренд"
          isLoading={isLoading}
        />

        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingItem ? 'Редактировать бренд' : 'Добавить бренд'}
              </DialogTitle>
              <DialogDescription>
                Укажите информацию о бренде. Название обязательно для заполнения.
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4">
              <div>
                <Label htmlFor="name">Название бренда *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  placeholder="Введите название бренда"
                  className="mt-2.5"
                />
              </div>

              <div>
                <Label htmlFor="description">Описание</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  placeholder="Краткое описание бренда"
                  rows={3}
                  className="mt-2.5"
                />
              </div>

              <div>
                <Label>Логотип</Label>
                <div className="mt-2.5">
                  <ImageUpload
                    value={formData.logo}
                    onChange={(url) => setFormData({ ...formData, logo: url })}
                  />
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <Button 
                  onClick={handleSave} 
                  className="flex-1"
                  disabled={isCreating || isUpdating}
                >
                  {editingItem ? (isUpdating ? 'Сохранение...' : 'Сохранить') : (isCreating ? 'Создание...' : 'Создать')}
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1"
                >
                  Отмена
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </AdminLayout>
  );
}
