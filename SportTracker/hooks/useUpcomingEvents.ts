import { useState, useEffect } from 'react';
import axios from 'axios';

export interface CricketEvent {
  idEvent: string;
  strEvent: string;
  strLeague?: string;
  dateEvent?: string;
  strTime?: string;
  strHomeTeam?: string;
  strAwayTeam?: string;
  strThumb?: string;
  strVenue?: string;
  strStatus?: string;
}

interface EventsResponse {
  events: CricketEvent[] | null;
}

export const useUpcomingEvents = () => {
  const [events, setEvents] = useState<CricketEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Fetch next events for cricket leagues - using a popular cricket league ID
      // You can change this to fetch from multiple leagues
      const leagueIds = ['4328']; // International Cricket
      
      let allEvents: CricketEvent[] = [];
      
      for (const leagueId of leagueIds) {
        const response = await axios.get<EventsResponse>(
          `https://www.thesportsdb.com/api/v1/json/3/eventsnextleague.php?id=${leagueId}`
        );
        
        if (response.data.events) {
          allEvents = [...allEvents, ...response.data.events];
        }
      }
      
      // Filter out null entries and limit to 10 events
      const validEvents = allEvents.filter(event => event !== null).slice(0, 10);
      setEvents(validEvents);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch events');
      console.error('Error fetching events:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  return { events, loading, error, refetch: fetchEvents };
};
