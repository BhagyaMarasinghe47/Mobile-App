import { useState, useEffect } from 'react';
import axios from 'axios';
import type { CricketTeam, CricketTeamsResponse } from '@/src/types/cricket';

const CRICKET_TEAMS_API = 'https://www.thesportsdb.com/api/v1/json/3/search_all_teams.php?s=Cricket';

interface UseCricketTeamsReturn {
  teams: CricketTeam[];
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

export const useCricketTeams = (): UseCricketTeamsReturn => {
  const [teams, setTeams] = useState<CricketTeam[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTeams = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await axios.get<CricketTeamsResponse>(CRICKET_TEAMS_API);
      
      if (response.data && response.data.teams) {
        // Filter out null entries and ensure valid cricket teams
        const validTeams = response.data.teams.filter(
          (team) => team && team.idTeam && team.strTeam
        );
        setTeams(validTeams);
      } else {
        setTeams([]);
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch cricket teams';
      setError(errorMessage);
      console.error('Error fetching cricket teams:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTeams();
  }, []);

  return {
    teams,
    loading,
    error,
    refetch: fetchTeams,
  };
};

export default useCricketTeams;
