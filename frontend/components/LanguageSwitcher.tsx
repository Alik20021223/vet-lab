import { useLanguage } from '../shared/contexts/LanguageContext';
import { BRAND } from '../shared/constants/brand';

interface LanguageSwitcherProps {
  isTransparent?: boolean;
}

export function LanguageSwitcher({ isTransparent = false }: LanguageSwitcherProps) {
  const { language, setLanguage } = useLanguage();

  const containerClass = isTransparent 
    ? 'flex items-center gap-1 bg-white/20 backdrop-blur-sm rounded-lg p-1 shadow-sm'
    : 'flex items-center gap-1 bg-gray-100/90 backdrop-blur-sm rounded-lg p-1 shadow-sm';

  const inactiveButtonClass = isTransparent
    ? 'text-white hover:bg-white/30'
    : 'text-gray-700 hover:bg-gray-200';

  return (
    <div className={containerClass}>
      <button
        onClick={() => setLanguage('ru')}
        className={`px-3 py-1.5 text-sm rounded-md transition-all ${
          language === 'ru'
            ? 'text-white shadow-sm'
            : inactiveButtonClass
        }`}
        style={language === 'ru' ? { backgroundColor: BRAND.colors.primary } : undefined}
      >
        RU
      </button>
      <button
        onClick={() => setLanguage('en')}
        className={`px-3 py-1.5 text-sm rounded-md transition-all ${
          language === 'en'
            ? 'text-white shadow-sm'
            : inactiveButtonClass
        }`}
        style={language === 'en' ? { backgroundColor: BRAND.colors.primary } : undefined}
      >
        EN
      </button>
    </div>
  );
}
