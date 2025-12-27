import { useState, useMemo, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ChevronDown, Menu, X } from 'lucide-react';
import { Button } from '../ui/button';
import { NAVIGATION } from '../../shared/constants/navigation';
import { BRAND } from '../../shared/constants/brand';
import { useLanguage } from '../../shared/contexts/LanguageContext';
import { LanguageSwitcher } from '../LanguageSwitcher';
import { useServices } from '../../shared/hooks/useServices';
import { getLocalizedField } from '../../shared/utils/localization';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import logo from '../../assets/vetLab-logo.png';
import kurBackground from '../../assets/kur-background.jpg';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

interface HeaderProps {
  isTransparent?: boolean;
}

export function Header({ isTransparent = false }: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileMenuAnimating, setMobileMenuAnimating] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [mobileOpenDropdown, setMobileOpenDropdown] = useState<string | null>(null);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isTablet, setIsTablet] = useState(false);
  const { t, language } = useLanguage();
  const { services } = useServices();
  const location = useLocation();
  const headerRef = useRef<HTMLElement>(null);
  const logoRef = useRef<HTMLAnchorElement>(null);
  const navRef = useRef<HTMLElement>(null);

  // Отслеживание скролла для изменения стиля Header
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Проверяем начальное состояние

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  // Отслеживание размера экрана для планшетов (1024-1280px)
  useEffect(() => {
    const checkTablet = () => {
      setIsTablet(window.innerWidth >= 1024 && window.innerWidth < 1280);
    };

    checkTablet();
    window.addEventListener('resize', checkTablet);

    return () => {
      window.removeEventListener('resize', checkTablet);
    };
  }, []);

  // GSAP анимация появления Header
  useEffect(() => {
    if (headerRef.current && logoRef.current && navRef.current) {
      // Анимация логотипа
      gsap.fromTo(logoRef.current,
        { opacity: 0, scale: 0.8, y: -20 },
        { opacity: 1, scale: 1, y: 0, duration: 0.6, ease: 'back.out(1.7)', delay: 0.2 }
      );

      // Анимация навигации
      const navItems = navRef.current.querySelectorAll('a, button');
      gsap.fromTo(navItems,
        { opacity: 0, y: -15 },
        { 
          opacity: 1, 
          y: 0, 
          duration: 0.5, 
          ease: 'power3.out', 
          stagger: 0.05,
          delay: 0.4
        }
      );
    }
  }, []);

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

  // Функция для проверки активной ссылки с учетом query-параметров и hash
  const isLinkActive = (href: string) => {
    const currentPath = location.pathname;
    const currentSearch = location.search;
    const currentHash = location.hash;
    
    // Разделяем href на pathname, search и hash
    const [hrefPath, hrefHash] = href.split('#');
    const [hrefPathname, hrefSearch] = hrefPath.split('?');
    
    // Если href содержит hash, проверяем точное совпадение pathname и hash
    if (hrefHash) {
      // Для hash-ссылок требуется точное совпадение pathname
      if (currentPath !== hrefPathname) {
        return false;
      }
      // Если hash указан в href, проверяем совпадение hash (hash должен точно совпадать)
      // Если текущий hash пустой, а в href есть hash - не активна
      if (hrefHash && !currentHash) {
        return false;
      }
      // Если hash указан в href, проверяем совпадение hash
      if (hrefHash && currentHash !== `#${hrefHash}`) {
        return false;
      }
      return true;
    }
    
    // Если href содержит query-параметры, сравниваем их
    if (hrefSearch) {
      const currentParams = new URLSearchParams(currentSearch);
      const hrefParams = new URLSearchParams(hrefSearch);
      
      // Проверяем, что pathname совпадает
      if (currentPath !== hrefPathname) {
        return false;
      }
      
      // Проверяем, что все параметры из href присутствуют в текущих параметрах
      for (const [key, value] of hrefParams.entries()) {
        if (currentParams.get(key) !== value) {
          return false;
        }
      }
      return true;
    }
    
    // Обычное сравнение pathname (без hash и query)
    // Для главной страницы требуется точное совпадение
    if (hrefPathname === '/') {
      return currentPath === '/';
    }
    
    return currentPath === hrefPathname || (hrefPathname !== '/' && currentPath.startsWith(hrefPathname));
  };

  // Функция для проверки, активна ли родительская ссылка (если активна любая дочерняя)
  const isParentLinkActive = (item: typeof navigationWithServices[0]) => {
    // Проверяем, активна ли сама родительская ссылка
    if (isLinkActive(item.href)) {
      return true;
    }
    
    // Проверяем, активна ли любая дочерняя ссылка
    if (item.children && item.children.length > 0) {
      return item.children.some(child => isLinkActive(child.href));
    }
    
    return false;
  };

  // Закрытие dropdown при клике вне его (для планшетов)
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      // Закрываем dropdown если клик был вне навигации и это планшет
      if (isTablet && openDropdown && !target.closest('nav')) {
        setOpenDropdown(null);
      }
    };

    if (openDropdown && isTablet) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [openDropdown, isTablet]);

  const handleLinkClick = () => {
    setOpenDropdown(null);
  };

  // Обработка открытия/закрытия мобильного меню с анимацией
  const handleMobileMenuToggle = () => {
    if (!mobileMenuOpen) {
      // Открываем меню
      setMobileMenuOpen(true);
      // Устанавливаем анимацию после монтирования элемента
      setTimeout(() => setMobileMenuAnimating(true), 10);
    } else {
      // Закрываем меню с анимацией
      setMobileMenuAnimating(false);
      setTimeout(() => {
        setMobileMenuOpen(false);
      }, 300); // Длительность анимации закрытия
    }
  };


  // Определяем, должен ли Header быть прозрачным (только если isTransparent и не проскроллен, но без учета меню)
  const shouldBeTransparent = isTransparent && !isScrolled;
  // Определяем фактическую прозрачность (не прозрачный, если меню открыто)
  const isHeaderTransparent = shouldBeTransparent && !mobileMenuOpen;
  // Определяем цвет текста (белый для прозрачного Header, черный для белого)
  const textColorClass = shouldBeTransparent ? 'text-white' : 'text-gray-900';
  
  // Определяем фон header - при скролле всегда белый
  const getHeaderBgClass = () => {
    if (isScrolled) {
      // При скролле всегда белый фон
      return 'bg-white shadow-sm border-b border-gray-200';
    }
    // Без скролла: прозрачный если нужно, иначе белый
    return shouldBeTransparent
      ? 'bg-transparent shadow-none border-none' 
      : 'bg-white shadow-sm border-b border-gray-200';
  };

  return (
    <>
      <header 
        ref={headerRef}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${getHeaderBgClass()}`}
      >
        {/* Dark overlay для мобильного header */}
        {mobileMenuOpen && mobileMenuAnimating && (
          <div className="lg:hidden absolute inset-0 bg-black/60 pointer-events-none transition-opacity duration-300" />
        )}
        
        {/* Контент header */}
        <div className="relative z-10">
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-between h-16 lg:h-20">
          <Link ref={logoRef} to="/" className="flex items-center gap-2">
            <img src={logo} alt="VET-LAB Logo" className="h-12 lg:h-16 w-auto" />
          </Link>

          {/* Desktop Navigation */}
          <nav ref={navRef} className="hidden lg:flex items-center gap-6">
            {navigationWithServices.map((item) => {
              const itemLabel = item.labelKey.startsWith('nav.') ? t(item.labelKey) : item.labelKey;
              const isParentActive = isParentLinkActive(item);
              return (
                <div
                  key={item.href}
                  className="relative group"
                  onMouseEnter={() => {
                    // На больших экранах открываем по hover
                    if (!isTablet && item.children && item.children.length > 0) {
                      setOpenDropdown(itemLabel);
                    }
                  }}
                  onMouseLeave={() => {
                    // Закрываем при уходе мыши
                    setOpenDropdown(null);
                  }}
                >
                  <Link
                    to={item.href}
                    onClick={(e) => {
                      // При клике открываем/закрываем dropdown
                      if (item.children && item.children.length > 0) {
                        e.preventDefault();
                        setOpenDropdown(openDropdown === itemLabel ? null : itemLabel);
                      } else {
                        handleLinkClick();
                      }
                    }}
                    className={`relative flex items-center gap-1 px-3 py-2 ${textColorClass} transition-all duration-200 hover:scale-105 group/nav-link`}
                  >
                    <span className="relative z-10">{itemLabel}</span>
                    {item.children && item.children.length > 0 && (
                      <ChevronDown className={`relative z-10 w-4 h-4 transition-transform duration-300 ${
                        openDropdown === itemLabel ? 'rotate-180' : 'rotate-0'
                      }`} />
                    )}
                    {/* Анимация полоски снизу - растет от центра к краям */}
                    {/* Показываем полоску для активной ссылки или при hover */}
                    <span 
                      className={`absolute bottom-0 left-1/2 h-0.5 bg-[#00AADC] transition-all duration-300 ease-out transform -translate-x-1/2 ${
                        isParentActive ? 'w-4/5' : 'w-0 group-hover/nav-link:w-4/5'
                      }`}
                      style={{
                        transformOrigin: 'center',
                      }}
                    />
                  </Link>

                  {item.children && item.children.length > 0 && (
                    <div 
                      className={`absolute top-full left-0 pt-1 transition-all duration-300 ease-out ${
                        // На больших экранах используем hover, на планшетах - клик
                        !isTablet
                          ? 'pointer-events-none group-hover:pointer-events-auto' 
                          : openDropdown === itemLabel 
                            ? 'pointer-events-auto' 
                            : 'pointer-events-none'
                      } ${
                        openDropdown === itemLabel ? 'opacity-100 visible translate-y-0' : 'opacity-0 invisible -translate-y-2'
                      }`}
                      onMouseEnter={() => {
                        // При входе мыши в dropdown на больших экранах - открываем
                        if (!isTablet && item.children && item.children.length > 0) {
                          setOpenDropdown(itemLabel);
                        }
                      }}
                      onMouseLeave={() => {
                        // Закрываем dropdown при уходе мыши
                        setOpenDropdown(null);
                      }}
                    >
                      <div className="bg-white rounded-lg shadow-lg py-2 min-w-[250px] border border-gray-100">
                        {item.children.map((child, index) => {
                          const childLabel = child.labelKey.startsWith('nav.') ? t(child.labelKey) : child.labelKey;
                          const isActive = isLinkActive(child.href);
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
                                className={`absolute bottom-0 left-1/2 h-0.5 bg-[#00AADC] transition-all duration-300 ease-out transform -translate-x-1/2 ${
                                  isActive ? 'w-7/8' : 'w-0 group-hover/dropdown-item:w-7/8'
                                }`}
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
            <LanguageSwitcher isTransparent={isHeaderTransparent} />
            <Button style={{ backgroundColor: BRAND.colors.accent }} className="text-white hover:opacity-90" asChild>
              <Link to="/contacts">{t('header.contact')}</Link>
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex lg:hidden items-center gap-3">
            <LanguageSwitcher isTransparent={shouldBeTransparent} />
            <button
              onClick={handleMobileMenuToggle}
              className={`p-2 rounded-lg transition-colors relative w-10 h-10 flex items-center justify-center ${
                shouldBeTransparent 
                  ? 'hover:bg-white/20 text-white' 
                  : 'hover:bg-gray-100 text-gray-900'
              }`}
              aria-label="Toggle menu"
            >
              <span className="sr-only">Toggle menu</span>
              {/* Hamburger icon with animation */}
              <Menu 
                className={`w-6 h-6 absolute transition-all duration-300 ${
                  mobileMenuAnimating ? 'opacity-0 rotate-90 scale-0' : 'opacity-100 rotate-0 scale-100'
                }`} 
              />
              {/* Close icon with animation */}
              <X 
                className={`w-6 h-6 absolute transition-all duration-300 ${
                  mobileMenuAnimating ? 'opacity-100 rotate-0 scale-100' : 'opacity-0 -rotate-90 scale-0'
                }`} 
              />
            </button>
          </div>
            </div>
          </div>
        </div>
      </header>

      {/* Full Screen Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div 
          className={`lg:hidden fixed inset-0 z-60 transition-opacity duration-300 ${
            mobileMenuAnimating ? 'opacity-100' : 'opacity-0'
          }`}
          style={{
            backgroundImage: `url(${kurBackground})`,
            backgroundSize: 'cover',
            backgroundPosition: '80%',
            backgroundRepeat: 'no-repeat',
          }}
          onClick={handleMobileMenuToggle}
        >
          {/* Dark overlay with blur */}
          <div 
            className={`absolute inset-0 bg-black/70 backdrop-blur-xs transition-opacity duration-300 ${
              mobileMenuAnimating ? 'opacity-100' : 'opacity-0'
            }`}
          />
          <div 
            className={`relative h-full w-full flex flex-col overflow-y-auto z-10 transition-transform duration-300 ease-out ${
              mobileMenuAnimating 
                ? 'translate-y-0 opacity-100' 
                : 'translate-y-8 opacity-0'
            }`}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header with Logo and Close Button */}
            <div 
              className={`flex items-center justify-between px-4 py-6 transition-all duration-300 ease-out ${
                mobileMenuAnimating 
                  ? 'translate-y-0 opacity-100' 
                  : '-translate-y-4 opacity-0'
              }`}
            >
              <Link to="/" className="flex items-center gap-2" onClick={handleMobileMenuToggle}>
                <img src={logo} alt="VET-LAB Logo" className="h-10 w-auto" />
              </Link>
              <button
                onClick={handleMobileMenuToggle}
                className="p-2 text-white hover:bg-white/20 rounded-lg transition-colors"
                aria-label="Close menu"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Navigation Links */}
            <nav className="flex-1 flex flex-col px-4 py-8 gap-1">
              {navigationWithServices.map((item, index) => {
                const itemLabel = item.labelKey.startsWith('nav.') ? t(item.labelKey) : item.labelKey;
                const hasChildren = item.children && item.children.length > 0;
                const isOpen = mobileOpenDropdown === itemLabel;
                
                return (
                  <div 
                    key={item.href}
                    className={`transition-all duration-300 ease-out ${
                      mobileMenuAnimating 
                        ? 'translate-x-0 opacity-100' 
                        : 'translate-x-8 opacity-0'
                    }`}
                    style={{
                      transitionDelay: mobileMenuAnimating ? `${index * 30 + 50}ms` : `${index * 20}ms`,
                    }}
                  >
                    {hasChildren ? (
                      <button
                        onClick={() => setMobileOpenDropdown(isOpen ? null : itemLabel)}
                        className="w-full flex items-center justify-between px-4 py-4 text-white font-bold text-lg uppercase hover:bg-white/10 rounded-lg transition-colors"
                      >
                        <span>{itemLabel}</span>
                        <ChevronDown 
                          className={`w-5 h-5 transition-transform duration-300 ${
                            isOpen ? 'rotate-180' : 'rotate-0'
                          }`}
                          style={{ color: BRAND.colors.accent }}
                        />
                      </button>
                    ) : (
                      <Link
                        to={item.href}
                        className="block px-4 py-4 text-white font-bold text-lg uppercase hover:bg-white/10 rounded-lg transition-colors"
                        onClick={handleMobileMenuToggle}
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
                            // Определяем активную ссылку с учетом query-параметров
                            const isActive = isLinkActive(child.href);
                            return (
                              <Link
                                key={child.href}
                                to={child.href}
                                className="relative block px-4 py-3 text-white/90 text-base hover:bg-white/10 rounded-lg transition-all hover:translate-x-1 group/mobile-dropdown-item"
                                onClick={() => {
                                  handleMobileMenuToggle();
                                  setMobileOpenDropdown(null);
                                }}
                                style={{
                                  animationDelay: isOpen ? `${index * 50}ms` : '0ms',
                                }}
                              >
                                <span className="relative z-10">{childLabel}</span>
                                {/* Анимация полоски снизу для мобильных dropdown элементов при hover */}
                                <span 
                                  className={`absolute bottom-0 left-1/2 h-0.5 bg-[#00AADC] transition-all duration-300 ease-out transform -translate-x-1/2 ${
                                    isActive ? 'w-4/5' : 'w-0 group-hover/mobile-dropdown-item:w-4/5'
                                  }`}
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

            {/* Footer with Language Switcher and Contact Button */}
            <div 
              className={`px-4 py-6 space-y-4 border-t border-white/20 transition-all duration-300 ease-out ${
                mobileMenuAnimating 
                  ? 'translate-y-0 opacity-100' 
                  : 'translate-y-4 opacity-0'
              }`}
              style={{
                transitionDelay: mobileMenuAnimating ? `${navigationWithServices.length * 30 + 150}ms` : '0ms',
              }}
            >
              <div className="flex justify-center">
                <LanguageSwitcher isTransparent={true} />
              </div>
              <Button
                style={{ backgroundColor: BRAND.colors.accent }}
                className="w-full text-white hover:opacity-90 py-6 text-lg font-semibold rounded-lg"
                asChild
              >
                <Link to="/contacts" onClick={handleMobileMenuToggle}>
                  {t('header.contact')}
                </Link>
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
