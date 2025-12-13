import { api, prepareRequestBody } from '../store/api';
import type { AdminTeamMember } from '../types/admin';

export interface TeamFilters {
  page?: number;
  limit?: number;
}

export interface TeamListResponse {
  data: AdminTeamMember[];
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface TeamResponse {
  data: AdminTeamMember;
}

export interface CreateTeamMemberRequest {
  name: string;
  position: string;
  photo?: File | string;
  email?: string;
  phone?: string;
  social?: {
    facebook?: string;
    linkedin?: string;
    instagram?: string;
  };
  sortOrder?: number;
}

export interface UpdateTeamMemberRequest extends Partial<CreateTeamMemberRequest> {
  id: string;
}

export const teamService = api.injectEndpoints({
  endpoints: (builder) => ({
    // Public endpoints
    getTeam: builder.query<TeamListResponse, void>({
      query: () => '/team',
      providesTags: ['Team'],
    }),

    // Admin endpoints
    getAdminTeam: builder.query<TeamListResponse, TeamFilters | void>({
      query: (filters) => {
        if (!filters) return '/admin/team';
        const params = new URLSearchParams();
        if (filters.page) params.append('page', String(filters.page));
        if (filters.limit) params.append('limit', String(filters.limit));
        return `/admin/team?${params.toString()}`;
      },
      providesTags: ['Team'],
    }),
    getAdminTeamMember: builder.query<TeamResponse, string>({
      query: (id) => `/admin/team/${id}`,
      providesTags: (result, error, id) => [{ type: 'Team', id }],
    }),
    createTeamMember: builder.mutation<TeamResponse, CreateTeamMemberRequest>({
      query: (data) => {
        const body = prepareRequestBody(data);
        return {
          url: '/admin/team',
          method: 'POST',
          body,
        };
      },
      invalidatesTags: ['Team'],
    }),
    updateTeamMember: builder.mutation<TeamResponse, UpdateTeamMemberRequest>({
      query: ({ id, ...data }) => {
        const body = prepareRequestBody(data);
        return {
          url: `/admin/team/${id}`,
          method: 'PUT',
          body,
        };
      },
      invalidatesTags: (result, error, { id }) => [{ type: 'Team', id }, 'Team'],
    }),
    deleteTeamMember: builder.mutation<{ message: string }, string>({
      query: (id) => ({
        url: `/admin/team/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Team'],
    }),
  }),
});

export const {
  useGetTeamQuery,
  useGetAdminTeamQuery,
  useGetAdminTeamMemberQuery,
  useCreateTeamMemberMutation,
  useUpdateTeamMemberMutation,
  useDeleteTeamMemberMutation,
} = teamService;


