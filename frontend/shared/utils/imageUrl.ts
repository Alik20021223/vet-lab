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
  
  // Проверяем, работаем ли мы в браузере
  if (typeof window === 'undefined') {
    // SSR или тестирование - возвращаем как есть
    return url;
  }
  
  // Определяем текущий origin
  const currentOrigin = window.location.origin;
  const isProduction = currentOrigin.includes('vetlab.tj') || currentOrigin.includes('www.vetlab.tj');
  const isLocalhost = currentOrigin.includes('localhost') || currentOrigin.includes('127.0.0.1');
  
  // На production сайте всегда используем относительные пути для статических файлов
  // Это гарантирует, что изображения будут загружаться с того же домена
  if (isProduction && url.startsWith('/static/')) {
    return url;
  }
  
  // Получаем базовый URL из переменных окружения Vite
  let baseUrl = import.meta.env.VITE_PUBLIC_URL || import.meta.env.VITE_API_URL?.replace('/api', '') || '';
  
  // Если baseUrl содержит localhost/local/127.0.0.1, а мы на production - игнорируем его
  if (baseUrl && isProduction) {
    const baseUrlIsLocalhost = baseUrl.includes('localhost') || 
                               baseUrl.includes('127.0.0.1') || 
                               baseUrl.includes('local');
    if (baseUrlIsLocalhost) {
      // На production используем относительные пути вместо localhost
      return url;
    }
  }
  
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
