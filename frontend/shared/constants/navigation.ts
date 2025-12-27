import type { TranslationKey } from '../i18n/translations';

export interface NavItem {
  labelKey: TranslationKey; // Changed from label to labelKey for i18n support
  href: string;
  children?: NavItem[];
}

export const NAVIGATION: NavItem[] = [
  { 
    labelKey: 'nav.about',
    href: '/about',
    children: [
      { labelKey: 'nav.about.mission', href: '/about#mission' },
      { labelKey: 'nav.about.team', href: '/team' },
      { labelKey: 'nav.about.partners', href: '/#partners' },
    ],
  },
  {
    labelKey: 'nav.catalog',
    href: '/catalog',
    children: [
      { labelKey: 'nav.catalog.vaccines', href: '/catalog?category=vaccines' },
      { labelKey: 'nav.catalog.medicines', href: '/catalog?category=medicines' },
      { labelKey: 'nav.catalog.disinfection', href: '/catalog?category=disinfection' },
      { labelKey: 'nav.catalog.feedAdditives', href: '/catalog?category=feed-additives' },
      { labelKey: 'nav.catalog.equipment', href: '/catalog?category=equipment' },
    ],
  },
  {
    labelKey: 'nav.services',
    href: '/services',
    // children будут динамически загружаться из API
  },
  { labelKey: 'nav.news', href: '/news' },
  { labelKey: 'nav.career', href: '/career' },
  { labelKey: 'nav.gallery', href: '/gallery' },
];
