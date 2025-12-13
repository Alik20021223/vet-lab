import { Language } from '../contexts/LanguageContext';

/**
 * Выбирает локализованное значение поля в зависимости от текущего языка
 * @param data - объект с данными
 * @param field - базовое название поля (например, 'title')
 * @param language - текущий язык ('ru' или 'en')
 * @returns локализованное значение или значение по умолчанию
 */
export function getLocalizedField<T extends Record<string, any>>(
  data: T,
  field: keyof T,
  language: Language
): any {
  if (language === 'en') {
    const enField = `${String(field)}En` as keyof T;
    // Возвращаем английское значение если оно существует и не пустое, иначе русское
    return data[enField] || data[field];
  }
  return data[field];
}

/**
 * Возвращает локализованный объект с нужными полями
 */
export function getLocalizedData<T extends Record<string, any>>(
  data: T,
  fields: Array<keyof T>,
  language: Language
): Record<string, any> {
  const result: Record<string, any> = {};
  
  fields.forEach(field => {
    result[field as string] = getLocalizedField(data, field, language);
  });
  
  return result;
}
