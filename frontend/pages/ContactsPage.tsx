import { ContactFormSection } from '../components/sections/ContactFormSection';
import { MapSection } from '../components/sections/MapSection';
import { Phone, Mail, MapPin, Clock } from 'lucide-react';
import { BRAND } from '../shared/constants/brand';
import { Breadcrumbs } from '../components/Breadcrumbs';
import { useLanguage } from '../shared/contexts/LanguageContext';
import { useContacts } from '../shared/hooks/useContacts';
import { getLocalizedField } from '../shared/utils/localization';

export function ContactsPage() {
  const { t, language } = useLanguage();
  const { contacts } = useContacts();

  return (
    <>
      <section className="py-20 bg-gradient-to-br from-[#00AADC] to-[#0088B8] text-white">
        <div className="container mx-auto px-4 text-center">
          <h1 className="mb-6">{t('contactsPage.title')}</h1>
          <p className="text-xl max-w-3xl mx-auto opacity-95">
            {t('contactsPage.subtitle')}
          </p>
        </div>
      </section>

      <section className="py-4 bg-gray-50">
        <div className="container mx-auto px-4">
          <Breadcrumbs items={[{ label: t('nav.contacts') }]} />
        </div>
      </section>

      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            <div className="bg-white shadow-md rounded-xl p-6 border border-gray-100">
              <div
                className="w-12 h-12 rounded-lg flex items-center justify-center mb-4"
                style={{ backgroundColor: `${BRAND.colors.accent}20` }}
              >
                <Phone className="w-6 h-6" style={{ color: BRAND.colors.accent }} />
              </div>
              <h4 className="mb-2">{t('contactsPage.phone')}</h4>
              <a
                href={`tel:${contacts?.phone || BRAND.contact.phone}`}
                className="text-muted-foreground hover:opacity-80 transition-opacity"
              >
                {contacts?.phone || BRAND.contact.phone}
              </a>
            </div>

            <div className="bg-white shadow-md rounded-xl p-6 border border-gray-100">
              <div
                className="w-12 h-12 rounded-lg flex items-center justify-center mb-4"
                style={{ backgroundColor: `${BRAND.colors.accent}20` }}
              >
                <Mail className="w-6 h-6" style={{ color: BRAND.colors.accent }} />
              </div>
              <h4 className="mb-2">{t('contactsPage.email')}</h4>
              <a
                href={`mailto:${contacts?.email || BRAND.contact.email}`}
                className="text-muted-foreground hover:opacity-80 transition-opacity"
              >
                {contacts?.email || BRAND.contact.email}
              </a>
            </div>

            <div className="bg-white shadow-md rounded-xl p-6 border border-gray-100">
              <div
                className="w-12 h-12 rounded-lg flex items-center justify-center mb-4"
                style={{ backgroundColor: `${BRAND.colors.accent}20` }}
              >
                <MapPin className="w-6 h-6" style={{ color: BRAND.colors.accent }} />
              </div>
              <h4 className="mb-2">{t('contactsPage.address')}</h4>
              <p className="text-muted-foreground">
                {contacts ? getLocalizedField(contacts, 'address', language) : BRAND.contact.address}
              </p>
            </div>

            <div className="bg-white shadow-md rounded-xl p-6 border border-gray-100">
              <div
                className="w-12 h-12 rounded-lg flex items-center justify-center mb-4"
                style={{ backgroundColor: `${BRAND.colors.accent}20` }}
              >
                <Clock className="w-6 h-6" style={{ color: BRAND.colors.accent }} />
              </div>
              <h4 className="mb-2">{t('contactsPage.hours')}</h4>
              {contacts?.workingHours ? (
                <p className="text-muted-foreground whitespace-pre-line">
                  {getLocalizedField(contacts, 'workingHours', language)}
                </p>
              ) : (
                <>
                  <p className="text-muted-foreground">{t('contactsPage.schedule')}</p>
                  <p className="text-muted-foreground">{t('contactsPage.weekend')}</p>
                </>
              )}
            </div>
          </div>
        </div>
      </section>

      <ContactFormSection />
      <MapSection />
    </>
  );
}
