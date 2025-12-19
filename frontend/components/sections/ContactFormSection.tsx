import { useState } from 'react';
import { Send } from 'lucide-react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import { BRAND } from '../../shared/constants/brand';
import { ImageWithFallback } from '../figma/ImageWithFallback';
import { useLanguage } from '../../shared/contexts/LanguageContext';
import { useSubmitContactMutation } from '../../shared/services/contact.service';
import { toast } from 'sonner';

interface ContactFormProps {
  contextType?: 'product' | 'service' | 'general';
  contextId?: string;
  contextTitle?: string;
}

export function ContactFormSection({ contextType, contextId, contextTitle }: ContactFormProps = {}) {
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
    } catch (error) {
      toast.error(t('contact.error'));
    }
  };

  return (
    <section className="py-12 md:py-16 lg:py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-2 gap-8 lg:gap-12 items-center">
          <div>
            <h2 className="mb-3 md:mb-4">{t('contact.title')}</h2>
            <p className="text-muted-foreground mb-6 md:mb-8 text-sm md:text-base">
              {t('contact.subtitle')}
            </p>

            {contextTitle && (
              <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-sm text-blue-800">
                  <span className="font-semibold">
                    {contextType === 'product' ? t('contact.aboutProduct') : t('contact.aboutService')}:
                  </span>{' '}
                  {contextTitle}
                </p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4 md:space-y-6">
              <div>
                <label htmlFor="name" className="block mb-2 text-sm md:text-base">
                  {t('contact.name')} <span className="text-red-500">*</span>
                </label>
                <Input
                  id="name"
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder={t('contact.namePlaceholder')}
                  required
                  className="w-full"
                  disabled={isLoading}
                />
              </div>

              <div>
                <label htmlFor="phone" className="block mb-2 text-sm md:text-base">
                  {t('contact.phone')}
                </label>
                <Input
                  id="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder={t('contact.phonePlaceholder')}
                  className="w-full"
                  disabled={isLoading}
                />
              </div>

              <div>
                <label htmlFor="email" className="block mb-2 text-sm md:text-base">
                  {t('contact.email')}
                </label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder={t('contact.emailPlaceholder')}
                  className="w-full"
                  disabled={isLoading}
                />
              </div>

              <div>
                <label htmlFor="message" className="block mb-2 text-sm md:text-base">
                  {t('contact.message')} <span className="text-red-500">*</span>
                </label>
                <Textarea
                  id="message"
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  placeholder={t('contact.messagePlaceholder')}
                  rows={5}
                  className="w-full resize-none"
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
                <Send className="w-4 h-4 md:w-5 md:h-5 mr-2" />
                {isLoading ? t('contact.sending') : t('contact.submit')}
              </Button>
            </form>
          </div>

          <div className="relative">
            <div className="absolute -inset-4 rounded-3xl opacity-15" style={{ backgroundColor: BRAND.colors.accent }} />
            <ImageWithFallback
              src="https://images.unsplash.com/photo-1631557676757-fcc7b1160be8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtZWRpY2FsJTIwbGFib3JhdG9yeSUyMHJlc2VhcmNofGVufDF8fHx8MTc2NDU3NzMwNXww&ixlib=rb-4.1.0&q=80&w=1080"
              alt="Contact VET-LAB"
              className="relative rounded-2xl w-full h-[500px] object-cover shadow-xl"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
