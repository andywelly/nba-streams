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
  
  export const NBA_TEAMS = {
    "Atlanta Hawks": "Atlanta Hawks",
    "Boston Celtics": "Boston Celtics",
    "Brooklyn Nets": "Brooklyn Nets",
    "Charlotte Hornets": "Charlotte Hornets",
    "Chicago Bulls": "Chicago Bulls",
    "Cleveland Cavaliers": "Cleveland Cavaliers",
    "Dallas Mavericks": "Dallas Mavericks",
    "Denver Nuggets": "Denver Nuggets",
    "Detroit Pistons": "Detroit Pistons",
    "Golden State Warriors": "Golden State Warriors",
    "Houston Rockets": "Houston Rockets",
    "Indiana Pacers": "Indiana Pacers",
    "Los Angeles Clippers": "Los Angeles Clippers",
    "Los Angeles Lakers": "Los Angeles Lakers",
    "Memphis Grizzlies": "Memphis Grizzlies",
    "Miami Heat": "Miami Heat",
    "Milwaukee Bucks": "Milwaukee Bucks",
    "Minnesota Timberwolves": "Minnesota Timberwolves",
    "New Orleans Pelicans": "New Orleans Pelicans",
    "New York Knicks": "New York Knicks",
    "Oklahoma City Thunder": "Oklahoma City Thunder",
    "Orlando Magic": "Orlando Magic",
    "Philadelphia 76ers": "Philadelphia 76ers",
    "Phoenix Suns": "Phoenix Suns",
    "Portland Trail Blazers": "Portland Trail Blazers",
    "Sacramento Kings": "Sacramento Kings",
    "San Antonio Spurs": "San Antonio Spurs",
    "Toronto Raptors": "Toronto Raptors",
    "Utah Jazz": "Utah Jazz",
    "Washington Wizards": "Washington Wizards",
  };