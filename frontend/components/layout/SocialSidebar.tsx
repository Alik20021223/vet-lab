import { Facebook, Instagram, Send } from 'lucide-react';
import { useContacts } from '../../shared/hooks/useContacts';

export function SocialSidebar() {
  const { contacts } = useContacts();
  
  // Используем только ссылки из базы данных, без fallback
  const telegramUrl = contacts?.telegram?.trim() || null;
  const facebookUrl = contacts?.facebook?.trim() || null;
  const instagramUrl = contacts?.instagram?.trim() || null;

  // Не показываем компонент, если нет ни одной ссылки
  if (!telegramUrl && !facebookUrl && !instagramUrl) {
    return null;
  }

  return (
    <div className="fixed right-0 top-1/2 -translate-y-1/2 z-40 hidden md:flex flex-col pr-0.5">
      {telegramUrl && (
        <a
          href={telegramUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="w-12 h-12 rounded-l-2xl bg-[#0088cc] hover:bg-[#006699] transition-all duration-300 flex items-center justify-center text-white shadow-lg hover:shadow-xl hover:scale-110 group"
          aria-label="Telegram"
        >
          <Send className="w-5 h-5 group-hover:scale-110 transition-transform" />
        </a>
      )}
      {facebookUrl && (
        <a
          href={facebookUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="w-12 h-12 rounded-l-2xl bg-[#1877F2] hover:bg-[#1565C0] transition-all duration-300 flex items-center justify-center text-white shadow-lg hover:shadow-xl hover:scale-110 group"
          aria-label="Facebook"
        >
          <Facebook className="w-5 h-5 group-hover:scale-110 transition-transform" />
        </a>
      )}
      {instagramUrl && (
        <a
          href={instagramUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="w-12 h-12 rounded-l-2xl bg-gradient-to-br from-[#E4405F] to-[#C13584] hover:from-[#D32F5F] hover:to-[#A0286F] transition-all duration-300 flex items-center justify-center text-white shadow-lg hover:shadow-xl hover:scale-110 group"
          aria-label="Instagram"
        >
          <Instagram className="w-5 h-5 group-hover:scale-110 transition-transform" />
        </a>
      )}
    </div>
  );
}
