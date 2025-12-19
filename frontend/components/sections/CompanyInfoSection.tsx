import { useEffect, useRef } from 'react';
import { useLanguage } from '../../shared/contexts/LanguageContext';
import { BRAND } from '../../shared/constants/brand';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

export function CompanyInfoSection() {
  const { t } = useLanguage();
  const sectionRef = useRef<HTMLElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const textRef = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    if (sectionRef.current && titleRef.current && textRef.current) {
      // Устанавливаем начальное состояние
      gsap.set([titleRef.current, textRef.current], {
        opacity: 0,
        y: 50,
      });

      // Создаем timeline для последовательной анимации
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 80%',
          end: 'bottom 20%',
          toggleActions: 'play none none none',
          once: true,
        },
      });

      tl.to(titleRef.current, {
        opacity: 1,
        y: 0,
        duration: 0.8,
        ease: 'power3.out',
      })
      .to(textRef.current, {
        opacity: 1,
        y: 0,
        duration: 0.8,
        ease: 'power3.out',
      }, '-=0.4');
    }

    return () => {
      ScrollTrigger.getAll().forEach((trigger) => {
        if (trigger.vars.trigger === sectionRef.current) {
          trigger.kill();
        }
      });
    };
  }, []);

  return (
    <section ref={sectionRef} className="py-12 md:py-16 lg:py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 
            ref={titleRef}
            className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6 md:mb-8"
            style={{ color: BRAND.colors.primary }}
          >
            {BRAND.name}
          </h2>
          <p ref={textRef} className="text-lg md:text-xl lg:text-2xl text-gray-700 leading-relaxed">
            {t('companyInfo.description')}
          </p>
        </div>
      </div>
    </section>
  );
}
