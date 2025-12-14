/**
 * Добавляет PUBLIC_URL к относительным путям изображений
 * Если URL уже абсолютный (начинается с http:// или https://), возвращает как есть
 * Если PUBLIC_URL не задан, возвращает относительный путь
 * 
 * @param {string|null|undefined} url - URL изображения (может быть относительным или абсолютным)
 * @returns {string} - Полный URL или относительный путь
 */
export function resolveImageUrl(url) {
  if (!url) return '';
  
  // Если URL уже абсолютный, возвращаем как есть
  if (url.startsWith('http://') || url.startsWith('https://')) {
    return url;
  }
  
  // Получаем PUBLIC_URL из переменных окружения
  const publicUrl = process.env.PUBLIC_URL || '';
  
  // Если PUBLIC_URL не задан, возвращаем относительный путь
  if (!publicUrl) {
    return url;
  }
  
  // Убираем слэш в конце PUBLIC_URL, если есть
  const baseUrl = publicUrl.endsWith('/') ? publicUrl.slice(0, -1) : publicUrl;
  
  // Убираем слэш в начале url, если есть
  const imagePath = url.startsWith('/') ? url : `/${url}`;
  
  return `${baseUrl}${imagePath}`;
}

/**
 * Обрабатывает объект, рекурсивно заменяя все строковые значения,
 * которые выглядят как пути к изображениям (/static/...)
 * 
 * @param {any} data - Данные для обработки (объект, массив, примитив)
 * @returns {any} - Обработанные данные
 */
export function resolveImageUrlsInData(data) {
  if (!data) return data;
  
  if (typeof data === 'string') {
    // Если строка похожа на путь к изображению, обрабатываем её
    if (data.startsWith('/static/') || data.startsWith('/static/originals/')) {
      return resolveImageUrl(data);
    }
    return data;
  }
  
  if (Array.isArray(data)) {
    return data.map(item => resolveImageUrlsInData(item));
  }
  
  if (typeof data === 'object') {
    const result = {};
    for (const [key, value] of Object.entries(data)) {
      // Обрабатываем поля, которые обычно содержат изображения
      if (['image', 'images', 'photo', 'photos', 'logo', 'coverImage', 'originalUrl', 'icon'].includes(key)) {
        result[key] = resolveImageUrl(value);
      } else {
        result[key] = resolveImageUrlsInData(value);
      }
    }
    return result;
  }
  
  return data;
}
