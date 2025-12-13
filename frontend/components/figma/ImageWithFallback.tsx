import React, { useState, useMemo } from 'react'

const ERROR_IMG_SRC =
  'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODgiIGhlaWdodD0iODgiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgc3Ryb2tlPSIjMDAwIiBzdHJva2UtbGluZWpvaW49InJvdW5kIiBvcGFjaXR5PSIuMyIgZmlsbD0ibm9uZSIgc3Ryb2tlLXdpZHRoPSIzLjciPjxyZWN0IHg9IjE2IiB5PSIxNiIgd2lkdGg9IjU2IiBoZWlnaHQ9IjU2IiByeD0iNiIvPjxwYXRoIGQ9Im0xNiA1OCAxNi0xOCAzMiAzMiIvPjxjaXJjbGUgY3g9IjUzIiBjeT0iMzUiIHI9IjciLz48L3N2Zz4KCg=='

export function ImageWithFallback(props: React.ImgHTMLAttributes<HTMLImageElement>) {
  const [didError, setDidError] = useState(false)

  const handleError = () => {
    setDidError(true)
  }

  const { src, alt, style, className, ...rest } = props

  // Если URL относительный (начинается с /), добавляем базовый URL
  const imageSrc = useMemo(() => {
    if (!src) return src;
    
    // Если уже полный URL (начинается с http:// или https://), возвращаем как есть
    if (typeof src === 'string' && (src.startsWith('http://') || src.startsWith('https://'))) {
      return src;
    }
    
    // Если относительный путь (начинается с /), добавляем базовый URL
    if (typeof src === 'string' && src.startsWith('/')) {
      const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000/api';
      // Убираем /api из конца, если есть
      const baseUrl = API_BASE_URL.replace(/\/api$/, '');
      return `${baseUrl}${src}`;
    }
    
    return src;
  }, [src]);

  return didError ? (
    <div
      className={`inline-block bg-gray-100 text-center align-middle ${className ?? ''}`}
      style={style}
    >
      <div className="flex items-center justify-center w-full h-full">
        <img src={ERROR_IMG_SRC} alt="Error loading image" {...rest} data-original-url={src} />
      </div>
    </div>
  ) : (
    <img src={imageSrc} alt={alt} className={className} style={style} {...rest} onError={handleError} />
  )
}
