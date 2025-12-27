import {
  useGetDashboardStatsQuery,
  useGetActivityLogQuery,
  type ActivityLogFilters,
} from '../../services/dashboard.service';

export function useAdminDashboard() {
  const { data, isLoading, error, refetch } = useGetDashboardStatsQuery();

  // API может возвращать данные напрямую или в обертке { data: ... }
  const stats = data?.data || data;

  return {
    stats,
    isLoading,
    error,
    refetch,
  };
}

export function useAdminActivityLog(filters?: ActivityLogFilters) {
  const { data, isLoading, error } = useGetActivityLogQuery(filters || {});

  // API может возвращать данные напрямую или в обертке { data: ... }
  const activity = data?.activity || data?.data?.activity || [];

  return {
    activity,
    isLoading,
    error,
    pagination: data?.pagination,
  };
}

