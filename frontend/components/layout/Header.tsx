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
  const [mobileOpenDropdown, setMobileOpenDropdown] = useState<string | null>(null);
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
        const serviceChildren = services.map((service) => ({
          labelKey: getLocalizedField(service, 'title', language) as any, // Локализованное название услуги
          href: `/services/${service.id}`,
        }));
        
        // Добавляем "Прайс-лист" как последний пункт
        serviceChildren.push({
          labelKey: (language === 'en' ? 'Price List' : 'Прайс-лист') as any,
          href: '/services#pricing',
        });
        
        return {
          ...item,
          children: serviceChildren,
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
                    className="relative flex items-center gap-1 px-3 py-2 text-gray-900 transition-all duration-200 hover:scale-105 group/nav-link"
                  >
                    <span className="relative z-10">{itemLabel}</span>
                    {item.children && item.children.length > 0 && (
                      <ChevronDown className={`relative z-10 w-4 h-4 transition-transform duration-300 ${
                        openDropdown === itemLabel ? 'rotate-180' : 'rotate-0'
                      }`} />
                    )}
                    {/* Анимация полоски снизу - растет от центра к краям */}
                    <span 
                      className="absolute bottom-0 left-1/2 h-0.5 bg-[#00AADC] transition-all duration-300 ease-out transform -translate-x-1/2 w-0 group-hover/nav-link:w-4/5"
                      style={{
                        transformOrigin: 'center',
                      }}
                    />
                  </Link>

                  {item.children && item.children.length > 0 && (
                    <div className={`absolute top-full left-0 pt-1 transition-all duration-300 ease-out pointer-events-none group-hover:pointer-events-auto ${
                      openDropdown === itemLabel ? 'opacity-100 visible translate-y-0' : 'opacity-0 invisible -translate-y-2'
                    }`}>
                      <div className="bg-white rounded-lg shadow-lg py-2 min-w-[250px] border border-gray-100">
                        {item.children.map((child, index) => {
                          const childLabel = child.labelKey.startsWith('nav.') ? t(child.labelKey) : child.labelKey;
                          return (
                            <Link
                              key={child.href}
                              to={child.href}
                              onClick={handleLinkClick}
                              className="relative block px-4 py-2  transition-all duration-200 text-gray-900 group/dropdown-item"
                              style={{
                                animationDelay: openDropdown === itemLabel ? `${index * 50}ms` : '0ms',
                              }}
                            >
                              <span className="relative z-10">{childLabel}</span>
                              {/* Анимация полоски снизу для dropdown элементов */}
                              <span 
                                className="absolute bottom-0 left-1/2 h-0.5 bg-[#00AADC] transition-all duration-300 ease-out transform -translate-x-1/2 w-0 group-hover/dropdown-item:w-7/8"
                                style={{
                                  transformOrigin: 'center',
                                }}
                              />
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
              className="p-2 hover:bg-gray-100 rounded-lg text-gray-900 transition-colors relative w-10 h-10 flex items-center justify-center"
              aria-label="Toggle menu"
            >
              <span className="sr-only">Toggle menu</span>
              {/* Hamburger icon with animation */}
              <Menu 
                className={`w-6 h-6 absolute transition-all duration-300 ${
                  mobileMenuOpen ? 'opacity-0 rotate-90 scale-0' : 'opacity-100 rotate-0 scale-100'
                }`} 
              />
              {/* Close icon with animation */}
              <X 
                className={`w-6 h-6 absolute transition-all duration-300 ${
                  mobileMenuOpen ? 'opacity-100 rotate-0 scale-100' : 'opacity-0 -rotate-90 scale-0'
                }`} 
              />
            </button>
          </div>
        </div>

        {/* Mobile Menu with animation */}
        <div 
          className={`lg:hidden border-t border-gray-100 overflow-hidden transition-all duration-300 ease-in-out ${
            mobileMenuOpen 
              ? 'max-h-[calc(100vh-4rem)] opacity-100' 
              : 'max-h-0 opacity-0'
          }`}
        >
          <div className={`py-4 transition-transform duration-300 ease-in-out overflow-y-auto max-h-[calc(100vh-4rem)] ${
            mobileMenuOpen ? 'translate-y-0' : '-translate-y-4'
          }`}>
              <nav className="flex flex-col gap-2">
                {navigationWithServices.map((item) => {
                  const itemLabel = item.labelKey.startsWith('nav.') ? t(item.labelKey) : item.labelKey;
                  const hasChildren = item.children && item.children.length > 0;
                  const isOpen = mobileOpenDropdown === itemLabel;
                  
                  return (
                    <div key={item.href}>
                      {hasChildren ? (
                        <button
                          onClick={() => setMobileOpenDropdown(isOpen ? null : itemLabel)}
                          className="w-full flex items-center justify-between px-4 py-2 rounded-lg hover:bg-gray-100 transition-colors text-gray-900"
                        >
                          <span>{itemLabel}</span>
                          <ChevronDown 
                            className={`w-4 h-4 transition-transform duration-300 ${
                              isOpen ? 'rotate-180' : 'rotate-0'
                            }`}
                          />
                        </button>
                      ) : (
                        <Link
                          to={item.href}
                          className="block px-4 py-2 rounded-lg hover:bg-gray-100 transition-colors text-gray-900"
                          onClick={() => setMobileMenuOpen(false)}
                        >
                          {itemLabel}
                        </Link>
                      )}
                      {hasChildren && (
                        <div 
                          className={`overflow-hidden transition-all duration-300 ease-in-out ${
                            isOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
                          }`}
                        >
                          <div className="ml-4 mt-1 flex flex-col gap-1 pb-2">
                            {item.children!.map((child, index) => {
                              const childLabel = child.labelKey.startsWith('nav.') ? t(child.labelKey) : child.labelKey;
                              return (
                                <Link
                                  key={child.href}
                                  to={child.href}
                                  className="block px-4 py-2 text-sm text-gray-600 hover:bg-gray-50 rounded-lg transition-all hover:translate-x-1"
                                  onClick={() => {
                                    setMobileMenuOpen(false);
                                    setMobileOpenDropdown(null);
                                  }}
                                  style={{
                                    animationDelay: isOpen ? `${index * 50}ms` : '0ms',
                                  }}
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
        </div>
    </header>
  )
}
