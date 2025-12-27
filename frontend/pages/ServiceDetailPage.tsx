import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { BRAND } from '../shared/constants/brand';
import { Button } from '../components/ui/button';
import { ImageWithFallback } from '../components/figma/ImageWithFallback';
import { RichTextContent } from '../components/shared/RichTextContent';
import { Breadcrumbs } from '../components/Breadcrumbs';
import { ContactDialog } from '../components/shared/ContactDialog';
import { useLanguage } from '../shared/contexts/LanguageContext';
import { useService } from '../shared/hooks/useServices';
import { DynamicIcon } from '../shared/utils/iconLoader';
import { getLocalizedField } from '../shared/utils/localization';
import { resolveImageUrl } from '@/shared/utils/imageUrl';

export function ServiceDetailPage() {
  const { serviceId } = useParams<{ serviceId: string }>();
  const { t, language } = useLanguage();
  const [contactDialogOpen, setContactDialogOpen] = useState(false);
  const { service, isLoading, error } = useService(serviceId);

  if (isLoading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-center">
          <p>{t('serviceDetail.loading')}</p>
        </div>
      </div>
    );
  }


  if (!service) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-center">
          <h2 className="mb-4">{t('serviceDetail.notFound')}</h2>
          {error && (
            <p className="text-sm text-muted-foreground mb-4">
              {t('common.error')}: {'data' in error && error.data && typeof error.data === 'object' && 'message' in error.data
                ? String(error.data.message)
                : t('common.unknownError')}
            </p>
          )}
          <Button asChild>
            <Link to="/services">{t('serviceDetail.backToServices')}</Link>
          </Button>
        </div>
      </div>
    );
  }

  // API возвращает данные напрямую, не в обертке { data: ... }
  const serviceData = service as import('../shared/types/admin').AdminService;

  // Локализованные данные
  const title = getLocalizedField(serviceData, 'title', language);
  const shortDescription = getLocalizedField(serviceData, 'shortDescription', language) ||
    getLocalizedField(serviceData, 'description', language);
  const fullDescription = getLocalizedField(serviceData, 'fullDescription', language);

  return (
    <>
      <section className="py-20 bg-linear-to-br from-[#00AADC] to-[#0088B8] text-white">
        <div className="container mx-auto px-4">
          <Link
            to="/services"
            className="inline-flex items-center gap-2 mb-8 hover:gap-3 transition-all text-white/90 hover:text-white"
          >
            <ArrowLeft className="w-5 h-5" />
            {t('serviceDetail.backToServicesShort')}
          </Link>
          <div className="flex items-start gap-6">
            <div
              className="w-20 h-20 rounded-xl flex items-center justify-center shrink-0"
              style={{ backgroundColor: 'rgba(255, 255, 255, 0.2)' }}
            >
              <DynamicIcon iconName={serviceData.icon} className="w-10 h-10 text-white" />
            </div>
            <div>
              <h1 className="mb-4">{title}</h1>
              <p className="text-xl opacity-95">{shortDescription || fullDescription || ''}</p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-4 bg-white">
        <div className="container mx-auto px-4">
          <Breadcrumbs
            items={[
              { label: t('nav.services'), href: '/services' },
              { label: title },
            ]}
          />
        </div>
      </section>

      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12">
            <div>
              <h2 className="mb-6">{t('serviceDetail.description')}</h2>
              <div className="mb-8">
                <RichTextContent content={fullDescription || shortDescription || ''} />
              </div>

              <div className="mt-8">
                <Button
                  size="lg"
                  style={{ backgroundColor: BRAND.colors.accent }}
                  className="text-white hover:opacity-90"
                  onClick={() => setContactDialogOpen(true)}
                >
                  {t('serviceDetail.order')}
                </Button>
              </div>
            </div>

            <div className="relative">
              <ImageWithFallback
                src={resolveImageUrl(serviceData.image || 'https://images.unsplash.com/photo-1631557676757-fcc7b1160be8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtZWRpY2FsJTIwbGFib3JhdG9yeSUyMHJlc2VhcmNofGVufDF8fHx8MTc2NDU3NzMwNXww&ixlib=rb-4.1.0&q=80&w=1080')}
                alt={serviceData.title}
                className="rounded-2xl w-full h-[500px] object-cover shadow-xl"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Contact Dialog */}
      <ContactDialog
        open={contactDialogOpen}
        onOpenChange={setContactDialogOpen}
        contextType="service"
        contextId={serviceData.id}
        contextTitle={title}
      />
    </>
  );
}
