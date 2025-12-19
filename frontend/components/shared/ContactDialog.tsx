import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '../ui/dialog';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import { Send } from 'lucide-react';
import { useLanguage } from '../../shared/contexts/LanguageContext';
import { useSubmitContactMutation } from '../../shared/services/contact.service';
import { toast } from 'sonner';
import { BRAND } from '../../shared/constants/brand';

interface ContactDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  contextType?: 'product' | 'service';
  contextId?: string;
  contextTitle?: string;
}

export function ContactDialog({
  open,
  onOpenChange,
  contextType,
  contextId,
  contextTitle,
}: ContactDialogProps) {
  const { t } = useLanguage();
  const [submitContact, { isLoading }] = useSubmitContactMutation();
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    message: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await submitContact({
        name: formData.name,
        phone: formData.phone,
        email: formData.email,
        message: formData.message,
        contextType,
        contextId,
        contextTitle,
      }).unwrap();

      toast.success(t('contact.success'));

      setFormData({ name: '', phone: '', email: '', message: '' });
      onOpenChange(false);
    } catch (error) {
      toast.error(t('contact.error'));
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{t('contact.title')}</DialogTitle>
          <DialogDescription>{t('contact.subtitle')}</DialogDescription>
        </DialogHeader>

        {contextTitle && (
          <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg mb-4">
            <p className="text-sm text-blue-800">
              <span className="font-semibold">
                {contextType === 'product'
                  ? t('contact.aboutProduct')
                  : t('contact.aboutService')}
                :
              </span>{' '}
              {contextTitle}
            </p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="dialog-name" className="block mb-2 text-sm font-medium">
              {t('contact.name')} <span className="text-red-500">*</span>
            </label>
            <Input
              id="dialog-name"
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder={t('contact.namePlaceholder')}
              required
              disabled={isLoading}
            />
          </div>

          <div>
            <label htmlFor="dialog-phone" className="block mb-2 text-sm font-medium">
              {t('contact.phone')}
            </label>
            <Input
              id="dialog-phone"
              type="tel"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              placeholder={t('contact.phonePlaceholder')}
              disabled={isLoading}
            />
          </div>

          <div>
            <label htmlFor="dialog-email" className="block mb-2 text-sm font-medium">
              {t('contact.email')}
            </label>
            <Input
              id="dialog-email"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              placeholder={t('contact.emailPlaceholder')}
              disabled={isLoading}
            />
          </div>

          <div>
            <label htmlFor="dialog-message" className="block mb-2 text-sm font-medium">
              {t('contact.message')} <span className="text-red-500">*</span>
            </label>
            <Textarea
              id="dialog-message"
              value={formData.message}
              onChange={(e) => setFormData({ ...formData, message: e.target.value })}
              placeholder={t('contact.messagePlaceholder')}
              rows={4}
              className="resize-none"
              required
              disabled={isLoading}
            />
          </div>

          <Button
            type="submit"
            size="lg"
            style={{ backgroundColor: BRAND.colors.accent }}
            className="w-full text-white hover:opacity-90"
            disabled={isLoading}
          >
            <Send className="w-4 h-4 mr-2" />
            {isLoading ? t('contact.sending') : t('contact.submit')}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}






