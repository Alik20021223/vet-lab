import { useEffect, useRef, useState } from 'react';

interface UseScrollAnimationOptions {
  threshold?: number;
  rootMargin?: string;
  triggerOnce?: boolean;
}

export function useScrollAnimation(options: UseScrollAnimationOptions = {}) {
  const {
    threshold = 0.1,
    rootMargin = '0px 0px -100px 0px',
    triggerOnce = true,
  } = options;

  const elementRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const observerRef = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    // Проверяем начальное состояние элемента при монтировании
    const checkInitialVisibility = () => {
      const rect = element.getBoundingClientRect();
      const windowHeight = window.innerHeight || document.documentElement.clientHeight;
      
      // Проверяем, виден ли элемент в viewport
      const isInViewport = rect.top < windowHeight && rect.bottom > 0;
      
      if (isInViewport) {
        // Проверяем, достаточно ли видна часть элемента (по threshold)
        const visibleHeight = Math.min(rect.bottom, windowHeight) - Math.max(rect.top, 0);
        const visibleRatio = rect.height > 0 ? visibleHeight / rect.height : 0;
        
        if (visibleRatio >= threshold) {
          setIsVisible(true);
          return true; // Элемент уже виден
        }
      }
      return false; // Элемент не виден или недостаточно виден
    };

    // Небольшая задержка для проверки начального состояния после рендера
    const timeoutId = setTimeout(() => {
      const alreadyVisible = checkInitialVisibility();
      
      // Если элемент уже виден и triggerOnce=true, не создаем observer
      if (alreadyVisible && triggerOnce) {
        return;
      }

      // Создаем observer для отслеживания появления элемента
      observerRef.current = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setIsVisible(true);
            if (triggerOnce && observerRef.current) {
              observerRef.current.unobserve(element);
            }
          } else if (!triggerOnce) {
            setIsVisible(false);
          }
        },
        {
          threshold,
          rootMargin,
        }
      );

      observerRef.current.observe(element);
    }, 100); // Небольшая задержка для корректной проверки

    return () => {
      clearTimeout(timeoutId);
      if (observerRef.current) {
        observerRef.current.disconnect();
        observerRef.current = null;
      }
    };
  }, [threshold, rootMargin, triggerOnce]);

  return { elementRef, isVisible };
}
