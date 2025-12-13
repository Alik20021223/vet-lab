import { CheckCircle2 } from 'lucide-react';
import { BRAND } from '../../shared/constants/brand';
import aboutImage from '../../assets/why-us.png';
import { useLanguage } from '../../shared/contexts/LanguageContext';

export function AboutSection() {
  const { t } = useLanguage();

  const benefits = [
    t('about.benefit1'),
    t('about.benefit2'),
    t('about.benefit3'),
    t('about.benefit4'),
  ];

  return (
    <section className="py-12 md:py-16 lg:py-20" id="about">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-2 gap-8 lg:gap-12 items-center">
          <div className="relative order-2 md:order-1">
            <div className="absolute -inset-4 rounded-3xl opacity-15" style={{ backgroundColor: BRAND.colors.accent }} />
            <img
              src={aboutImage}
              alt="VET-LAB Laboratory"
              className="relative rounded-2xl w-full h-[300px] md:h-[400px] lg:h-[500px] object-contain shadow-xl"
            />
          </div>

          <div className="order-1 md:order-2">
            <h2 className="mb-4 md:mb-6">{t('about.title')}</h2>
            <p className="text-muted-foreground mb-4 md:mb-6">
              {t('about.text1')}
            </p>
            <p className="text-muted-foreground mb-6 md:mb-8">
              {t('about.text2')}
            </p>

            <div className="space-y-3 md:space-y-4">
              {benefits.map((benefit, index) => (
                <div key={index} className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 md:w-6 md:h-6 shrink-0 mt-0.5" style={{ color: BRAND.colors.accent }} />
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
