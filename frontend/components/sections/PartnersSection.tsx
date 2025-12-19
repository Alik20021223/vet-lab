import { usePartners } from '../../shared/hooks/usePartners';
import { ImageWithFallback } from '../figma/ImageWithFallback';
import { useLanguage } from '../../shared/contexts/LanguageContext';
import { resolveImageUrl } from '@/shared/utils/imageUrl';

export function PartnersSection() {
  const { partners, isLoading } = usePartners();
  const { t } = useLanguage();

  // const partners = [
  //   'Zoetis',
  //   'Boehringer Ingelheim',
  //   'MSD Animal Health',
  //   'Ceva',
  //   'Huvepharma',
  //   'Elanco',
  //   'Virbac',
  //   'Vetoquinol',
  // ];

  if (isLoading || !partners || partners.length === 0) {
    return null;
  }

  return (
    <section className="py-20 bg-gray-50" id="partners">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="mb-4">{t('partners.title')}</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            {t('partners.subtitle')}
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-8">
          {partners.map((partner) => (
            <div
              key={partner.id}
              className="bg-white rounded-xl p-8 flex items-center justify-center border border-gray-100 shadow-md hover:shadow-lg transition-shadow"
            >
              {partner.logo ? (
                <ImageWithFallback
                  src={resolveImageUrl(partner.logo)}
                  alt={partner.name}
                  className="max-w-full max-h-16 object-contain"
                />
              ) : (
                <span className="text-xl text-gray-400 font-semibold">{partner.name}</span>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
