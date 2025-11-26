import { useState, useEffect } from 'react';
import axios from 'axios';

export interface CricketLeague {
  idLeague: string;
  strLeague: string;
  strSport: string;
  strLeagueAlternate?: string;
  strBadge?: string;
  strBanner?: string;
  strLogo?: string;
  strPoster?: string;
  strTrophy?: string;
  strDescription?: string;
  intFormedYear?: string;
  strCountry?: string;
}

interface LeaguesResponse {
  leagues: CricketLeague[] | null;
}

export const useCricketLeagues = () => {
  const [leagues, setLeagues] = useState<CricketLeague[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchLeagues = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await axios.get<LeaguesResponse>(
        'https://www.thesportsdb.com/api/v1/json/3/all_leagues.php'
      );
      
      if (response.data.leagues) {
        // Filter only cricket leagues and remove null entries
        const cricketLeagues = response.data.leagues
          .filter(league => league && league.strSport === 'Cricket')
          .slice(0, 20); // Limit to 20 leagues
        setLeagues(cricketLeagues);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch leagues');
      console.error('Error fetching leagues:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeagues();
  }, []);

  return { leagues, loading, error, refetch: fetchLeagues };
};
