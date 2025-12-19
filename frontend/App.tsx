import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { LanguageProvider } from './shared/contexts/LanguageContext';
import { Layout } from './components/layout/Layout';
import { ScrollToTop } from './components/ScrollToTop';
import { Toaster } from './components/ui/sonner';
import { HomePage } from './pages/HomePage';
import { AboutPage } from './pages/AboutPage';
import { ServicesPage } from './pages/ServicesPage';
import { ServiceDetailPage } from './pages/ServiceDetailPage';
import { CatalogPage } from './pages/CatalogPage';
import { ProductDetailPage } from './pages/ProductDetailPage';
import { TeamPage } from './pages/TeamPage';
import { NewsPage } from './pages/NewsPage';
import { NewsDetailPage } from './pages/NewsDetailPage';
import { ContactsPage } from './pages/ContactsPage';
import { CareerPage } from './pages/CareerPage';
import { GalleryPage } from './pages/GalleryPage';

// Admin Pages
import { LoginPage } from './pages/admin/LoginPage';
import { DashboardPage } from './pages/admin/DashboardPage';
import { CatalogPage as AdminCatalogPage } from './pages/admin/CatalogPage';
import { BrandsAdminPage } from './pages/admin/BrandsAdminPage';
import { ServicesAdminPage } from './pages/admin/ServicesAdminPage';
import { NewsAdminPage } from './pages/admin/NewsAdminPage';
import { TeamAdminPage } from './pages/admin/TeamAdminPage';
import { PartnersAdminPage } from './pages/admin/PartnersAdminPage';
import { GalleryAdminPage } from './pages/admin/GalleryAdminPage';
import { ContactsAdminPage } from './pages/admin/ContactsAdminPage';
import { CareersAdminPage } from './pages/admin/CareersAdminPage';
import { ProtectedRoute } from './components/admin/ProtectedRoute';

export default function App() {
  return (
    <LanguageProvider>
      <BrowserRouter>
        <ScrollToTop />
        <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Layout><HomePage /></Layout>} />
        <Route path="/about" element={<Layout><AboutPage /></Layout>} />
        <Route path="/services" element={<Layout><ServicesPage /></Layout>} />
        <Route path="/services/:serviceId" element={<Layout><ServiceDetailPage /></Layout>} />
        <Route path="/catalog" element={<Layout><CatalogPage /></Layout>} />
        <Route path="/catalog/:productId" element={<Layout><ProductDetailPage /></Layout>} />
        <Route path="/team" element={<Layout><TeamPage /></Layout>} />
        <Route path="/news" element={<Layout><NewsPage /></Layout>} />
        <Route path="/news/:newsId" element={<Layout><NewsDetailPage /></Layout>} />
        <Route path="/contacts" element={<Layout><ContactsPage /></Layout>} />
        <Route path="/career" element={<Layout><CareerPage /></Layout>} />
        <Route path="/gallery" element={<Layout><GalleryPage /></Layout>} />

        {/* Admin Routes */}
        <Route path="/admin/login" element={<LoginPage />} />
        <Route
          path="/admin"
          element={
            <ProtectedRoute>
              <DashboardPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/catalog"
          element={
            <ProtectedRoute>
              <AdminCatalogPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/brands"
          element={
            <ProtectedRoute>
              <BrandsAdminPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/services"
          element={
            <ProtectedRoute>
              <ServicesAdminPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/news"
          element={
            <ProtectedRoute>
              <NewsAdminPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/team"
          element={
            <ProtectedRoute>
              <TeamAdminPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/partners"
          element={
            <ProtectedRoute>
              <PartnersAdminPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/gallery"
          element={
            <ProtectedRoute>
              <GalleryAdminPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/contacts"
          element={
            <ProtectedRoute>
              <ContactsAdminPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/careers"
          element={
            <ProtectedRoute>
              <CareersAdminPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/settings"
          element={
            <ProtectedRoute>
              <DashboardPage />
            </ProtectedRoute>
          }
        />
      </Routes>
      </BrowserRouter>
      <Toaster />
    </LanguageProvider>
  );
}
