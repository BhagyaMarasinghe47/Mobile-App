import axios from 'axios';

const API_BASE = 'https://www.thesportsdb.com/api/v1/json/3';

// Interfaces
export interface League {
  idLeague: string;
  strLeague: string;
  strSport: string;
}

export interface Team {
  idTeam: string;
  strTeam: string;
  strTeamBadge?: string;
  strLeague?: string;
}

export interface Player {
  idPlayer: string;
  strPlayer: string;
  strTeam?: string;
  strPosition?: string;
  strThumb?: string;
}

export interface Event {
  idEvent: string;
  strEvent: string;
  dateEvent?: string;
  strTime?: string;
}

// Fetch all leagues and filter cricket
export async function getAllLeagues(): Promise<League[]> {
  const url = `${API_BASE}/all_leagues.php`;
  const { data } = await axios.get(url);
  const leagues: League[] = data.leagues || [];
  return leagues.filter(l => l.strSport === 'Cricket');
}

// Teams by league ID
export async function getTeamsByLeagueId(leagueId: string): Promise<Team[]> {
  const url = `${API_BASE}/lookup_all_teams.php?id=${leagueId}`;
  const { data } = await axios.get(url);
  return data.teams || [];
}

// Players by team ID
export async function getPlayersByTeamId(teamId: string): Promise<Player[]> {
  const url = `${API_BASE}/lookup_all_players.php?id=${teamId}`;
  const { data } = await axios.get(url);
  return data.player || [];
}

// Next events by league ID
export async function getNextEvents(leagueId: string): Promise<Event[]> {
  const url = `${API_BASE}/eventsnextleague.php?id=${leagueId}`;
  const { data } = await axios.get(url);
  return data.events || [];
}

export const cricketApi = {
  getAllLeagues,
  getTeamsByLeagueId,
  getPlayersByTeamId,
  getNextEvents,
};

export default cricketApi;

// Get single player by id
export async function getPlayerById(playerId: string) {
  const url = `${API_BASE}/lookupplayer.php?id=${playerId}`;
  const { data } = await axios.get(url);
  return data.players ? data.players[0] : null;
}
