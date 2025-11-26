// Cricket team types from TheSportsDB API
export interface CricketTeam {
  idTeam: string;
  strTeam: string;
  strTeamShort?: string;
  strAlternate?: string;
  intFormedYear?: string;
  strSport: string;
  strLeague?: string;
  strStadium?: string;
  strStadiumThumb?: string;
  strStadiumDescription?: string;
  strStadiumLocation?: string;
  intStadiumCapacity?: string;
  strWebsite?: string;
  strFacebook?: string;
  strTwitter?: string;
  strInstagram?: string;
  strDescriptionEN?: string;
  strCountry?: string;
  strTeamBadge?: string;
  strTeamJersey?: string;
  strTeamLogo?: string;
  strYoutube?: string;
}

export interface CricketTeamsResponse {
  teams: CricketTeam[];
}

export type TeamStatus = 'Active' | 'Popular' | 'Upcoming';
