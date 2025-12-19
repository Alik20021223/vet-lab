import { CheckCircle2 } from 'lucide-react';
import { BRAND } from '../../shared/constants/brand';
import aboutImage from '../../assets/why-us.png';
import { useLanguage } from '../../shared/contexts/LanguageContext';
import { useScrollAnimation } from '../../shared/hooks/useScrollAnimation';

export function AboutSection() {
  const { t } = useLanguage();
  const { elementRef, isVisible } = useScrollAnimation({ threshold: 0.2 });

  const benefits = [
    t('about.benefit1'),
    t('about.benefit2'),
    t('about.benefit3'),
    t('about.benefit4'),
  ];

  return (
    <section className="py-12 md:py-16 lg:py-20" id="about" ref={elementRef}>
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-2 gap-8 lg:gap-12 items-center">
          <div 
            className={`relative order-2 md:order-1 transition-all duration-700 ${
              isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-8'
            }`}
          >
            <div className="absolute -inset-4 rounded-3xl opacity-15" style={{ backgroundColor: BRAND.colors.accent }} />
            <img
              src={aboutImage}
              alt="VET-LAB Laboratory"
              className="relative rounded-2xl w-full h-[300px] md:h-[400px] lg:h-[500px] object-contain shadow-xl hover:scale-105 transition-transform duration-300"
            />
          </div>

          <div 
            className={`order-1 md:order-2 transition-all duration-700 delay-100 ${
              isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-8'
            }`}
          >
            <h2 className="mb-4 md:mb-6">{t('about.title')}</h2>
            <p className="text-muted-foreground mb-4 md:mb-6">
              {t('about.text1')}
            </p>
            <p className="text-muted-foreground mb-6 md:mb-8">
              {t('about.text2')}
            </p>

            <div className="space-y-3 md:space-y-4">
              {benefits.map((benefit, index) => (
                <div 
                  key={index} 
                  className={`flex items-start gap-3 transition-all duration-500 ${
                    isVisible 
                      ? 'opacity-100 translate-x-0' 
                      : 'opacity-0 translate-x-4'
                  }`}
                  style={{ transitionDelay: `${200 + index * 100}ms` }}
                >
                  <CheckCircle2 className="w-5 h-5 md:w-6 md:h-6 shrink-0 mt-0.5 transition-transform duration-300 hover:scale-110" style={{ color: BRAND.colors.accent }} />
                  <span className="text-sm md:text-base">{benefit}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
