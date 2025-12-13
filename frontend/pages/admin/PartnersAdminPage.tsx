import { useState } from 'react';
import { AdminLayout } from '../../components/admin/AdminLayout';
import { DataTable } from '../../components/admin/DataTable';
import { Button } from '../../components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '../../components/ui/dialog';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { ImageUpload } from '../../components/admin/ImageUpload';
import { AdminPartner } from '../../shared/types/admin';
import { ImageWithFallback } from '../../components/figma/ImageWithFallback';
import { useAdminPartners, usePartnerMutations } from '../../shared/hooks/admin/useAdminPartners';
import { toast } from 'sonner';

// const MOCK_PARTNERS: AdminPartner[] = [
//   {
//     id: '1',
//     name: 'Компания Партнёр 1',
//     logo: 'https://via.placeholder.com/150',
//     url: 'https://example.com',
//     sortOrder: 1,
//     createdAt: '2024-11-01',
//     updatedAt: '2024-11-15',
//   },
// ];

export function PartnersAdminPage() {
  const { partners, isLoading } = useAdminPartners();
  const { createPartner, updatePartner, deletePartner, isCreating, isUpdating, isDeleting } = usePartnerMutations();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<AdminPartner | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    logo: '',
    url: '',
    sortOrder: 0,
  });

  const handleCreate = () => {
    setEditingItem(null);
    setFormData({
      name: '',
      logo: '',
      url: '',
      sortOrder: partners.length + 1,
    });
    setIsModalOpen(true);
  };

  const handleEdit = (item: AdminPartner) => {
    setEditingItem(item);
    setFormData({
      name: item.name,
      logo: item.logo,
      url: item.url || '',
      sortOrder: item.sortOrder,
    });
    setIsModalOpen(true);
  };

  const columns = [
    {
      key: 'logo',
      label: 'Логотип',
      render: (item: AdminPartner) => (
        item.logo ? (
          <ImageWithFallback
            src={item.logo}
            alt={item.name}
            className="w-20 h-12 rounded-lg object-contain bg-gray-50"
          />
        ) : (
          <div className="w-20 h-12 rounded-lg bg-gray-100 flex items-center justify-center text-gray-400 text-xs">
            Нет лого
          </div>
        )
      ),
    },
    { key: 'name', label: 'Название', sortable: true },
    {
      key: 'url',
      label: 'Сайт',
      render: (item: AdminPartner) =>
        item.url ? (
          <a
            href={item.url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary hover:underline"
          >
            {item.url}
          </a>
        ) : (
          '—'
        ),
    },
    { key: 'sortOrder', label: 'Порядок', sortable: true },
  ];

  return (
    <AdminLayout>
      <div className="space-y-6">
        <DataTable
          data={partners}
          columns={columns}
          onCreate={handleCreate}
          onEdit={handleEdit}
          onDelete={async (item) => {
            if (confirm('Удалить партнёра?')) {
              try {
                await deletePartner(item.id).unwrap();
                toast.success('Партнёр успешно удален');
              } catch (error: any) {
                toast.error(error?.data?.message || 'Произошла ошибка');
              }
            }
          }}
          title="Партнёры"
          searchPlaceholder="Поиск партнёров..."
          isLoading={isLoading}
        />

        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
          <DialogContent className="max-w-xl">
            <DialogHeader>
              <DialogTitle>
                {editingItem ? 'Редактировать партнёра' : 'Добавить партнёра'}
              </DialogTitle>
              <DialogDescription>
                Добавьте информацию о партнёре компании, включая название, логотип и ссылку на сайт.
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4">
              <div>
                <Label>Название *</Label>
                <Input
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Название компании"
                  className="mt-2.5"
                />
              </div>

              <div>
                <Label>URL сайта</Label>
                <Input
                  type="url"
                  value={formData.url}
                  onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                  placeholder="https://example.com"
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

              <div>
                <div className="mt-2.5">
                  <ImageUpload
                    value={formData.logo}
                    onChange={(url) => setFormData({ ...formData, logo: url })}
                    label="Логотип партнёра"
                    aspectRatio="3/2"
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
                      if (editingItem) {
                        await updatePartner({
                          id: editingItem.id,
                          name: formData.name,
                          logo: formData.logo || undefined,
                          url: formData.url || undefined,
                          sortOrder: formData.sortOrder,
                        }).unwrap();
                        toast.success('Партнёр успешно обновлен');
                      } else {
                        await createPartner({
                          name: formData.name,
                          logo: formData.logo || undefined,
                          url: formData.url || undefined,
                          sortOrder: formData.sortOrder,
                        }).unwrap();
                        toast.success('Партнёр успешно создан');
                      }
                      setIsModalOpen(false);
                    } catch (error: any) {
                      toast.error(error?.data?.message || 'Произошла ошибка');
                    }
                  }}
                  disabled={!formData.name.trim() || isCreating || isUpdating}
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
