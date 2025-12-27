import { Link } from 'react-router-dom';
import { Phone, Mail, MapPin, Facebook, Instagram, Linkedin, Send } from 'lucide-react';
import { NAVIGATION } from '../../shared/constants/navigation';
import { BRAND } from '../../shared/constants/brand';
import { useServices } from '../../shared/hooks/useServices';
import { useLanguage } from '../../shared/contexts/LanguageContext';
import { useContacts } from '../../shared/hooks/useContacts';
import { getLocalizedField } from '../../shared/utils/localization';
import logo from '../../assets/vetLab-logo.png';

export function Footer() {
  const { services } = useServices();
  const { contacts } = useContacts();
  const { t, language } = useLanguage();

  return (
      <footer className="bg-linear-to-br from-[#00AADC] to-[#0088B8] text-white">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div>
            <div className="mb-6">
              <img src={logo} alt="VET-LAB Logo" className="h-20 w-auto brightness-0 invert" />
            </div>
            <p className="text-white/90 text-sm mb-4">
              {t('footer.description')}
            </p>
          </div>

          <div>
            <h3 className="font-semibold mb-4">{t('footer.navigation')}</h3>
            <ul className="space-y-2">
              {NAVIGATION.map((item) => (
                <li key={item.href}>
                  <Link to={item.href} className="text-white/90 hover:text-white transition-colors text-sm">
                    {t(item.labelKey)}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-4">{t('footer.services')}</h3>
            {services && services.length > 0 ? (
              <ul className="space-y-2">
                {services.map((service) => {
                  const title = getLocalizedField(service, 'title', language);
                  
                  return (
                    <li key={service.id}>
                      <Link 
                        to={`/services/${service.id}`} 
                        className="text-white/90 hover:text-white transition-colors text-sm"
                      >
                        {title}
                      </Link>
                    </li>
                  );
                })}
                <li>
                  <Link 
                    to="/services#pricing" 
                    className="text-white/90 hover:text-white transition-colors text-sm"
                  >
                    {language === 'en' ? 'Price List' : 'Прайс-лист'}
                  </Link>
                </li>
              </ul>
            ) : (
              <ul className="space-y-2">
                <li>
                  <Link 
                    to="/services" 
                    className="text-white/90 hover:text-white transition-colors text-sm"
                  >
                    {t('common.viewAll')}
                  </Link>
                </li>
                <li>
                  <Link 
                    to="/services#pricing" 
                    className="text-white/90 hover:text-white transition-colors text-sm"
                  >
                    {language === 'en' ? 'Price List' : 'Прайс-лист'}
                  </Link>
                </li>
              </ul>
            )}
          </div>

          <div>
            <h3 className="font-semibold mb-4">{t('footer.contacts')}</h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-2">
                <MapPin className="w-5 h-5 shrink-0 mt-0.5" />
                <span className="text-white/90 text-sm">
                  {contacts ? getLocalizedField(contacts, 'address', language) : BRAND.contact.address}
                </span>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="w-5 h-5 shrink-0" />
                <a href={`tel:${contacts?.phone || BRAND.contact.phone}`} className="text-white/90 hover:text-white transition-colors text-sm">
                  {contacts?.phone || BRAND.contact.phone}
                </a>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="w-5 h-5 shrink-0" />
                <a href={`mailto:${contacts?.email || BRAND.contact.email}`} className="text-white/90 hover:text-white transition-colors text-sm">
                  {contacts?.email || BRAND.contact.email}
                </a>
              </li>
            </ul>

            <div className="flex gap-3 mt-4">
              {contacts?.telegram && (
                <a
                  href={contacts.telegram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-9 h-9 rounded-lg flex items-center justify-center transition-colors"
                  style={{ backgroundColor: BRAND.colors.accent }}
                >
                  <Send className="w-5 h-5" />
                </a>
              )}
              {contacts?.facebook && (
                <a
                  href={contacts.facebook}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-9 h-9 rounded-lg flex items-center justify-center transition-colors"
                  style={{ backgroundColor: BRAND.colors.accent }}
                >
                  <Facebook className="w-5 h-5" />
                </a>
              )}
              {contacts?.instagram && (
                <a
                  href={contacts.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-9 h-9 rounded-lg flex items-center justify-center transition-colors"
                  style={{ backgroundColor: BRAND.colors.accent }}
                >
                  <Instagram className="w-5 h-5" />
                </a>
              )}
              {BRAND.social.linkedin && !contacts?.telegram && !contacts?.facebook && !contacts?.instagram && (
                <a
                  href={BRAND.social.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-9 h-9 rounded-lg flex items-center justify-center transition-colors"
                  style={{ backgroundColor: BRAND.colors.accent }}
                >
                  <Linkedin className="w-5 h-5" />
                </a>
              )}
            </div>
          </div>
        </div>

        <div className="border-t border-white/20 pt-6 text-center text-white/90 text-sm">
          <p>&copy; {new Date().getFullYear()} {BRAND.name}. {t('footer.rights')}</p>
        </div>
      </div>
    </footer>
  );
}
