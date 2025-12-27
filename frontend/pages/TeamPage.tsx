import { TeamSection } from '../components/sections/TeamSection';
import { Breadcrumbs } from '../components/Breadcrumbs';
import { useLanguage } from '../shared/contexts/LanguageContext';

export function TeamPage() {
  const { t } = useLanguage();
  
  return (
    <>
      <section className="py-20 bg-linear-to-br from-[#00AADC] to-[#0088B8] text-white">
        <div className="container mx-auto px-4 text-center">
          <h1 className="mb-6">{t('teamPage.title')}</h1>
          <p className="text-xl max-w-3xl mx-auto opacity-95">
            {t('teamPage.subtitle')}
          </p>
        </div>
      </section>

      <section className="py-4 bg-white">
        <div className="container mx-auto px-4">
          <Breadcrumbs items={[{ label: t('nav.team') }]} />
        </div>
      </section>

      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center mb-12">
            <p className="text-muted-foreground">
              {t('teamPage.description')}
            </p>
          </div>
        </div>
      </section>

      <TeamSection />
    </>
  );
}
