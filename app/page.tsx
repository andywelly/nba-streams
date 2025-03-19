'use client'
import { useState, useEffect } from 'react';

interface Source {
  id: string;
}

interface Game {
  title: string;
  poster: string;
  sources: Source[];
}

const NBA_TEAMS = {
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

export default function Home() {
  const [nbaGames, setNbaGames] = useState<Game[]>([]);
  const [selectedGame, setSelectedGame] = useState<string | null>(null);
  const URL = "https://streamed.su/api/matches/basketball/popular";
  const API = "https://streamed.su";
  const BASE = "https://embedme.top/embed/alpha/";

  // Function to determine if a game title includes NBA teams
  const isNBAGame = (title: string): boolean => {
    const teamsFound = Object.values(NBA_TEAMS).filter(team => 
      title.includes(team)
    );
    return teamsFound.length >= 2;
  };

  // Fetch NBA games on component mount
  useEffect(() => {
    async function fetchNBAGames() {
      try {
        const response = await fetch(URL);
        
        if (!response.ok) {
          throw new Error("Could not fetch resource");
        }
        
        const data = await response.json();
        
        // Filter only NBA games
        const nbaGamesOnly = data.filter((game: Game) => isNBAGame(game.title));
        setNbaGames(nbaGamesOnly);
      } catch (error) {
        console.error("Error fetching NBA games:", error);
      }
    }
    
    fetchNBAGames();
  }, []);

  // Handle clicking on a game
  const handleGameClick = (id: string) => {
    const streamUrl = BASE + id + "/1";
    setSelectedGame(streamUrl);
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">NBA Streams</h1>
      
      {selectedGame && (
        <div className="mb-8">
          <iframe
            title="NBA Game Stream"
            src={selectedGame}
            allowFullScreen={true}
            allow="encrypted-media; picture-in-picture;"
            width="100%"
            height="500"
            style={{border: 'none'}}
          ></iframe>
          <button 
            onClick={() => setSelectedGame(null)}
            className="mt-2 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          >
            Back to Games
          </button>
        </div>
      )}
      
      {!selectedGame && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {nbaGames.length === 0 ? (
            <p>Loading NBA games...</p>
          ) : (
            nbaGames.map((game, index) => (
              <div 
                key={index} 
                className="border rounded-lg overflow-hidden shadow-lg cursor-pointer hover:shadow-xl transition-shadow"
                onClick={() => handleGameClick(game.sources[0]?.id)}
              >
                <div className="relative h-48 w-full">
                  {game.poster ? (
                    <img
                      src={`${API}${game.poster}`}
                      alt={game.title}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="h-full w-full bg-gray-200 flex items-center justify-center">
                      <span>No Image Available</span>
                    </div>
                  )}
                </div>
                <div className="p-4">
                  <h2 className="font-semibold text-lg">{game.title}</h2>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}