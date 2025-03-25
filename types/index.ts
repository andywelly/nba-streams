// types/index.ts
export interface Source {
  id: string;
}

export interface Game {
  title: string;
  poster: string;
  sources: Source[];
  date: string;
}

export interface GroupedGames {
  today: Game[];
  tomorrow: Game[];
  later: Game[];
}

export interface User {
  id: string;
  email: string;
  username: string | null;
  favoriteTeam: NBATeam | null;
  watchList: NBATeam[];
  provider: string | null;
  providerId?: string | null;
}

export const NBA_TEAMS = {
  "ATL": "Atlanta Hawks",
  "BOS": "Boston Celtics",
  "BKN": "Brooklyn Nets",
  "CHA": "Charlotte Hornets",
  "CHI": "Chicago Bulls",
  "CLE": "Cleveland Cavaliers",
  "DAL": "Dallas Mavericks",
  "DEN": "Denver Nuggets",
  "DET": "Detroit Pistons",
  "GSW": "Golden State Warriors",
  "HOU": "Houston Rockets",
  "IND": "Indiana Pacers",
  "LAC": "LA Clippers",
  "LAL": "Los Angeles Lakers",
  "MEM": "Memphis Grizzlies",
  "MIA": "Miami Heat",
  "MIL": "Milwaukee Bucks",
  "MIN": "Minnesota Timberwolves",
  "NOP": "New Orleans Pelicans",
  "NYK": "New York Knicks",
  "OKC": "Oklahoma City Thunder",
  "ORL": "Orlando Magic",
  "PHI": "Philadelphia 76ers",
  "PHX": "Phoenix Suns",
  "POR": "Portland Trail Blazers",
  "SAC": "Sacramento Kings",
  "SAS": "San Antonio Spurs",
  "TOR": "Toronto Raptors",
  "UTA": "Utah Jazz",
  "WAS": "Washington Wizards"
} as const;

export type NBATeam = keyof typeof NBA_TEAMS;
