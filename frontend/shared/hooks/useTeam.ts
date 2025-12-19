import { useGetTeamQuery } from '../services/team.service';

export function useTeam() {
  const { data, isLoading, error, refetch } = useGetTeamQuery();

  return {
    team: data?.data || [],
    isLoading,
    error,
    refetch,
  };
}


