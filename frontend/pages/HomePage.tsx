import { HeroSection } from '../components/sections/HeroSection';
import { CatalogAndServicesSection } from '../components/sections/CatalogAndServicesSection';
import { AboutSection } from '../components/sections/AboutSection';
import { NewsSection } from '../components/sections/NewsSection';
import { PartnersSection } from '../components/sections/PartnersSection';
import { TeamSection } from '../components/sections/TeamSection';
import { ContactFormSection } from '../components/sections/ContactFormSection';
import { MapSection } from '../components/sections/MapSection';

export function HomePage() {
  return (
    <>
      <HeroSection />
      <CatalogAndServicesSection />
      <NewsSection />
      <AboutSection />
      <PartnersSection />
      <TeamSection />
      <ContactFormSection />
      <MapSection />
    </>
  );
}
