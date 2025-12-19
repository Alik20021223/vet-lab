import {
  useGetAdminTeamQuery,
  useGetAdminTeamMemberQuery,
  useCreateTeamMemberMutation,
  useUpdateTeamMemberMutation,
  useDeleteTeamMemberMutation,
} from '../../services/team.service';

export function useAdminTeam() {
  const { data, isLoading, error, refetch } = useGetAdminTeamQuery({ limit: 1000 });

  return {
    team: data?.data || [],
    isLoading,
    error,
    refetch,
  };
}

export function useAdminTeamMember(id: string | undefined) {
  const { data, isLoading, error } = useGetAdminTeamMemberQuery(id!, {
    skip: !id,
  });

  return {
    teamMember: data?.data,
    isLoading,
    error,
  };
}

export function useTeamMutations() {
  const [createTeamMember, { isLoading: isCreating }] = useCreateTeamMemberMutation();
  const [updateTeamMember, { isLoading: isUpdating }] = useUpdateTeamMemberMutation();
  const [deleteTeamMember, { isLoading: isDeleting }] = useDeleteTeamMemberMutation();

  return {
    createTeamMember,
    updateTeamMember,
    deleteTeamMember,
    isCreating,
    isUpdating,
    isDeleting,
  };
}

