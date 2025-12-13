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
import { AdminNews } from '../../shared/types/admin';
import { ImageWithFallback } from '../../components/figma/ImageWithFallback';
import { Calendar } from 'lucide-react';
import { useAdminNews, useNewsMutations } from '../../shared/hooks/admin/useAdminNews';
import { toast } from 'sonner';

const TRANSLATION_TABS = [
  { value: 'ru', label: 'Русский 🇷🇺' },
  { value: 'en', label: 'English 🇬🇧' },
] as const;

// const MOCK_NEWS: AdminNews[] = [
//   {
//     id: '1',
//     title: 'Открытие новой лаборатории в Худжанде',
//     excerpt: 'Мы рады сообщить об открытии нашей новой, современной лаборатории',
//     content: '<p>Полный текст новости...</p>',
//     coverImage: 'https://images.unsplash.com/photo-1742970936099-b68c962278c9?w=200',
//     publishedAt: '2024-11-15',
//     status: 'published',
//     author: 'Администратор',
//     createdAt: '2024-11-10',
//     updatedAt: '2024-11-15',
//   },
// ];

export function NewsAdminPage() {
  const { news, isLoading } = useAdminNews();
  const { createNews, updateNews, deleteNews, isCreating, isUpdating, isDeleting } = useNewsMutations();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<AdminNews | null>(null);
  const [translationTab, setTranslationTab] = useState<'ru' | 'en'>('ru');
  const [formData, setFormData] = useState({
    title: '',
    titleEn: '',
    excerpt: '',
    excerptEn: '',
    content: '',
    contentEn: '',
    coverImage: '',
    publishedAt: new Date().toISOString().split('T')[0],
    status: 'draft' as const,
  });

  const handleCreate = () => {
    setEditingItem(null);
    setFormData({
      title: '',
      titleEn: '',
      excerpt: '',
      excerptEn: '',
      content: '',
      contentEn: '',
      coverImage: '',
      publishedAt: new Date().toISOString().split('T')[0],
      status: 'draft',
    });
    setIsModalOpen(true);
  };

  const handleEdit = (item: AdminNews) => {
    setEditingItem(item);
    setFormData({
      title: item.title,
      titleEn: item.titleEn || '',
      excerpt: item.excerpt,
      excerptEn: item.excerptEn || '',
      content: item.content,
      contentEn: item.contentEn || '',
      coverImage: item.coverImage || '',
      publishedAt: item.publishedAt,
      status: item.status,
    });
    setIsModalOpen(true);
  };

  const columns = [
    {
      key: 'coverImage',
      label: 'Обложка',
      render: (item: AdminNews) =>
        item.coverImage ? (
          <ImageWithFallback
            src={item.coverImage}
            alt={item.title}
            className="w-20 h-12 rounded-lg object-cover"
          />
        ) : (
          <div className="w-20 h-12 rounded-lg bg-gray-100" />
        ),
    },
    { key: 'title', label: 'Заголовок', sortable: true },
    {
      key: 'excerpt',
      label: 'Краткое описание',
      render: (item: AdminNews) => (
        <span className="line-clamp-2 max-w-md">{item.excerpt}</span>
      ),
    },
    {
      key: 'status',
      label: 'Статус',
      render: (item: AdminNews) => (
        <Badge
          variant={
            item.status === 'published'
              ? 'default'
              : item.status === 'draft'
              ? 'secondary'
              : 'outline'
          }
        >
          {item.status === 'published'
            ? 'Опубликовано'
            : item.status === 'draft'
            ? 'Черновик'
            : 'Запланировано'}
        </Badge>
      ),
    },
    { key: 'publishedAt', label: 'Дата публикации', sortable: true },
  ];

  return (
    <AdminLayout>
      <div className="space-y-6">
        <DataTable
          data={news}
          columns={columns}
          onCreate={handleCreate}
          onEdit={handleEdit}
          onDelete={async (item) => {
            if (confirm('Удалить новость?')) {
              try {
                await deleteNews(item.id).unwrap();
                toast.success('Новость успешно удалена');
              } catch (error: any) {
                toast.error(error?.data?.message || 'Произошла ошибка');
              }
            }
          }}
          title="Новости"
          searchPlaceholder="Поиск новостей..."
          isLoading={isLoading}
        />

        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingItem ? 'Редактировать новость' : 'Создать новость'}
              </DialogTitle>
              <DialogDescription>
                Создайте или отредактируйте новость. Заполните заголовок, краткое описание и полный контент.
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
                    <Label>Заголовок *</Label>
                    <Input
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      placeholder="Заголовок новости"
                      className="mt-2.5"
                    />
                  </div>

                  <div>
                    <Label>Краткое описание *</Label>
                    <Textarea
                      value={formData.excerpt}
                      onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                      rows={3}
                      placeholder="Краткое описание для превью"
                      className="mt-2.5"
                    />
                  </div>

                  <div>
                    <Label>Полный текст *</Label>
                    <div className="mt-2.5">
                      <RichTextEditor
                        value={formData.content}
                        onChange={(value) => setFormData({ ...formData, content: value })}
                        placeholder="Полный текст новости с форматированием"
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
                      placeholder="News title in English"
                      className="mt-2.5"
                    />
                  </div>

                  <div>
                    <Label>Short Description (English)</Label>
                    <Textarea
                      value={formData.excerptEn}
                      onChange={(e) => setFormData({ ...formData, excerptEn: e.target.value })}
                      rows={3}
                      placeholder="Short description for preview"
                      className="mt-2.5"
                    />
                  </div>

                  <div>
                    <Label>Full Content (English)</Label>
                    <div className="mt-2.5">
                      <RichTextEditor
                        value={formData.contentEn}
                        onChange={(value) => setFormData({ ...formData, contentEn: value })}
                        placeholder="Full news content with formatting"
                      />
                    </div>
                  </div>
                </TabsContent>
              </Tabs>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Дата публикации</Label>
                  <div className="relative mt-2.5">
                    <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <Input
                      type="date"
                      value={formData.publishedAt}
                      onChange={(e) => setFormData({ ...formData, publishedAt: e.target.value })}
                      className="pl-10"
                    />
                  </div>
                </div>

                <div>
                  <Label>Статус</Label>
                  <Select
                    value={formData.status}
                    onValueChange={(v) => setFormData({ ...formData, status: v as AdminNews['status'] })}
                  >
                    <SelectTrigger className="mt-2.5">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="published">Опубликовано</SelectItem>
                      <SelectItem value="draft">Черновик</SelectItem>
                      <SelectItem value="scheduled">Запланировано</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <div className="mt-2.5">
                  <ImageUpload
                    value={formData.coverImage}
                    onChange={(url) => setFormData({ ...formData, coverImage: url })}
                    label="Обложка новости"
                    aspectRatio="16/9"
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
                        excerpt: formData.excerpt,
                        content: formData.content,
                        coverImage: formData.coverImage,
                        publishedAt: formData.publishedAt,
                        status: formData.status,
                      };
                      
                      if (formData.titleEn) payload.titleEn = formData.titleEn;
                      if (formData.excerptEn) payload.excerptEn = formData.excerptEn;
                      if (formData.contentEn) payload.contentEn = formData.contentEn;
                      
                      if (editingItem) {
                        await updateNews({
                          id: editingItem.id,
                          ...payload,
                        }).unwrap();
                        toast.success('Новость успешно обновлена');
                      } else {
                        await createNews(payload).unwrap();
                        toast.success('Новость успешно создана');
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
