import { useState } from 'react';
import { AdminLayout } from '../../components/admin/AdminLayout';
import { DataTable } from '../../components/admin/DataTable';
import { Button } from '../../components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '../../components/ui/dialog';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs';
import { ImageUpload } from '../../components/admin/ImageUpload';
import { AdminTeamMember } from '../../shared/types/admin';
import { ImageWithFallback } from '../../components/figma/ImageWithFallback';
import { useAdminTeam, useTeamMutations } from '../../shared/hooks/admin/useAdminTeam';
import { toast } from 'sonner';

const TRANSLATION_TABS = [
  { value: 'ru', label: 'Русский 🇷🇺' },
  { value: 'en', label: 'English 🇬🇧' },
] as const;

// const MOCK_TEAM: AdminTeamMember[] = [
//   {
//     id: '1',
//     name: 'Айгерим Нурланова',
//     position: 'Генеральный директор',
//     photo: 'https://images.unsplash.com/photo-1758599543111-a7ed48b8ad2c?w=200',
//     email: 'a.nurlanova@vet-lab.tj',
//     phone: '+992 (92) 777-12-34',
//     social: {
//       facebook: 'https://facebook.com',
//       linkedin: 'https://linkedin.com',
//     },
//     sortOrder: 1,
//     createdAt: '2024-11-01',
//     updatedAt: '2024-11-15',
//   },
// ];

export function TeamAdminPage() {
  const { team, isLoading } = useAdminTeam();
  const { createTeamMember, updateTeamMember, deleteTeamMember, isCreating, isUpdating, isDeleting } = useTeamMutations();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<AdminTeamMember | null>(null);
  const [translationTab, setTranslationTab] = useState<'ru' | 'en'>('ru');
  const [formData, setFormData] = useState({
    name: '',
    nameEn: '',
    position: '',
    positionEn: '',
    photo: '',
    sortOrder: 0,
  });

  const handleCreate = () => {
    setEditingItem(null);
    setFormData({
      name: '',
      nameEn: '',
      position: '',
      positionEn: '',
      photo: '',
      sortOrder: team.length + 1,
    });
    setIsModalOpen(true);
  };

  const handleEdit = (item: AdminTeamMember) => {
    setEditingItem(item);
    setFormData({
      name: item.name,
      nameEn: item.nameEn || '',
      position: item.position,
      positionEn: item.positionEn || '',
      photo: item.photo || '',
      sortOrder: item.sortOrder,
    });
    setIsModalOpen(true);
  };

  const columns = [
    {
      key: 'photo',
      label: 'Фото',
      render: (item: AdminTeamMember) =>
        item.photo ? (
          <ImageWithFallback
            src={item.photo}
            alt={item.name}
            className="w-12 h-12 rounded-full object-cover"
          />
        ) : (
          <div className="w-12 h-12 rounded-full bg-gray-100" />
        ),
    },
    { key: 'name', label: 'ФИО', sortable: true },
    { key: 'position', label: 'Должность', sortable: true },
    { key: 'sortOrder', label: 'Порядок', sortable: true },
  ];

  return (
    <AdminLayout>
      <div className="space-y-6">
        <DataTable
          data={team}
          columns={columns}
          onCreate={handleCreate}
          onEdit={handleEdit}
          onDelete={async (item) => {
            if (confirm('Удалить сотрудника?')) {
              try {
                await deleteTeamMember(item.id).unwrap();
                toast.success('Сотрудник успешно удален');
              } catch (error: any) {
                toast.error(error?.data?.message || 'Произошла ошибка');
              }
            }
          }}
          title="Команда"
          searchPlaceholder="Поиск сотрудников..."
          isLoading={isLoading}
        />

        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingItem ? 'Редактировать сотрудника' : 'Добавить сотрудника'}
              </DialogTitle>
              <DialogDescription>
                Добавьте информацию о члене команды, включая имя, должность и фотографию.
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
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>ФИО *</Label>
                      <Input
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder="Иван Иванов"
                        className="mt-2.5"
                      />
                    </div>
                    <div>
                      <Label>Должность *</Label>
                      <Input
                        value={formData.position}
                        onChange={(e) => setFormData({ ...formData, position: e.target.value })}
                        placeholder="Генеральный директор"
                        className="mt-2.5"
                      />
                    </div>
                  </div>
                </TabsContent>

                {/* English Content */}
                <TabsContent value="en" className="space-y-4 mt-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>Full Name (English)</Label>
                      <Input
                        value={formData.nameEn}
                        onChange={(e) => setFormData({ ...formData, nameEn: e.target.value })}
                        placeholder="John Doe"
                        className="mt-2.5"
                      />
                    </div>
                    <div>
                      <Label>Position (English)</Label>
                      <Input
                        value={formData.positionEn}
                        onChange={(e) => setFormData({ ...formData, positionEn: e.target.value })}
                        placeholder="Chief Executive Officer"
                        className="mt-2.5"
                      />
                    </div>
                  </div>
                </TabsContent>
              </Tabs>

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
                    value={formData.photo}
                    onChange={(url) => setFormData({ ...formData, photo: url })}
                    label="Фото сотрудника"
                    aspectRatio="1/1"
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
                      const data: any = {
                        name: formData.name,
                        position: formData.position,
                        photo: formData.photo,
                        sortOrder: formData.sortOrder,
                      };
                      
                      if (formData.nameEn) data.nameEn = formData.nameEn;
                      if (formData.positionEn) data.positionEn = formData.positionEn;
                      
                      if (editingItem) {
                        await updateTeamMember({ id: editingItem.id, ...data }).unwrap();
                        toast.success('Сотрудник успешно обновлен');
                      } else {
                        await createTeamMember(data).unwrap();
                        toast.success('Сотрудник успешно создан');
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
