import { ReactNode, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../shared/hooks/useAuth';
import { useLanguage } from '../../shared/contexts/LanguageContext';
import {
  LayoutDashboard,
  Package,
  Briefcase,
  Newspaper,
  Users,
  Handshake,
  Image as ImageIcon,
  Phone,
  FileText,
  Settings,
  LogOut,
  Search,
  Menu,
  X,
  Home,
  Tag,
} from 'lucide-react';
import { BRAND } from '../../shared/constants/brand';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import logo from '../../assets/vetLab-logo.png';

interface AdminLayoutProps {
  children: ReactNode;
}

const ADMIN_NAVIGATION = [
  { labelKey: 'admin.dashboard', icon: LayoutDashboard, href: '/admin' },
  { labelKey: 'admin.catalog', icon: Package, href: '/admin/catalog' },
  { labelKey: 'admin.brands', icon: Tag, href: '/admin/brands' },
  { labelKey: 'admin.services', icon: Briefcase, href: '/admin/services' },
  { labelKey: 'admin.news', icon: Newspaper, href: '/admin/news' },
  { labelKey: 'admin.team', icon: Users, href: '/admin/team' },
  { labelKey: 'admin.partners', icon: Handshake, href: '/admin/partners' },
  { labelKey: 'admin.gallery', icon: ImageIcon, href: '/admin/gallery' },
  { labelKey: 'admin.heroSlides', icon: ImageIcon, href: '/admin/hero-slides' },
  { labelKey: 'admin.careers', icon: Briefcase, href: '/admin/careers' },
  { labelKey: 'admin.contacts', icon: Phone, href: '/admin/contacts' },
  { labelKey: 'admin.settings', icon: Settings, href: '/admin/settings' },
] as const;

export function AdminLayout({ children }: AdminLayoutProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { t } = useLanguage();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const handleLogout = async () => {
    await logout();
    navigate('/admin/login');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sidebar */}
      <aside
        className={`fixed left-0 top-0 z-40 h-screen bg-white border-r border-gray-200 transition-all duration-300 ${
          isSidebarOpen ? 'w-64' : 'w-0 -translate-x-full'
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="flex items-center justify-between h-16 px-4 border-b border-gray-200">
            <Link to="/admin" className="flex items-center gap-2">
              <img src={logo} alt="VET-LAB" className="h-10 w-auto" />
            </Link>
            <button
              onClick={() => setIsSidebarOpen(false)}
              className="lg:hidden p-2 hover:bg-gray-100 rounded-lg"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 overflow-y-auto p-4">
            <ul className="space-y-1">
              {ADMIN_NAVIGATION.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.href || 
                  (item.href !== '/admin' && location.pathname.startsWith(item.href));
                
                return (
                  <li key={item.href}>
                    <Link
                      to={item.href}
                      className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                        isActive
                          ? 'text-white'
                          : 'text-gray-700 hover:bg-gray-100'
                      }`}
                      style={
                        isActive
                          ? { backgroundColor: BRAND.colors.primary }
                          : undefined
                      }
                    >
                      <Icon className="w-5 h-5" />
                      <span>{t(item.labelKey)}</span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>

          {/* User Section */}
          <div className="p-4 border-t border-gray-200">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-full bg-linear-to-br from-primary to-accent flex items-center justify-center text-white">
                {user?.name ? user.name.charAt(0).toUpperCase() : 'А'}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm truncate">{user?.name || t('admin.adminUser')}</p>
                <p className="text-xs text-gray-500">{user?.email || 'admin@vet-lab.tj'}</p>
              </div>
            </div>
            <Button
              variant="outline"
              size="sm"
              className="w-full justify-start text-red-600 border-red-200 hover:bg-red-50"
              onClick={handleLogout}
            >
              <LogOut className="w-4 h-4 mr-2" />
              {t('admin.logout')}
            </Button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div
        className={`transition-all duration-300 ${
          isSidebarOpen ? 'lg:ml-64' : 'ml-0'
        }`}
      >
        {/* Header */}
        <header className="sticky top-0 z-30 h-16 bg-white border-b border-gray-200">
          <div className="flex items-center justify-between h-full px-4 lg:px-8">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                className="p-2 hover:bg-gray-100 rounded-lg"
              >
                <Menu className="w-5 h-5" />
              </button>

              <div className="relative hidden md:block">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  placeholder={t('admin.search')}
                  className="pl-10 w-64"
                />
              </div>
            </div>

            <div className="flex items-center gap-2">
              {/* TODO: Remove temporary home link */}
              <Button variant="outline" size="sm" asChild>
                <Link to="/" className="flex items-center gap-2">
                  <Home className="w-4 h-4" />
                  <span className="hidden sm:inline">{t('admin.toSite')}</span>
                </Link>
              </Button>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="p-4 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
