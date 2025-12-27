import { useEffect, useRef } from 'react';
import { MapPin } from 'lucide-react';
import { BRAND } from '../../shared/constants/brand';
import { useLanguage } from '../../shared/contexts/LanguageContext';
import { useContacts } from '../../shared/hooks/useContacts';
import { getLocalizedField } from '../../shared/utils/localization';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

export function MapSection() {
  const { t, language } = useLanguage();
  const { contacts } = useContacts();
  const sectionRef = useRef<HTMLElement>(null);
  const titleRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);

  // GSAP анимации
  useEffect(() => {
    if (sectionRef.current && titleRef.current && mapRef.current && cardRef.current) {
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

      // Анимация карты
      gsap.fromTo(mapRef.current,
        { opacity: 0, scale: 0.95, y: 30 },
        {
          opacity: 1,
          scale: 1,
          y: 0,
          duration: 0.8,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 75%',
            toggleActions: 'play none none none',
            once: true,
          },
        }
      );

      // Анимация карточки с информацией
      gsap.fromTo(cardRef.current,
        { opacity: 0, x: -30, y: 30 },
        {
          opacity: 1,
          x: 0,
          y: 0,
          duration: 0.6,
          ease: 'back.out(1.7)',
          scrollTrigger: {
            trigger: mapRef.current,
            start: 'top 70%',
            toggleActions: 'play none none none',
            once: true,
          },
        }
      );
    }

    return () => {
      ScrollTrigger.getAll().forEach((trigger) => {
        if (trigger.vars.trigger === sectionRef.current || trigger.vars.trigger === mapRef.current) {
          trigger.kill();
        }
      });
    };
  }, [contacts]);
  
  return (
    <section ref={sectionRef} className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div ref={titleRef} className="text-center mb-12">
          <h2 className="mb-4">{t('map.title')}</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            {t('map.subtitle')}
          </p>
        </div>

        <div ref={mapRef} className="relative rounded-2xl overflow-hidden shadow-xl h-[500px] bg-gray-100">
          {contacts?.mapLat && contacts?.mapLng ? (
            <iframe
              src={`https://www.google.com/maps?q=${contacts.mapLat},${contacts.mapLng}&hl=${language}&z=15&output=embed`}
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="VET-LAB Location"
              key={`${contacts.mapLat}-${contacts.mapLng}`}
            />
          ) : (
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d48654.28815793655!2d69.59349597832031!3d40.283138000000006!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x38b21e8cf8b5b3e9%3A0x8d3f8c8a0e8d8d8d!2sKhujand%2C%20Tajikistan!5e0!3m2!1sen!2s!4v1639394844362!5m2!1sen!2s"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              title="VET-LAB Location"
            />
          )}
          
          <div ref={cardRef} className="absolute bottom-6 left-6 bg-white rounded-xl p-6 shadow-lg max-w-sm">
            <div className="flex items-start gap-3">
              <div
                className="w-12 h-12 rounded-lg flex items-center justify-center shrink-0"
                style={{ backgroundColor: `${BRAND.colors.primary}15` }}
              >
                <MapPin className="w-6 h-6" style={{ color: BRAND.colors.primary }} />
              </div>
              <div>
                <h4 className="mb-1">VET-LAB {language === 'en' ? 'Office' : 'Офис'}</h4>
                <p className="text-muted-foreground text-sm">
                  {contacts ? getLocalizedField(contacts, 'address', language) : BRAND.contact.address}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
