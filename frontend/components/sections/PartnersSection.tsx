import { useEffect, useRef } from 'react';
import { usePartners } from '../../shared/hooks/usePartners';
import { ImageWithFallback } from '../figma/ImageWithFallback';
import { useLanguage } from '../../shared/contexts/LanguageContext';
import { resolveImageUrl } from '@/shared/utils/imageUrl';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

export function PartnersSection() {
  const { partners, isLoading } = usePartners();
  const { t } = useLanguage();
  const sectionRef = useRef<HTMLElement>(null);
  const titleRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);

  // const partners = [
  //   'Zoetis',
  //   'Boehringer Ingelheim',
  //   'MSD Animal Health',
  //   'Ceva',
  //   'Huvepharma',
  //   'Elanco',
  //   'Virbac',
  //   'Vetoquinol',
  // ];

  // GSAP анимации
  useEffect(() => {
    if (sectionRef.current && titleRef.current && gridRef.current && !isLoading && partners && partners.length > 0) {
      // Анимация заголовка
      gsap.fromTo(titleRef.current,
        { opacity: 0, y: 40 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 80%',
            toggleActions: 'play none none none',
            once: true,
          },
        }
      );

      // Анимация партнеров с задержкой
      const partnerCards = gridRef.current.querySelectorAll('div');
      if (partnerCards.length > 0) {
        gsap.fromTo(partnerCards,
          { opacity: 0, scale: 0.8, y: 40 },
          {
            opacity: 1,
            scale: 1,
            y: 0,
            duration: 0.6,
            ease: 'back.out(1.7)',
            stagger: 0.1,
            scrollTrigger: {
              trigger: sectionRef.current,
              start: 'top 75%',
              toggleActions: 'play none none none',
              once: true,
            },
          }
        );
      }
    }

    return () => {
      ScrollTrigger.getAll().forEach((trigger) => {
        if (trigger.vars.trigger === sectionRef.current) {
          trigger.kill();
        }
      });
    };
  }, [isLoading, partners]);

  if (isLoading || !partners || partners.length === 0) {
    return null;
  }

  return (
    <section ref={sectionRef} className="py-20 bg-white" id="partners">
      <div className="container mx-auto px-4">
        <div ref={titleRef} className="text-center mb-12">
          <h2 className="mb-4">{t('partners.title')}</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            {t('partners.subtitle')}
          </p>
        </div>

        <div ref={gridRef} className="grid grid-cols-2 md:grid-cols-3 gap-8">
          {partners.map((partner) => (
            <div
              key={partner.id}
              className="bg-white rounded-xl p-8 flex items-center justify-center border border-gray-100 shadow-md hover:shadow-lg transition-shadow"
            >
              {partner.logo ? (
                <ImageWithFallback
                  src={resolveImageUrl(partner.logo)}
                  alt={partner.name}
                  className="max-w-full max-h-16 object-contain"
                />
              ) : (
                <span className="text-xl text-gray-400 font-semibold">{partner.name}</span>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
