'use client'

import { useState, useEffect } from 'react';
import { useSession, signOut } from 'next-auth/react';
import GameList from '@/components/gameList';
import GamePlayer from '@/components/gamePlayer';
import { fetchNBAGames } from '@/lib/api';
import { GroupedGames } from '@/types';
import { categorizeGamesByDate } from '@/lib/utils';
import '@/app/globals.css';

export default function HomePage() {
  const { data: session } = useSession();
  const [groupedGames, setGroupedGames] = useState<GroupedGames>({
    today: [],
    tomorrow: [],
    later: []
  });
  const [selectedGame, setSelectedGame] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch and process NBA games on component mount
  useEffect(() => {
    const loadGames = async () => {
      try {
        setIsLoading(true);
        const nbaGames = await fetchNBAGames();
        const grouped = categorizeGamesByDate(nbaGames);
        setGroupedGames(grouped);
      } catch (err) {
        setError('Failed to load NBA games. Please try again later.');
        console.error('Error loading games:', err);
      } finally {
        setIsLoading(false);
      }
    };

    if (session) {
      loadGames();
    }
  }, [session]);

  const handleGameSelect = (gameId: string) => {
    setSelectedGame(`https://embedme.top/embed/alpha/${gameId}/1`);
  };

  const handleBackToGames = () => {
    setSelectedGame(null);
  };

  if (error) {
    return (
      <div className="container mx-auto p-4">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          <p>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <main className="container mx-auto p-4">
      {/* Authentication Section */}
      {session ? (
        <>


          {/* Game Content - Only show when signed in */}
          {selectedGame ? (
            <GamePlayer
              streamUrl={selectedGame}
              onBack={handleBackToGames}
            />
          ) : (
            <div className="space-y-8">
              {isLoading ? (
                <div className="flex justify-center items-center h-64">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-700"></div>
                </div>
              ) : (
                <>
                  <section>
                    <h2 className="text-2xl font-bold mb-4">Today&apos;s Games</h2>
                    <GameList
                      games={groupedGames.today}
                      onSelectGame={handleGameSelect}
                    />
                  </section>

                  <section>
                    <h2 className="text-2xl font-bold mb-4">Tomorrow&apos;s Games</h2>
                    <GameList
                      games={groupedGames.tomorrow}
                      onSelectGame={handleGameSelect}
                    />
                  </section>

                  {groupedGames.later.length > 0 && (
                    <section>
                      <h2 className="text-2xl font-bold mb-4">Upcoming Games</h2>
                      <GameList
                        games={groupedGames.later}
                        onSelectGame={handleGameSelect}
                      />
                    </section>
                  )}
                </>
              )}
            </div>
          )}
        </>
      ) : (
        <div className="flex flex-col items-center justify-center gap-4">
          <p className="mb-2">Please sign in to access NBA streams.</p>
          <button
            onClick={() => window.location.href = '/login'}
            className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded"
          >
            Sign In
          </button>
          <p>Don&apos;t have an account?</p>
          <button
            onClick={() => window.location.href = '/register'}
            className="bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded"
          >
            Register
          </button>
         </div>

      )}
    </main>
  );
}