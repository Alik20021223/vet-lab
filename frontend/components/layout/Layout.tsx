import { ReactNode } from 'react';
import { useLocation } from 'react-router-dom';
import { Header } from './Header';
import { Footer } from './Footer';
import { SocialSidebar } from './SocialSidebar';
import { ScrollToTopButton } from './ScrollToTopButton';

interface LayoutProps {
  children: ReactNode;
}

export function Layout({ children }: LayoutProps) {
  const location = useLocation();
  const isHomePage = location.pathname === '/';

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header isTransparent={isHomePage} />
      <main className={`flex-1 ${isHomePage ? 'pt-0' : 'pt-16 lg:pt-20'}`}>{children}</main>
      <Footer />
      <SocialSidebar />
      <ScrollToTopButton />
    </div>
  );
}
