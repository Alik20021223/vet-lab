import { api } from '../store/api';
import type { DashboardStats } from '../types/admin';

export interface DashboardStatsResponse {
  data: DashboardStats;
  // API может возвращать данные напрямую или в обертке { data: ... }
}

export interface ActivityLogFilters {
  limit?: number;
}

export interface ActivityLogResponse {
  activity: DashboardStats['recentActivity'];
  pagination?: {
    limit: number;
    offset: number;
    total: number;
    hasMore: boolean;
  };
}

export const dashboardService = api.injectEndpoints({
  endpoints: (builder) => ({
    getDashboardStats: builder.query<DashboardStatsResponse, void>({
      query: () => '/admin/dashboard/stats',
      providesTags: ['Dashboard'],
    }),
    getActivityLog: builder.query<ActivityLogResponse, ActivityLogFilters>({
      query: (filters) => {
        const params = new URLSearchParams();
        if (filters.limit) params.append('limit', String(filters.limit));

        return {
          url: `/admin/dashboard/activity?${params.toString()}`,
          method: 'GET',
        };
      },
      providesTags: ['Dashboard'],
    }),
  }),
});

export const { useGetDashboardStatsQuery, useGetActivityLogQuery } = dashboardService;


