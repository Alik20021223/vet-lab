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
import { RichTextEditor } from '../../components/admin/RichTextEditor';
import { AdminJob } from '../../shared/types/admin';
import { useAdminCareers, useCareerMutations } from '../../shared/hooks/admin/useAdminCareers';
import { toast } from 'sonner';
import { X } from 'lucide-react';

const TRANSLATION_TABS = [
  { value: 'ru', label: 'Русский 🇷🇺' },
  { value: 'en', label: 'English 🇬🇧' },
] as const;

export function CareersAdminPage() {
  const { careers, isLoading } = useAdminCareers();
  const { createCareer, updateCareer, deleteCareer, isCreating, isUpdating, isDeleting } = useCareerMutations();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<AdminJob | null>(null);
  const [translationTab, setTranslationTab] = useState<'ru' | 'en'>('ru');
  const [formData, setFormData] = useState({
    title: '',
    titleEn: '',
    description: '',
    descriptionEn: '',
    fullDescription: '',
    fullDescriptionEn: '',
    location: '',
    locationEn: '',
    type: 'full-time' as 'full-time' | 'part-time' | 'contract' | 'internship',
    department: '',
    departmentEn: '',
    requirements: [] as string[],
    responsibilities: [] as string[],
    benefits: [] as string[],
    salaryMin: '',
    salaryMax: '',
    salaryCurrency: 'TJS',
    status: 'active' as 'active' | 'draft' | 'closed' | 'expired',
    sortOrder: 0,
    expiresAt: '',
  });
  const [newRequirement, setNewRequirement] = useState('');
  const [newResponsibility, setNewResponsibility] = useState('');
  const [newBenefit, setNewBenefit] = useState('');

  const handleCreate = () => {
    setEditingItem(null);
    setFormData({
      title: '',
      titleEn: '',
      description: '',
      descriptionEn: '',
      fullDescription: '',
      fullDescriptionEn: '',
      location: '',
      locationEn: '',
      type: 'full-time',
      department: '',
      departmentEn: '',
      requirements: [],
      responsibilities: [],
      benefits: [],
      salaryMin: '',
      salaryMax: '',
      salaryCurrency: 'TJS',
      status: 'active',
      sortOrder: 0,
      expiresAt: '',
    });
    setIsModalOpen(true);
  };

  const handleEdit = (item: AdminJob) => {
    setEditingItem(item);
    setFormData({
      title: item.title,
      titleEn: (item as any).titleEn || '',
      description: item.description,
      descriptionEn: (item as any).descriptionEn || '',
      fullDescription: item.fullDescription,
      fullDescriptionEn: (item as any).fullDescriptionEn || '',
      location: item.location,
      locationEn: (item as any).locationEn || '',
      type: item.type,
      department: item.department || '',
      departmentEn: (item as any).departmentEn || '',
      requirements: item.requirements || [],
      responsibilities: item.responsibilities || [],
      benefits: item.benefits || [],
      salaryMin: item.salary?.min?.toString() || '',
      salaryMax: item.salary?.max?.toString() || '',
      salaryCurrency: item.salary?.currency || 'TJS',
      status: item.status,
      sortOrder: item.sortOrder,
      expiresAt: item.expiresAt ? new Date(item.expiresAt).toISOString().split('T')[0] : '',
    });
    setIsModalOpen(true);
  };

  const addRequirement = () => {
    if (newRequirement.trim()) {
      setFormData({
        ...formData,
        requirements: [...formData.requirements, newRequirement.trim()],
      });
      setNewRequirement('');
    }
  };

  const removeRequirement = (index: number) => {
    setFormData({
      ...formData,
      requirements: formData.requirements.filter((_, i) => i !== index),
    });
  };

  const addResponsibility = () => {
    if (newResponsibility.trim()) {
      setFormData({
        ...formData,
        responsibilities: [...formData.responsibilities, newResponsibility.trim()],
      });
      setNewResponsibility('');
    }
  };

  const removeResponsibility = (index: number) => {
    setFormData({
      ...formData,
      responsibilities: formData.responsibilities.filter((_, i) => i !== index),
    });
  };

  const addBenefit = () => {
    if (newBenefit.trim()) {
      setFormData({
        ...formData,
        benefits: [...formData.benefits, newBenefit.trim()],
      });
      setNewBenefit('');
    }
  };

  const removeBenefit = (index: number) => {
    setFormData({
      ...formData,
      benefits: formData.benefits.filter((_, i) => i !== index),
    });
  };

  const columns = [
    { key: 'title', label: 'Название', sortable: true },
    {
      key: 'location',
      label: 'Локация',
    },
    {
      key: 'type',
      label: 'Тип',
      render: (item: AdminJob) => {
        const typeLabels: Record<string, string> = {
          'full-time': 'Полная занятость',
          'part-time': 'Частичная занятость',
          'contract': 'Контракт',
          'internship': 'Стажировка',
        };
        return <span>{typeLabels[item.type] || item.type}</span>;
      },
    },
    {
      key: 'status',
      label: 'Статус',
      render: (item: AdminJob) => {
        const statusLabels: Record<string, string> = {
          active: 'Активна',
          draft: 'Черновик',
          closed: 'Закрыта',
          expired: 'Истекла',
        };
        const variants: Record<string, 'default' | 'secondary' | 'destructive' | 'outline'> = {
          active: 'default',
          draft: 'secondary',
          closed: 'outline',
          expired: 'destructive',
        };
        return (
          <Badge variant={variants[item.status] || 'secondary'}>
            {statusLabels[item.status] || item.status}
          </Badge>
        );
      },
    },
    { key: 'sortOrder', label: 'Порядок', sortable: true },
  ];

  return (
    <AdminLayout>
      <div className="space-y-6">
        <DataTable
          data={careers}
          columns={columns}
          onCreate={handleCreate}
          onEdit={handleEdit}
          onDelete={async (item) => {
            if (confirm('Удалить вакансию?')) {
              try {
                await deleteCareer(item.id).unwrap();
                toast.success('Вакансия успешно удалена');
              } catch (error: any) {
                toast.error(error?.data?.message || 'Произошла ошибка');
              }
            }
          }}
          title="Вакансии"
          searchPlaceholder="Поиск вакансий..."
          isLoading={isLoading}
        />

        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingItem ? 'Редактировать вакансию' : 'Добавить вакансию'}
              </DialogTitle>
              <DialogDescription>
                Заполните информацию о вакансии. Все поля рекомендуется заполнить для полноты информации.
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
                      <Label>Название вакансии *</Label>
                      <Input
                        value={formData.title}
                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                        className="mt-2.5"
                        placeholder="Ветеринарный врач"
                        required
                      />
                    </div>
                    <div>
                      <Label>Локация *</Label>
                      <Input
                        value={formData.location}
                        onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                        className="mt-2.5"
                        placeholder="Худжанд, Таджикистан"
                        required
                      />
                    </div>
                  </div>
                </TabsContent>

                {/* English Content */}
                <TabsContent value="en" className="space-y-4 mt-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>Job Title (English)</Label>
                      <Input
                        value={formData.titleEn}
                        onChange={(e) => setFormData({ ...formData, titleEn: e.target.value })}
                        className="mt-2.5"
                        placeholder="Veterinarian"
                      />
                    </div>
                    <div>
                      <Label>Location (English)</Label>
                      <Input
                        value={formData.locationEn}
                        onChange={(e) => setFormData({ ...formData, locationEn: e.target.value })}
                        className="mt-2.5"
                        placeholder="Khujand, Tajikistan"
                      />
                    </div>
                  </div>
                </TabsContent>
              </Tabs>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Тип занятости *</Label>
                  <Select
                    value={formData.type}
                    onValueChange={(v) => setFormData({ ...formData, type: v as any })}
                  >
                    <SelectTrigger className="mt-2.5">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="full-time">Полная занятость</SelectItem>
                      <SelectItem value="part-time">Частичная занятость</SelectItem>
                      <SelectItem value="contract">Контракт</SelectItem>
                      <SelectItem value="internship">Стажировка</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Отдел/Департамент</Label>
                  <Input
                    value={formData.department}
                    onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                    className="mt-2.5"
                    placeholder="Ветеринария"
                  />
                </div>
              </div>

              <div>
                <Label>Department (English)</Label>
                <Input
                  value={formData.departmentEn}
                  onChange={(e) => setFormData({ ...formData, departmentEn: e.target.value })}
                  className="mt-2.5"
                  placeholder="Veterinary"
                />
              </div>

              <Tabs value={translationTab} onValueChange={(v) => setTranslationTab(v as 'ru' | 'en')}>
                <TabsList className="grid grid-cols-2 w-full max-w-md mb-4">
                  {TRANSLATION_TABS.map((tab) => (
                    <TabsTrigger key={tab.value} value={tab.value}>
                      {tab.label}
                    </TabsTrigger>
                  ))}
                </TabsList>

                <TabsContent value="ru" className="space-y-4">
                  <div>
                    <Label>Краткое описание *</Label>
                    <Textarea
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      rows={3}
                      className="mt-2.5"
                      placeholder="Краткое описание вакансии для карточек"
                      required
                    />
                  </div>

                  <div>
                    <Label>Полное описание *</Label>
                    <div className="mt-2.5">
                      <RichTextEditor
                        value={formData.fullDescription}
                        onChange={(value) => setFormData({ ...formData, fullDescription: value })}
                        placeholder="Подробное описание вакансии"
                      />
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="en" className="space-y-4">
                  <div>
                    <Label>Short Description (English)</Label>
                    <Textarea
                      value={formData.descriptionEn}
                      onChange={(e) => setFormData({ ...formData, descriptionEn: e.target.value })}
                      rows={3}
                      className="mt-2.5"
                      placeholder="Short job description for cards"
                    />
                  </div>

                  <div>
                    <Label>Full Description (English)</Label>
                    <div className="mt-2.5">
                      <RichTextEditor
                        value={formData.fullDescriptionEn}
                        onChange={(value) => setFormData({ ...formData, fullDescriptionEn: value })}
                        placeholder="Detailed job description"
                      />
                    </div>
                  </div>
                </TabsContent>
              </Tabs>

              <div>
                <Label>Требования</Label>
                <div className="mt-2.5 space-y-2">
                  <div className="flex gap-2">
                    <Input
                      value={newRequirement}
                      onChange={(e) => setNewRequirement(e.target.value)}
                      onKeyPress={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          addRequirement();
                        }
                      }}
                      placeholder="Добавить требование"
                    />
                    <Button type="button" onClick={addRequirement} variant="outline">
                      Добавить
                    </Button>
                  </div>
                  <div className="space-y-1">
                    {formData.requirements.map((req, index) => (
                      <div key={index} className="flex items-center gap-2 bg-gray-50 p-2 rounded">
                        <span className="flex-1">{req}</span>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => removeRequirement(index)}
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div>
                <Label>Обязанности</Label>
                <div className="mt-2.5 space-y-2">
                  <div className="flex gap-2">
                    <Input
                      value={newResponsibility}
                      onChange={(e) => setNewResponsibility(e.target.value)}
                      onKeyPress={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          addResponsibility();
                        }
                      }}
                      placeholder="Добавить обязанность"
                    />
                    <Button type="button" onClick={addResponsibility} variant="outline">
                      Добавить
                    </Button>
                  </div>
                  <div className="space-y-1">
                    {formData.responsibilities.map((resp, index) => (
                      <div key={index} className="flex items-center gap-2 bg-gray-50 p-2 rounded">
                        <span className="flex-1">{resp}</span>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => removeResponsibility(index)}
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div>
                <Label>Преимущества</Label>
                <div className="mt-2.5 space-y-2">
                  <div className="flex gap-2">
                    <Input
                      value={newBenefit}
                      onChange={(e) => setNewBenefit(e.target.value)}
                      onKeyPress={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          addBenefit();
                        }
                      }}
                      placeholder="Добавить преимущество"
                    />
                    <Button type="button" onClick={addBenefit} variant="outline">
                      Добавить
                    </Button>
                  </div>
                  <div className="space-y-1">
                    {formData.benefits.map((benefit, index) => (
                      <div key={index} className="flex items-center gap-2 bg-gray-50 p-2 rounded">
                        <span className="flex-1">{benefit}</span>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => removeBenefit(index)}
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label>Зарплата от</Label>
                  <Input
                    type="number"
                    value={formData.salaryMin}
                    onChange={(e) => setFormData({ ...formData, salaryMin: e.target.value })}
                    className="mt-2.5"
                    placeholder="30000"
                  />
                </div>
                <div>
                  <Label>Зарплата до</Label>
                  <Input
                    type="number"
                    value={formData.salaryMax}
                    onChange={(e) => setFormData({ ...formData, salaryMax: e.target.value })}
                    className="mt-2.5"
                    placeholder="50000"
                  />
                </div>
                <div>
                  <Label>Валюта</Label>
                  <Select
                    value={formData.salaryCurrency}
                    onValueChange={(v) => setFormData({ ...formData, salaryCurrency: v })}
                  >
                    <SelectTrigger className="mt-2.5">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="TJS">TJS (сомони)</SelectItem>
                      <SelectItem value="USD">USD (доллар)</SelectItem>
                      <SelectItem value="EUR">EUR (евро)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label>Статус *</Label>
                  <Select
                    value={formData.status}
                    onValueChange={(v) => setFormData({ ...formData, status: v as any })}
                  >
                    <SelectTrigger className="mt-2.5">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="active">Активна</SelectItem>
                      <SelectItem value="draft">Черновик</SelectItem>
                      <SelectItem value="closed">Закрыта</SelectItem>
                      <SelectItem value="expired">Истекла</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Порядок сортировки</Label>
                  <Input
                    type="number"
                    value={formData.sortOrder}
                    onChange={(e) => setFormData({ ...formData, sortOrder: parseInt(e.target.value) || 0 })}
                    className="mt-2.5"
                  />
                </div>
                <div>
                  <Label>Дата истечения</Label>
                  <Input
                    type="date"
                    value={formData.expiresAt}
                    onChange={(e) => setFormData({ ...formData, expiresAt: e.target.value })}
                    className="mt-2.5"
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
                        description: formData.description,
                        fullDescription: formData.fullDescription,
                        location: formData.location,
                        type: formData.type,
                        requirements: formData.requirements,
                        responsibilities: formData.responsibilities,
                        benefits: formData.benefits,
                        status: formData.status,
                        sortOrder: formData.sortOrder,
                      };

                      if (formData.titleEn) payload.titleEn = formData.titleEn;
                      if (formData.descriptionEn) payload.descriptionEn = formData.descriptionEn;
                      if (formData.fullDescriptionEn) payload.fullDescriptionEn = formData.fullDescriptionEn;
                      if (formData.locationEn) payload.locationEn = formData.locationEn;
                      if (formData.departmentEn) payload.departmentEn = formData.departmentEn;

                      if (formData.department) {
                        payload.department = formData.department;
                      }

                      if (formData.salaryMin || formData.salaryMax) {
                        payload.salary = {
                          min: formData.salaryMin ? parseInt(formData.salaryMin) : undefined,
                          max: formData.salaryMax ? parseInt(formData.salaryMax) : undefined,
                          currency: formData.salaryCurrency,
                        };
                      }

                      if (formData.expiresAt) {
                        payload.expiresAt = new Date(formData.expiresAt).toISOString();
                      }

                      if (editingItem) {
                        await updateCareer({
                          id: editingItem.id,
                          ...payload,
                        }).unwrap();
                        toast.success('Вакансия успешно обновлена');
                      } else {
                        await createCareer(payload).unwrap();
                        toast.success('Вакансия успешно создана');
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

