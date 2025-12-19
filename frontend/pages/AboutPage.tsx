
import { Breadcrumbs } from '../components/Breadcrumbs';
import { useLanguage } from '../shared/contexts/LanguageContext';
import { BRAND } from '../shared/constants/brand';
import aboutImage from '../assets/about-us.png';
import { 
  CheckCircle2, 
  Target, 
  Users, 
  TrendingUp,
  Microscope,
  TestTube,
  Shield,
  Award,
  Building2,
  Handshake
} from 'lucide-react';

export function AboutPage() {
  const { t } = useLanguage();

  const directions = [
    { icon: TestTube, title: 'Серология' },
    { icon: Microscope, title: 'Бактериология' },
    { icon: Shield, title: 'Вирусология' },
    { icon: Award, title: 'Зоотехния' },
  ];

  const partners = [
    { name: 'Kemin', country: 'США' },
    { name: 'Komipharm', country: 'Южная Корея' },
    { name: 'VIC', description: 'входит в топ-18 мировых производителей' },
    { name: 'Vilofoss', country: 'Германия' },
  ];

  const advantages = [
    { 
      icon: Target, 
      title: 'Точность диагностики',
      description: 'Современное оборудование и проверенные методики'
    },
    { 
      icon: TrendingUp, 
      title: 'Высокий уровень сервиса',
      description: 'Индивидуальный подход к каждому клиенту'
    },
    { 
      icon: CheckCircle2, 
      title: 'Уверенность в результате',
      description: 'Подтверждено опытом и результатами'
    },
  ];

  return (
    <>
      <section className="py-20 bg-linear-to-br from-[#00AADC] to-[#0088B8] text-white">
        <div className="container mx-auto px-4 text-center">
          <h1 className="mb-6">{t('aboutPage.title')}</h1>
          <p className="text-xl max-w-3xl mx-auto opacity-95">
            {t('aboutPage.subtitle')}
          </p>
        </div>
      </section>

      <section className="py-4 bg-white">
        <div className="container mx-auto px-4">
          <Breadcrumbs items={[{ label: t('nav.about') }]} />
        </div>
      </section>

      {/* О НАС - Main Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="mb-6 text-4xl font-bold" style={{ color: BRAND.colors.primary }}>
                О НАС
              </h2>
              <p className="text-lg text-gray-700 mb-6 leading-relaxed">
                Компания <span className="font-bold" style={{ color: BRAND.colors.primary }}>Vet-Lab</span>, основанная в 2022 году, является подразделением ООО «Парандапарварии Худжанд», ведущего предприятия в сфере птицеводства, работающего с 1960 года.
              </p>
              <p className="text-lg text-gray-700 mb-8 leading-relaxed">
                Vet-Lab — современная ветеринарная лаборатория полного цикла и надёжный партнёр в области птицеводства.
              </p>
              
              <div className="mb-8">
                <h3 className="text-xl font-semibold mb-4" style={{ color: BRAND.colors.primary }}>
                  Лаборатория объединяет четыре профильных направления:
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  {directions.map((direction, index) => {
                    const Icon = direction.icon;
                    return (
                      <div
                        key={index}
                        className="flex items-center gap-3 p-4 bg-white rounded-xl border border-gray-100 shadow-md hover:shadow-lg transition-shadow"
                      >
                        <div
                          className="w-12 h-12 rounded-lg flex items-center justify-center shrink-0"
                          style={{ backgroundColor: `${BRAND.colors.accent}20` }}
                        >
                          <Icon className="w-6 h-6" style={{ color: BRAND.colors.accent }} />
                        </div>
                        <span className="font-medium text-gray-800">{direction.title}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            <div className="relative">
              <div className="relative rounded-2xl overflow-hidden shadow-2xl">
                <img
                  src={aboutImage}
                  alt="Команда VET-LAB"
                  className="w-full h-[500px] object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Партнеры - Brands Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="mb-4">Мы являемся представителями ведущих мировых брендов</h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Контроль качества обеспечен системой холодильников с шестью уровнями защиты, онлайн-мониторингом и логгерами холодовой цепи — от завода до клиента.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {partners.map((partner, index) => (
              <div
                key={index}
                className="bg-white rounded-xl p-6 border border-gray-100 shadow-md hover:shadow-lg transition-shadow text-center"
              >
                <div
                  className="w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center"
                  style={{ backgroundColor: `${BRAND.colors.primary}10` }}
                >
                  <Building2 className="w-8 h-8" style={{ color: BRAND.colors.primary }} />
                </div>
                <h3 className="text-xl font-bold mb-2" style={{ color: BRAND.colors.primary }}>
                  {partner.name}
                </h3>
                <p className="text-sm text-gray-600">
                  {partner.country || partner.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Миссия Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-16">
              <div className="inline-block mb-6">
                <h2 className="text-3xl font-bold text-gray-800 tracking-wide">
                  МИССИЯ
                </h2>
                <div 
                  className="h-1 w-20 mx-auto mt-4 rounded-full"
                  style={{ backgroundColor: BRAND.colors.accent }}
                ></div>
              </div>
              <p className="text-lg text-gray-600 leading-relaxed max-w-3xl mx-auto">
                Мы помогаем хозяйствам региона поддерживать стабильную эпизоотическую обстановку и эффективно решать задачи диагностики, профилактики и сопровождения производства.
              </p>
            </div>

            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-[#00AADC]/5 to-[#0088B8]/5 rounded-3xl"></div>
              <div className="relative border-l-4 pl-8 py-8 rounded-r-3xl" style={{ borderColor: BRAND.colors.primary }}>
                <p className="text-xl text-gray-700 mb-3 leading-relaxed">
                  Благодаря комплексному подходу клиенты получают все услуги{' '}
                  <span className="font-bold text-2xl" style={{ color: BRAND.colors.primary }}>
                    в одном окне
                  </span>
                </p>
                <p className="text-base text-gray-500">
                  от лабораторных исследований до практических рекомендаций и подбора решений.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Статистика и преимущества */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center mb-16">
            <div className="text-center lg:text-left">
              <div className="inline-block mb-6">
                <div
                  className="w-24 h-24 rounded-2xl flex items-center justify-center mx-auto lg:mx-0"
                  style={{ backgroundColor: `${BRAND.colors.accent}20` }}
                >
                  <Users className="w-12 h-12" style={{ color: BRAND.colors.accent }} />
                </div>
              </div>
              <div className="mb-4">
                <span 
                  className="text-6xl font-bold"
                  style={{ color: BRAND.colors.accent }}
                >
                  +200
                </span>
                <span className="text-3xl text-gray-600 ml-2">хозяйств</span>
              </div>
              <p className="text-xl text-gray-600">уже работают с нами.</p>
            </div>

            <div className="grid gap-6">
              {advantages.map((advantage, index) => {
                const Icon = advantage.icon;
                return (
                  <div
                    key={index}
                    className="flex items-start gap-4 bg-white rounded-xl p-6 border border-gray-100 shadow-md hover:shadow-lg transition-shadow"
                  >
                    <div
                      className="w-14 h-14 rounded-xl flex items-center justify-center shrink-0"
                      style={{ backgroundColor: `${BRAND.colors.accent}20` }}
                    >
                      <Icon className="w-7 h-7" style={{ color: BRAND.colors.accent }} />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold mb-2">{advantage.title}</h3>
                      <p className="text-gray-600">{advantage.description}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Финальный слоган */}
          <div className="text-center py-12">
            <div className="max-w-3xl mx-auto">
              <div className="flex items-center justify-center gap-4 mb-6">
                <div className="h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent flex-1"></div>
                <Handshake className="w-12 h-12" style={{ color: BRAND.colors.primary }} />
                <div className="h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent flex-1"></div>
              </div>
              <h3 className="text-3xl font-bold mb-3" style={{ color: BRAND.colors.primary }}>
                Vet-Lab
              </h3>
              <p className="text-xl text-gray-700">
                проверено опытом, подтверждено результатами
              </p>
            </div>
          </div>
        </div>
      </section>

    </>
  );
}
