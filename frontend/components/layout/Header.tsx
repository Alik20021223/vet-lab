import { useState, useMemo, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ChevronDown, Menu, X } from 'lucide-react';
import { Button } from '../ui/button';
import { NAVIGATION } from '../../shared/constants/navigation';
import { BRAND } from '../../shared/constants/brand';
import { useLanguage } from '../../shared/contexts/LanguageContext';
import { LanguageSwitcher } from '../LanguageSwitcher';
import { useServices } from '../../shared/hooks/useServices';
import { getLocalizedField } from '../../shared/utils/localization';
import logo from '../../assets/vetLab-logo.png';

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const { t, language } = useLanguage();
  const { services } = useServices();

  // Блокировка скролла body когда мобильное меню открыто
  useEffect(() => {
    if (mobileMenuOpen) {
      // Сохраняем текущую позицию скролла
      const scrollY = window.scrollY;
      document.body.style.position = 'fixed';
      document.body.style.top = `-${scrollY}px`;
      document.body.style.width = '100%';
      document.body.style.overflow = 'hidden';
    } else {
      // Восстанавливаем скролл
      const scrollY = document.body.style.top;
      document.body.style.position = '';
      document.body.style.top = '';
      document.body.style.width = '';
      document.body.style.overflow = '';
      if (scrollY) {
        window.scrollTo(0, parseInt(scrollY || '0') * -1);
      }
    }

    return () => {
      // Cleanup при размонтировании
      document.body.style.position = '';
      document.body.style.top = '';
      document.body.style.width = '';
      document.body.style.overflow = '';
    };
  }, [mobileMenuOpen]);

  // Создаем динамическую навигацию с услугами из API
  const navigationWithServices = useMemo(() => {
    return NAVIGATION.map((item) => {
      if (item.labelKey === 'nav.services' && services && services.length > 0) {
        return {
          ...item,
          children: services.map((service) => ({
            labelKey: getLocalizedField(service, 'title', language) as any, // Локализованное название услуги
            href: `/services/${service.id}`,
          })),
        };
      }
      return item;
    });
  }, [services, language]);

  const handleLinkClick = () => {
    setOpenDropdown(null);
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white shadow-sm border-b border-gray-200">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16 lg:h-20">
          <Link to="/" className="flex items-center gap-2">
            <img src={logo} alt="VET-LAB Logo" className="h-12 lg:h-16 w-auto" />
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-6">
            {navigationWithServices.map((item) => {
              const itemLabel = item.labelKey.startsWith('nav.') ? t(item.labelKey) : item.labelKey;
              return (
                <div
                  key={item.href}
                  className="relative group"
                  onMouseEnter={() => item.children && item.children.length > 0 && setOpenDropdown(itemLabel)}
                  onMouseLeave={() => setOpenDropdown(null)}
                >
                  <Link
                    to={item.href}
                    onClick={handleLinkClick}
                    className="flex items-center gap-1 px-3 py-2 rounded-lg transition-colors hover:bg-gray-100 text-gray-900 group-hover:bg-gray-100"
                  >
                    {itemLabel}
                    {item.children && item.children.length > 0 && <ChevronDown className="w-4 h-4" />}
                  </Link>

                  {item.children && item.children.length > 0 && (
                    <div className={`absolute top-full left-0 pt-1 transition-all duration-200 pointer-events-none group-hover:pointer-events-auto ${
                      openDropdown === itemLabel ? 'opacity-100 visible' : 'opacity-0 invisible'
                    }`}>
                      <div className="bg-white rounded-lg shadow-lg py-2 min-w-[250px] border border-gray-100">
                        {item.children.map((child) => {
                          const childLabel = child.labelKey.startsWith('nav.') ? t(child.labelKey) : child.labelKey;
                          return (
                            <Link
                              key={child.href}
                              to={child.href}
                              onClick={handleLinkClick}
                              className="block px-4 py-2 hover:bg-gray-50 transition-colors text-gray-900"
                            >
                              {childLabel}
                            </Link>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </nav>

          {/* Desktop Actions */}
          <div className="hidden lg:flex items-center gap-4">
            <LanguageSwitcher />
            <Button style={{ backgroundColor: BRAND.colors.accent }} className="text-white hover:opacity-90" asChild>
              <Link to="/contacts">{t('header.contact')}</Link>
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex lg:hidden items-center gap-3">
            <LanguageSwitcher />
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 hover:bg-gray-100 rounded-lg text-gray-900"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-t border-gray-100 overflow-y-auto max-h-[calc(100vh-4rem)] overscroll-contain">
            <div className="py-4">
              <nav className="flex flex-col gap-2">
                {navigationWithServices.map((item) => {
                  const itemLabel = item.labelKey.startsWith('nav.') ? t(item.labelKey) : item.labelKey;
                  return (
                    <div key={item.href}>
                      <Link
                        to={item.href}
                        className="block px-4 py-2 rounded-lg hover:bg-gray-100 transition-colors text-gray-900"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        {itemLabel}
                      </Link>
                      {item.children && item.children.length > 0 && (
                        <div className="ml-4 mt-1 flex flex-col gap-1">
                          {item.children.map((child) => {
                            const childLabel = child.labelKey.startsWith('nav.') ? t(child.labelKey) : child.labelKey;
                            return (
                              <Link
                                key={child.href}
                                to={child.href}
                                className="block px-4 py-2 text-sm text-gray-600 hover:bg-gray-50 rounded-lg transition-colors"
                                onClick={() => setMobileMenuOpen(false)}
                              >
                                {childLabel}
                              </Link>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  );
                })}
              </nav>
              <div className="mt-4 pt-4 border-t border-gray-100 flex flex-col gap-2">
                <Button
                  style={{ backgroundColor: BRAND.colors.accent }}
                  className="w-full text-white hover:opacity-90"
                  asChild
                >
                  <Link to="/contacts" onClick={() => setMobileMenuOpen(false)}>
                    {t('header.contact')}
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
