import { useState, useEffect } from 'react';
import { AdminLayout } from '../../components/admin/AdminLayout';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Textarea } from '../../components/ui/textarea';
import { Label } from '../../components/ui/label';
import { Card } from '../../components/ui/card';
import { Save } from 'lucide-react';
import { ContactInfo } from '../../shared/types/admin';
import { useAdminContacts, useContactsMutations } from '../../shared/hooks/admin/useAdminContacts';
import { toast } from 'sonner';

// const MOCK_CONTACTS: ContactInfo = {
//   phone: '+992 (92) 777-12-34',
//   email: 'info@vet-lab.tj',
//   address: 'г. Худжанд, Таджикистан, ул. Ленина 123',
//   mapLat: 40.283138,
//   mapLng: 69.593495,
//   workingHours: 'Пн-Пт: 9:00 - 18:00',
//   requisites: {
//     companyName: 'ООО "VET-LAB"',
//     inn: '123456789012',
//     kpp: '123456789',
//     bankName: 'Банк Название',
//     bankAccount: '12345678901234567890',
//   },
// };

export function ContactsAdminPage() {
  const { contacts, isLoading } = useAdminContacts();
  const { updateContacts, isUpdating } = useContactsMutations();
  const [formData, setFormData] = useState<ContactInfo>({
    phone: '',
    email: '',
    address: '',
    addressEn: '',
    mapLat: 0,
    mapLng: 0,
    workingHours: '',
    workingHoursEn: '',
  });

  useEffect(() => {
    if (contacts && 'phone' in contacts && contacts.phone) {
      setFormData({
        phone: contacts.phone || '',
        email: contacts.email || '',
        address: contacts.address || '',
        addressEn: contacts.addressEn || '',
        mapLat: contacts.mapLat || 0,
        mapLng: contacts.mapLng || 0,
        workingHours: contacts.workingHours || '',
        workingHoursEn: contacts.workingHoursEn || '',
      });
    }
  }, [contacts]);

  const handleSave = async () => {
    try {
      await updateContacts(formData).unwrap();
      toast.success('Контакты успешно сохранены');
    } catch (error: any) {
      toast.error(error?.data?.message || 'Произошла ошибка');
    }
  };

  return (
    <AdminLayout>
      <div className="max-w-4xl space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="mb-2">Контактная информация</h1>
            <p className="text-muted-foreground">
              Управление контактными данными компании
            </p>
          </div>
          <Button onClick={handleSave} disabled={isUpdating || isLoading}>
            <Save className="w-4 h-4 mr-2" />
            {isUpdating ? 'Сохранение...' : 'Сохранить'}
          </Button>
        </div>

        <Card className="p-6">
          <h3 className="mb-4">Основные контакты</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label>Телефон</Label>
              <Input
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                placeholder="+992 (92) 777-12-34"
                className="mt-2.5"
              />
            </div>
            <div>
              <Label>Email</Label>
              <Input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="info@vet-lab.tj"
                className="mt-2.5"
              />
            </div>
          </div>

          <div className="mt-4">
            <Label>Адрес (Русский)</Label>
            <Textarea
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              rows={2}
              placeholder="г. Худжанд, Таджикистан, ул. Ленина 123"
              className="mt-2.5"
            />
          </div>

          <div className="mt-4">
            <Label>Адрес (English)</Label>
            <Textarea
              value={formData.addressEn || ''}
              onChange={(e) => setFormData({ ...formData, addressEn: e.target.value })}
              rows={2}
              placeholder="Khujand, Tajikistan, Lenin St. 123"
              className="mt-2.5"
            />
          </div>

          <div className="mt-4">
            <Label>Режим работы (Русский)</Label>
            <Input
              value={formData.workingHours || ''}
              onChange={(e) => setFormData({ ...formData, workingHours: e.target.value })}
              placeholder="Пн-Пт: 9:00 - 18:00"
              className="mt-2.5"
            />
          </div>

          <div className="mt-4">
            <Label>Режим работы (English)</Label>
            <Input
              value={formData.workingHoursEn || ''}
              onChange={(e) => setFormData({ ...formData, workingHoursEn: e.target.value })}
              placeholder="Mon-Fri: 9:00 AM - 6:00 PM"
              className="mt-2.5"
            />
          </div>
        </Card>

        <Card className="p-6">
          <h3 className="mb-4">Координаты карты</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Широта (Latitude)</Label>
              <Input
                type="number"
                step="0.000001"
                value={formData.mapLat}
                onChange={(e) => setFormData({ ...formData, mapLat: Number(e.target.value) })}
                placeholder="40.283138"
                className="mt-2.5"
              />
            </div>
            <div>
              <Label>Долгота (Longitude)</Label>
              <Input
                type="number"
                step="0.000001"
                value={formData.mapLng}
                onChange={(e) => setFormData({ ...formData, mapLng: Number(e.target.value) })}
                placeholder="69.593495"
                className="mt-2.5"
              />
            </div>
          </div>
          <p className="text-xs text-muted-foreground mt-2">
            Используйте{' '}
            <a
              href="https://www.google.com/maps"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              Google Maps
            </a>{' '}
            для получения координат
          </p>
        </Card>

      </div>
    </AdminLayout>
  );
}
