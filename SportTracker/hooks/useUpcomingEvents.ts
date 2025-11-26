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
  strSquare?: string;
  strPoster?: string;
  strBanner?: string;
  strVenue?: string;
  strStatus?: string;
  strHomeTeamBadge?: string;
  strAwayTeamBadge?: string;
  intHomeScore?: string;
  intAwayScore?: string;
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
      
      // Fetch next 15 upcoming events from English Premier League (ID: 4328)
      const response = await axios.get<EventsResponse>(
        `https://www.thesportsdb.com/api/v1/json/3/eventsnextleague.php?id=4328`
      );
      
      if (response.data.events) {
        // Filter and sort upcoming events
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        
        const upcomingEvents = response.data.events
          .filter(event => {
            if (!event || !event.dateEvent) return false;
            const eventDate = new Date(event.dateEvent);
            return eventDate >= today; // Only future events
          })
          .sort((a, b) => {
            const dateA = new Date(a.dateEvent || '');
            const dateB = new Date(b.dateEvent || '');
            return dateA.getTime() - dateB.getTime(); // Nearest first
          })
          .slice(0, 15);
        
        setEvents(upcomingEvents);
      } else {
        setEvents([]);
      }
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
