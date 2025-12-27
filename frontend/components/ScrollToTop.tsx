import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

export function ScrollToTop() {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    // Если есть hash (якорная ссылка), прокручиваем к элементу
    if (hash) {
      const element = document.querySelector(hash);
      if (element) {
        // Небольшая задержка для рендеринга контента
        setTimeout(() => {
          element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 100);
      }
    } else {
      // Если нет hash, прокручиваем вверх
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [pathname, hash]);

  return null;
}
