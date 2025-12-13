import { useLanguage } from '../shared/contexts/LanguageContext';
import { BRAND } from '../shared/constants/brand';

export function LanguageSwitcher() {
  const { language, setLanguage } = useLanguage();

  return (
    <div className="flex items-center gap-1 bg-gray-100 rounded-lg p-1">
      <button
        onClick={() => setLanguage('ru')}
        className={`px-3 py-1.5 text-sm rounded-md transition-all ${
          language === 'ru'
            ? 'text-white shadow-sm'
            : 'text-gray-700 hover:bg-gray-200'
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
            : 'text-gray-700 hover:bg-gray-200'
        }`}
        style={language === 'en' ? { backgroundColor: BRAND.colors.primary } : undefined}
      >
        EN
      </button>
    </div>
  );
}
