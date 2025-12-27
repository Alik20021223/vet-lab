import { useEffect, useRef } from 'react';

interface RichTextContentProps {
  content: string;
  className?: string;
}

export function RichTextContent({ content, className = '' }: RichTextContentProps) {
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (contentRef.current) {
      // Принудительно устанавливаем черный цвет и системный шрифт для всех элементов
      const allElements = contentRef.current.querySelectorAll('*');
      allElements.forEach((el) => {
        const htmlEl = el as HTMLElement;
        
        // Принудительно удаляем любые inline font-family стили
        htmlEl.style.fontFamily = 'inherit';
        
        const computedColor = window.getComputedStyle(htmlEl).color;
        // Если цвет белый или очень светлый, заменяем на черный
        if (computedColor === 'rgb(255, 255, 255)' || 
            computedColor === 'rgb(255, 255, 254)' ||
            computedColor === 'rgba(255, 255, 255, 1)' ||
            computedColor === 'rgba(255, 255, 255, 0)') {
          htmlEl.style.color = 'black';
        }
        // Удаляем белый фон если есть
        const bgColor = window.getComputedStyle(htmlEl).backgroundColor;
        if (bgColor === 'rgb(255, 255, 255)' || bgColor === 'rgba(255, 255, 255, 1)') {
          htmlEl.style.backgroundColor = 'transparent';
        }
      });
    }
  }, [content]);

  // Проверяем, есть ли реальный контент (не только пробелы и теги)
  const hasContent = content && content.trim().replace(/<[^>]*>/g, '').trim().length > 0;

  if (!hasContent) {
    return null;
  }

  return (
    <div
      ref={contentRef}
      className={`rich-text-content text-black [&_*]:text-black [&_*]:!text-black [&_*]:font-[inherit] [&_*]:!font-[inherit] ${className}`}
      style={{ 
        color: 'black',
        fontFamily: 'inherit'
      }}
      dangerouslySetInnerHTML={{ __html: content }}
    />
  );
}
