import { HeroSection } from '../components/sections/HeroSection';
import { CompanyInfoSection } from '../components/sections/CompanyInfoSection';
import { CatalogAndServicesSection } from '../components/sections/CatalogAndServicesSection';
import { NewsSection } from '../components/sections/NewsSection';
import { PartnersSection } from '../components/sections/PartnersSection';
import { TeamSection } from '../components/sections/TeamSection';
import { ContactFormSection } from '../components/sections/ContactFormSection';
import { MapSection } from '../components/sections/MapSection';

export function HomePage() {
  return (
    <>
      <HeroSection />
      <CompanyInfoSection />
      <CatalogAndServicesSection />
      <NewsSection />
      <PartnersSection />
      <TeamSection />
      <ContactFormSection />
      <MapSection />
    </>
  );
}
