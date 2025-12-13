import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { AdminLayout } from '../../components/admin/AdminLayout';
import {
  Package,
  Briefcase,
  Newspaper,
  Users,
  Handshake,
  TrendingUp,
  Activity,
} from 'lucide-react';
import { BRAND } from '../../shared/constants/brand';
import { useAdminDashboard, useAdminActivityLog } from '../../shared/hooks/admin/useAdminDashboard';
import { CATALOG_CATEGORIES, type DashboardStats, type ActivityLog } from '../../shared/types/admin';
import { toast } from 'sonner';

// Маппинг категорий для отображения
const CATEGORY_COLORS: Record<string, string> = {
  vaccines: '#00AADC',
  medicines: '#F8AF0D',
  disinfection: '#10B981',
  'feed-additives': '#8B5CF6',
  equipment: '#F59E0B',
  antibiotics: '#EF4444',
};

// Маппинг действий для локализации
const ACTION_LABELS: Record<string, string> = {
  create: 'Создан',
  update: 'Обновлён',
  delete: 'Удалён',
};

// Маппинг сущностей для локализации
const ENTITY_LABELS: Record<string, string> = {
  catalog: 'Товар',
  service: 'Услуга',
  news: 'Новость',
  team: 'Сотрудник',
  partner: 'Партнёр',
  gallery: 'Галерея',
  brand: 'Бренд',
  career: 'Вакансия',
  contact: 'Контакты',
  page: 'Страница',
};

// Форматирование времени
function formatTimeAgo(timestamp: string): string {
  const now = new Date();
  const time = new Date(timestamp);
  const diffInSeconds = Math.floor((now.getTime() - time.getTime()) / 1000);

  if (diffInSeconds < 60) {
    return 'только что';
  }

  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) {
    return `${diffInMinutes} ${diffInMinutes === 1 ? 'минуту' : diffInMinutes < 5 ? 'минуты' : 'минут'} назад`;
  }

  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) {
    return `${diffInHours} ${diffInHours === 1 ? 'час' : diffInHours < 5 ? 'часа' : 'часов'} назад`;
  }

  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays < 30) {
    return `${diffInDays} ${diffInDays === 1 ? 'день' : diffInDays < 5 ? 'дня' : 'дней'} назад`;
  }

  const diffInMonths = Math.floor(diffInDays / 30);
  return `${diffInMonths} ${diffInMonths === 1 ? 'месяц' : diffInMonths < 5 ? 'месяца' : 'месяцев'} назад`;
}

// Форматирование изменений
function formatChange(change?: { value: number; type: 'percent' | 'absolute'; period: string }): string {
  if (!change) return '';
  
  if (change.type === 'percent') {
    return `${change.value >= 0 ? '+' : ''}${change.value}%`;
  } else {
    return `${change.value >= 0 ? '+' : ''}${change.value}`;
  }
}

export function DashboardPage() {
  const navigate = useNavigate();
  const { stats, isLoading: isLoadingStats, error: statsError } = useAdminDashboard();
  const { activity, isLoading: isLoadingActivity } = useAdminActivityLog({ limit: 20 });

  // Формируем статистику для карточек
  const statsCards = useMemo(() => {
    if (!stats) return [];

    const statsData = stats as DashboardStats;

    return [
      {
        label: 'Товары',
        value: statsData.totalProducts.toString(),
        icon: Package,
        change: formatChange(statsData.changes?.products),
        color: BRAND.colors.primary,
      },
      {
        label: 'Услуги',
        value: statsData.totalServices.toString(),
        icon: Briefcase,
        change: formatChange(statsData.changes?.services),
        color: BRAND.colors.accent,
      },
      {
        label: 'Новости',
        value: statsData.totalNews.toString(),
        icon: Newspaper,
        change: formatChange(statsData.changes?.news),
        color: '#10B981',
      },
      {
        label: 'Команда',
        value: statsData.totalTeamMembers.toString(),
        icon: Users,
        change: formatChange(statsData.changes?.teamMembers),
        color: '#8B5CF6',
      },
      {
        label: 'Партнёры',
        value: statsData.totalPartners.toString(),
        icon: Handshake,
        change: formatChange(statsData.changes?.partners),
        color: '#F59E0B',
      },
    ];
  }, [stats]);

  // Формируем категории с процентами
  const productCategories = useMemo(() => {
    if (!stats) return [];
    
    const statsData = stats as DashboardStats;
    if (!statsData.productsByCategory || !statsData.totalProducts) return [];

    return statsData.productsByCategory.map((cat: { category: string; count: number; percentage?: number }) => {
      const categoryName = CATALOG_CATEGORIES[cat.category as keyof typeof CATALOG_CATEGORIES] || cat.category;
      const percentage = cat.percentage ?? (cat.count / statsData.totalProducts) * 100;
      const color = CATEGORY_COLORS[cat.category] || '#6B7280';

      return {
        name: categoryName,
        count: cat.count,
        percentage,
        color,
      };
    });
  }, [stats]);

  // Форматируем активность
  const formattedActivity = useMemo(() => {
    if (!activity || activity.length === 0) return [];

    return activity.map((item: ActivityLog) => {
      const actionLabel = ACTION_LABELS[item.action] || item.action;
      const entityLabel = ENTITY_LABELS[item.entity] || item.entity;
      const userName = typeof item.user === 'string' ? item.user : item.user.name;
      const timeAgo = formatTimeAgo(item.timestamp);

      return {
        id: item.id,
        action: actionLabel,
        entity: entityLabel,
        name: item.entityName || item.entityId,
        user: userName,
        time: timeAgo,
      };
    });
  }, [activity]);

  // Обработка ошибок
  if (statsError) {
    toast.error('Ошибка загрузки статистики');
  }
  return (
    <AdminLayout>
      <div className="space-y-8">
        {/* Header */}
        <div>
          <h1 className="mb-2">Dashboard</h1>
          <p className="text-muted-foreground">
            Обзор статистики и последних изменений
          </p>
        </div>

        {/* Loading State */}
        {(isLoadingStats || isLoadingActivity) && (
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
              <p className="text-muted-foreground">Загрузка данных...</p>
            </div>
          </div>
        )}

        {/* Stats Cards */}
        {!isLoadingStats && stats && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            {statsCards.map((stat) => {
              const Icon = stat.icon;
              const isPositive = stat.change ? (stat.change.startsWith('+') || stat.change === '0%' || stat.change === '0') : true;
              return (
                <div
                  key={stat.label}
                  className="bg-white rounded-xl p-6 border border-gray-200 hover:shadow-lg transition-shadow"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div
                      className="w-12 h-12 rounded-lg flex items-center justify-center"
                      style={{ backgroundColor: `${stat.color}15` }}
                    >
                      <Icon className="w-6 h-6" style={{ color: stat.color }} />
                    </div>
                    {stat.change && (
                      <div className={`flex items-center gap-1 text-sm ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
                        <TrendingUp className={`w-4 h-4 ${!isPositive ? 'rotate-180' : ''}`} />
                        {stat.change}
                      </div>
                    )}
                  </div>
                  <h3 className="text-2xl font-bold">{stat.value}</h3>
                  <p className="text-sm text-muted-foreground">{stat.label}</p>
                </div>
              );
            })}
          </div>
        )}

        {/* Charts Row */}
        {!isLoadingStats && !isLoadingActivity && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Products by Category */}
            {stats && productCategories.length > 0 && (
              <div className="bg-white rounded-xl p-6 border border-gray-200">
                <h3 className="mb-6">Товары по категориям</h3>
                <div className="space-y-4">
                  {productCategories.map((category) => (
                    <div key={category.name}>
                      <div className="flex items-center justify-between mb-2 text-sm">
                        <span>{category.name}</span>
                        <span className="font-medium">{category.count}</span>
                      </div>
                      <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                        <div
                          className="h-full rounded-full transition-all"
                          style={{
                            width: `${category.percentage}%`,
                            backgroundColor: category.color,
                          }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Recent Activity */}
            <div className="bg-white rounded-xl p-6 border border-gray-200">
              <div className="flex items-center gap-2 mb-6">
                <Activity className="w-5 h-5" style={{ color: BRAND.colors.primary }} />
                <h3>Последняя активность</h3>
              </div>
              <div className="space-y-4">
                {formattedActivity.length > 0 ? (
                  formattedActivity.map((activity: { id: string; action: string; entity: string; name: string; user: string; time: string }) => (
                    <div key={activity.id} className="flex gap-3">
                      <div
                        className="w-2 h-2 rounded-full mt-2 shrink-0"
                        style={{ backgroundColor: BRAND.colors.accent }}
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm">
                          <span className="font-medium">{activity.action}</span>{' '}
                          {activity.entity.toLowerCase()}{' '}
                          <span className="text-muted-foreground">{activity.name}</span>
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                          {activity.user} · {activity.time}
                        </p>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-muted-foreground text-center py-4">
                    Активности пока нет
                  </p>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Quick Actions */}
        <div className="bg-linear-to-br from-primary to-primary/80 rounded-xl p-8 text-white">
          <h3 className="mb-2">Быстрые действия</h3>
          <p className="text-white/80 mb-6">
            Часто используемые функции для быстрого доступа
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button
              onClick={() => navigate('/admin/catalog')}
              className="bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-lg p-4 text-left transition-colors"
            >
              <Package className="w-8 h-8 mb-2" />
              <h4 className="text-white">Добавить товар</h4>
            </button>
            <button
              onClick={() => navigate('/admin/news')}
              className="bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-lg p-4 text-left transition-colors"
            >
              <Newspaper className="w-8 h-8 mb-2" />
              <h4 className="text-white">Создать новость</h4>
            </button>
            <button
              onClick={() => navigate('/admin/team')}
              className="bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-lg p-4 text-left transition-colors"
            >
              <Users className="w-8 h-8 mb-2" />
              <h4 className="text-white">Добавить сотрудника</h4>
            </button>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
