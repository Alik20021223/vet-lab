import { useState, useEffect, useRef } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '../ui/button';
import { BRAND } from '../../shared/constants/brand';
// import { ImageWithFallback } from '../figma/ImageWithFallback';
import { Link } from 'react-router-dom';
import { useLanguage } from '../../shared/contexts/LanguageContext';
import backgroundHero from '../../assets/background-hero.png';

const HERO_SLIDES = [
  {
    image: backgroundHero,
    title: 'Профессиональные ветеринарные услуги',
  },
  {
    image: backgroundHero,
    title: 'VET-LAB — ведущий поставщик ветеринарных решений',
  },
  {
    image: backgroundHero,
    title: 'Инновационная лаборатория для животноводства',
  },
  
];

export function HeroSection() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const { t } = useLanguage();
  const textRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % HERO_SLIDES.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (textRef.current) {
      textRef.current.style.opacity = '0';
      textRef.current.style.transform = 'translateY(20px)';
      setTimeout(() => {
        if (textRef.current) {
          textRef.current.style.transition = 'opacity 0.7s ease-in-out, transform 0.7s ease-in-out';
          textRef.current.style.opacity = '1';
          textRef.current.style.transform = 'translateY(0)';
        }
      }, 50);
    }
  }, [currentSlide]);

  const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % HERO_SLIDES.length);
  const prevSlide = () => setCurrentSlide((prev) => (prev - 1 + HERO_SLIDES.length) % HERO_SLIDES.length);

  return (
    <section className="relative h-[400px] md:h-[500px] lg:h-[600px] overflow-hidden">
      {HERO_SLIDES.map((slide, index) => (
        <div
          key={index}
          className="absolute inset-0 transition-opacity duration-700 ease-in-out"
          style={{ 
            opacity: currentSlide === index ? 1 : 0,
            transform: `scale(${currentSlide === index ? 1 : 1.05})`,
            transition: 'opacity 700ms ease-in-out, transform 700ms ease-in-out',
          }}
        >
          <img
            src={slide.image}
            alt={slide.title}
            className="w-full h-full object-cover"
          />
          {/* <div
            className="absolute inset-0"
            style={{
              background: `linear-gradient(135deg, ${BRAND.colors.primary}dd 0%, ${BRAND.colors.primary}66 100%)`,
            }}
          /> */}
        </div>
      ))}

      <div className="absolute inset-0 flex items-center justify-center">
        <div className="container mx-auto px-4 text-center text-white">
          <div
            ref={textRef}
            key={currentSlide}
            style={{
              opacity: 1,
              transform: 'translateY(0)',
              transition: 'opacity 0.7s ease-in-out, transform 0.7s ease-in-out',
            }}
          >
            <h1 className="text-2xl md:text-4xl lg:text-5xl mb-4 md:mb-6 max-w-4xl mx-auto">
              {t('hero.title')}
            </h1>
            <p className="text-sm md:text-lg lg:text-xl mb-6 md:mb-8 max-w-3xl mx-auto opacity-95">
              {t('hero.subtitle')}
            </p>
            <div className="flex flex-col sm:flex-row gap-3 md:gap-4 justify-center max-w-md mx-auto sm:max-w-none">
              <Button
                size="lg"
                style={{ backgroundColor: BRAND.colors.accent }}
                className="text-white hover:opacity-90 hover:scale-105 transition-all duration-200 w-full sm:w-auto"
                asChild
              >
                <Link to="/services">{t('hero.services')}</Link>
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="bg-white/10 text-white border-white hover:bg-white hover:text-[#00AADC] hover:scale-105 transition-all duration-200 w-full sm:w-auto"
                asChild
              >
                <Link to="/contacts">{t('hero.contact')}</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>

      <button
        onClick={prevSlide}
        className="hidden md:flex absolute left-2 md:left-4 top-1/2 -translate-y-1/2 w-10 h-10 md:w-12 md:h-12 bg-white/20 hover:bg-white/30 rounded-full items-center justify-center transition-all duration-200 hover:scale-110 backdrop-blur-sm active:scale-95"
      >
        <ChevronLeft className="w-5 h-5 md:w-6 md:h-6 text-white" />
      </button>
      <button
        onClick={nextSlide}
        className="hidden md:flex absolute right-2 md:right-4 top-1/2 -translate-y-1/2 w-10 h-10 md:w-12 md:h-12 bg-white/20 hover:bg-white/30 rounded-full items-center justify-center transition-all duration-200 hover:scale-110 backdrop-blur-sm active:scale-95"
      >
        <ChevronRight className="w-5 h-5 md:w-6 md:h-6 text-white" />
      </button>

      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2">
        {HERO_SLIDES.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={`h-2 rounded-full transition-all ${
              currentSlide === index ? 'w-8' : 'w-2 bg-white/50'
            }`}
            style={currentSlide === index ? { backgroundColor: BRAND.colors.accent } : undefined}
          />
        ))}
      </div>
    </section>
  );
}
