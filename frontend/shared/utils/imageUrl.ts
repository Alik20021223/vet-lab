/**
 * Добавляет базовый URL к относительным путям изображений
 * Если URL уже абсолютный (начинается с http:// или https://), возвращает как есть
 * Если это относительный путь, добавляет базовый URL из переменных окружения
 * 
 * @param {string|null|undefined} url - URL изображения (может быть относительным или абсолютным)
 * @returns {string} - Полный URL или относительный путь
 */
export function resolveImageUrl(url: string | null | undefined): string {
  if (!url) return '';
  
  // Если URL уже абсолютный, возвращаем как есть
  if (url.startsWith('http://') || url.startsWith('https://') || url.startsWith('data:')) {
    return url;
  }
  
  // Получаем базовый URL из переменных окружения Vite
  const baseUrl = import.meta.env.VITE_PUBLIC_URL || import.meta.env.VITE_API_URL?.replace('/api', '') || '';
  
  // Если базовый URL не задан, возвращаем относительный путь
  if (!baseUrl) {
    return url;
  }
  
  // Убираем слэш в конце baseUrl, если есть
  const cleanBaseUrl = baseUrl.endsWith('/') ? baseUrl.slice(0, -1) : baseUrl;
  
  // Убираем слэш в начале url, если есть
  const imagePath = url.startsWith('/') ? url : `/${url}`;
  
  return `${cleanBaseUrl}${imagePath}`;
}
