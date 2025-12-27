import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Регистрируем плагин ScrollTrigger
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

interface ScrollAnimationOptions {
  trigger?: string | Element | null;
  start?: string;
  end?: string;
  toggleActions?: string;
  once?: boolean;
  delay?: number;
  duration?: number;
  ease?: string;
  y?: number;
  x?: number;
  opacity?: number;
  scale?: number;
  rotation?: number;
  stagger?: number;
}

export function useScrollAnimation(
  options: ScrollAnimationOptions = {}
) {
  const elementRef = useRef<HTMLElement | null>(null);
  const animationRef = useRef<gsap.core.Tween | null>(null);

  const {
    trigger,
    start = 'top 80%',
    end = 'bottom 20%',
    toggleActions = 'play none none none',
    once = true,
    delay = 0,
    duration = 1,
    ease = 'power3.out',
    y = 50,
    x = 0,
    opacity = 0,
    scale = 1,
    rotation = 0,
    stagger = 0,
  } = options;

  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    // Устанавливаем начальное состояние
    gsap.set(element, {
      opacity: opacity,
      y: y,
      x: x,
      scale: scale,
      rotation: rotation,
    });

    // Создаем анимацию
    const animation = gsap.to(element, {
      opacity: 1,
      y: 0,
      x: 0,
      scale: 1,
      rotation: 0,
      duration: duration,
      delay: delay,
      ease: ease,
      scrollTrigger: {
        trigger: trigger || element,
        start: start,
        end: end,
        toggleActions: toggleActions,
        once: once,
        markers: false, // Установите true для отладки
      },
    });

    animationRef.current = animation;

    return () => {
      animation.kill();
      ScrollTrigger.getAll().forEach((trigger) => {
        if (trigger.vars.trigger === (trigger || element)) {
          trigger.kill();
        }
      });
    };
  }, [trigger, start, end, toggleActions, once, delay, duration, ease, y, x, opacity, scale, rotation]);

  return elementRef;
}

// Хук для анимации нескольких элементов с задержкой (stagger)
export function useStaggerScrollAnimation(
  selector: string,
  options: ScrollAnimationOptions = {}
) {
  const containerRef = useRef<HTMLElement | null>(null);
  const animationRef = useRef<gsap.core.Timeline | null>(null);

  const {
    trigger,
    start = 'top 80%',
    end = 'bottom 20%',
    toggleActions = 'play none none none',
    once = true,
    delay = 0,
    duration = 0.8,
    ease = 'power3.out',
    y = 50,
    x = 0,
    opacity = 0,
    scale = 1,
    stagger = 0.1,
  } = options;

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const elements = container.querySelectorAll(selector);
    if (elements.length === 0) return;

    // Устанавливаем начальное состояние для всех элементов
    gsap.set(elements, {
      opacity: opacity,
      y: y,
      x: x,
      scale: scale,
    });

    // Создаем анимацию с stagger эффектом
    const timeline = gsap.timeline({
      scrollTrigger: {
        trigger: trigger || container,
        start: start,
        end: end,
        toggleActions: toggleActions,
        once: once,
        markers: false,
      },
    });

    timeline.to(elements, {
      opacity: 1,
      y: 0,
      x: 0,
      scale: 1,
      duration: duration,
      delay: delay,
      ease: ease,
      stagger: stagger,
    });

    animationRef.current = timeline;

    return () => {
      timeline.kill();
      ScrollTrigger.getAll().forEach((trigger) => {
        if (trigger.vars.trigger === (trigger || container)) {
          trigger.kill();
        }
      });
    };
  }, [selector, trigger, start, end, toggleActions, once, delay, duration, ease, y, x, opacity, scale, stagger]);

  return containerRef;
}
