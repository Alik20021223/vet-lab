import { useState, useEffect, useRef } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '../ui/button';
import { BRAND } from '../../shared/constants/brand';
import { Link } from 'react-router-dom';
import { useLanguage } from '../../shared/contexts/LanguageContext';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGetHeroSlidesQuery } from '../../shared/services/hero-slides.service';
import { resolveImageUrl } from '../../shared/utils/imageUrl';
import backgroundHero from '../../assets/background-hero.png';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

export function HeroSection() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const { t, language } = useLanguage();
  const { data: heroSlidesData, isLoading } = useGetHeroSlidesQuery();
  const textRef = useRef<HTMLDivElement>(null);
  const heroRef = useRef<HTMLElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const buttonsRef = useRef<HTMLDivElement>(null);

  // Получаем слайды из API или используем fallback
  const heroSlides = heroSlidesData?.data || [];
  const hasSlides = heroSlides.length > 0;

  useEffect(() => {
    if (!hasSlides) return;
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [hasSlides, heroSlides.length]);

  // GSAP анимация при загрузке
  useEffect(() => {
    if (heroRef.current && titleRef.current && subtitleRef.current && buttonsRef.current) {
      // Анимация заголовка
      gsap.fromTo(titleRef.current, 
        { opacity: 0, y: 50, scale: 0.9 },
        { opacity: 1, y: 0, scale: 1, duration: 1, ease: 'power3.out', delay: 0.3 }
      );
      
      // Анимация подзаголовка
      gsap.fromTo(subtitleRef.current,
        { opacity: 0, y: 40 },
        { opacity: 1, y: 0, duration: 1, ease: 'power3.out', delay: 0.6 }
      );
      
      // Анимация кнопок
      gsap.fromTo(buttonsRef.current,
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out', delay: 0.9 }
      );
    }
  }, []);

  // GSAP анимация при смене слайда
  useEffect(() => {
    if (textRef.current && titleRef.current && subtitleRef.current && buttonsRef.current) {
      // Анимация исчезновения
      gsap.to([titleRef.current, subtitleRef.current, buttonsRef.current], {
        opacity: 0,
        y: -20,
        duration: 0.3,
        ease: 'power2.in',
        onComplete: () => {
          // Анимация появления
          gsap.fromTo([titleRef.current, subtitleRef.current, buttonsRef.current],
            { opacity: 0, y: 30 },
            { 
              opacity: 1, 
              y: 0, 
              duration: 0.7, 
              ease: 'power3.out',
              stagger: 0.1
            }
          );
        }
      });
    }
  }, [currentSlide]);

  const nextSlide = () => {
    if (!hasSlides) return;
    setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
  };
  const prevSlide = () => {
    if (!hasSlides) return;
    setCurrentSlide((prev) => (prev - 1 + heroSlides.length) % heroSlides.length);
  };

  // Если нет слайдов из API, показываем fallback
  if (!isLoading && !hasSlides) {
    return (
      <section ref={heroRef} className="relative h-[400px] md:h-[500px] lg:h-[600px] overflow-hidden">
        <div className="absolute inset-0">
          <img
            src={backgroundHero}
            alt="Hero"
            className="w-full h-full object-cover"
          />
        </div>
        <div className="absolute inset-0 bg-black/30"></div>
        <div className="absolute inset-0 flex items-center justify-center pt-16 lg:pt-20">
          <div className="container mx-auto px-4 text-center text-white">
            <h1 className="text-3xl md:text-5xl lg:text-6xl xl:text-7xl mb-4 md:mb-6 max-w-4xl mx-auto font-bold tracking-tight drop-shadow-lg">
              {t('hero.title')}
            </h1>
            <p className="text-xl md:text-3xl lg:text-4xl xl:text-5xl mb-8 md:mb-10 max-w-4xl mx-auto font-semibold tracking-wide drop-shadow-md">
              {t('hero.subtitle')}
            </p>
            <div className="flex flex-col sm:flex-row gap-3 md:gap-4 justify-center max-w-md mx-auto sm:max-w-none">
              <Button
                size="lg"
                style={{ backgroundColor: BRAND.colors.accent }}
                className="text-white hover:opacity-90 hover:scale-105 transition-all duration-200 w-full sm:w-auto text-base md:text-lg px-6 md:px-8 py-6 md:py-7 font-semibold shadow-lg"
                asChild
              >
                <Link to="/services">{t('hero.services')}</Link>
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="bg-white/10 backdrop-blur-sm text-white border-2 border-white hover:bg-white hover:text-[#00AADC] hover:scale-105 transition-all duration-200 w-full sm:w-auto text-base md:text-lg px-6 md:px-8 py-6 md:py-7 font-semibold shadow-lg"
                asChild
              >
                <Link to="/contacts">{t('hero.contact')}</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (isLoading) {
    return (
      <section ref={heroRef} className="relative h-[400px] md:h-[500px] lg:h-[600px] overflow-hidden bg-gray-200 animate-pulse">
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-gray-400">Загрузка...</div>
        </div>
      </section>
    );
  }

  return (
    <section ref={heroRef} className="relative h-[400px] md:h-[500px] lg:h-[600px] overflow-hidden">
      {heroSlides.map((slide, index) => (
        <div
          key={slide.id}
          className="absolute inset-0 transition-opacity duration-700 ease-in-out"
          style={{ 
            opacity: currentSlide === index ? 1 : 0,
            transform: `scale(${currentSlide === index ? 1 : 1.05})`,
            transition: 'opacity 700ms ease-in-out, transform 700ms ease-in-out',
          }}
        >
          <img
            src={resolveImageUrl(slide.image)}
            alt={language === 'en' && slide.titleEn ? slide.titleEn : slide.title}
            className="w-full h-full object-cover"
          />
        </div>
      ))}

      {/* Dark overlay for better text readability */}
      <div className="absolute inset-0 bg-black/30"></div>

      <div className="absolute inset-0 flex items-center justify-center pt-16 lg:pt-20">
        <div className="container mx-auto px-4 text-center text-white">
          <div ref={textRef} key={currentSlide}>
            {hasSlides && heroSlides[currentSlide] && (
              <h1 
                ref={titleRef}
                className="text-3xl md:text-5xl lg:text-6xl xl:text-7xl mb-4 md:mb-6 max-w-4xl mx-auto font-bold tracking-tight drop-shadow-lg"
              >
                VET-LAB
              </h1>
            )}
            <p 
              ref={subtitleRef}
              className="text-xl md:text-3xl lg:text-4xl xl:text-5xl mb-8 md:mb-10 max-w-4xl mx-auto font-semibold tracking-wide drop-shadow-md"
            >
              {language === 'en' && heroSlides[currentSlide].titleEn 
                  ? heroSlides[currentSlide].titleEn 
                  : heroSlides[currentSlide].title}
            </p>
            <div 
              ref={buttonsRef}
              className="flex flex-col sm:flex-row gap-3 md:gap-4 justify-center max-w-md mx-auto sm:max-w-none"
            >
              <Button
                size="lg"
                style={{ backgroundColor: BRAND.colors.accent }}
                className="text-white hover:opacity-90 hover:scale-105 transition-all duration-200 w-full sm:w-auto text-base md:text-lg px-6 md:px-8 py-6 md:py-7 lg:px-16 font-semibold shadow-lg"
                asChild
              >
                <Link to="/services">{t('hero.services')}</Link>
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="bg-white/10 backdrop-blur-sm text-white border-2 border-white hover:bg-white hover:text-[#00AADC] hover:scale-105 transition-all duration-200 w-full sm:w-auto text-base md:text-lg px-6 md:px-8 py-6 md:py-7 lg:px-16 font-semibold shadow-lg"
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

      {hasSlides && heroSlides.length > 1 && (
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2">
          {heroSlides.map((_, index) => (
            <button
              key={heroSlides[index].id}
              onClick={() => setCurrentSlide(index)}
              className={`h-2 rounded-full transition-all ${
                currentSlide === index ? 'w-8' : 'w-2 bg-white/50'
              }`}
              style={currentSlide === index ? { backgroundColor: BRAND.colors.accent } : undefined}
            />
          ))}
        </div>
      )}
    </section>
  );
}
