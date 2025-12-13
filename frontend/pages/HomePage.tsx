import { HeroSection } from '../components/sections/HeroSection';
import { ServicesSection } from '../components/sections/ServicesSection';
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
      <ServicesSection />
      <AboutSection />
      <NewsSection />
      <PartnersSection />
      <TeamSection />
      <ContactFormSection />
      <MapSection />
    </>
  );
}
