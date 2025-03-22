'use client'

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';
import GameList from '@/components/GameList';
import GamePlayer from '@/components/GamePlayer';
import { fetchNBAGames } from '@/lib/api';
import { GroupedGames } from '@/types';
import { categorizeGamesByDate } from '@/lib/utils';

export default function NbaHomePage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const searchParams = useSearchParams();
  const isGuestMode = searchParams.get('guest') === 'true';
  const [showGuestBanner, setShowGuestBanner] = useState(true);
  
  const [groupedGames, setGroupedGames] = useState<GroupedGames>({
    today: [],
    tomorrow: [],
    later: []
  });
  const [selectedGame, setSelectedGame] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Redirect unauthorized users who are not guests
  useEffect(() => {
    if (status === 'unauthenticated' && !isGuestMode) {
      router.push('/');
    }
  }, [status, router, isGuestMode]);

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

    // Allow loading games for both authenticated users and guests
    if (session || isGuestMode) {
      loadGames();
    }
  }, [session, isGuestMode]);

  const handleGameSelect = (gameId: string) => {
    setSelectedGame(`https://embedme.top/embed/alpha/${gameId}/1`);
  };

  const handleBackToGames = () => {
    setSelectedGame(null);
  };
  
  const handleDismissGuestBanner = () => {
    setShowGuestBanner(false);
  };

  // Show loading state while checking authentication
  if (status === 'loading' && !isGuestMode) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-700"></div>
      </div>
    );
  }

  // Only render content for authenticated users or guests
  if (!session && !isGuestMode) {
    return null; // Will redirect via useEffect
  }

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
      {/* Guest mode indicator */}
      {isGuestMode && showGuestBanner && (
        <div className="mb-4 bg-yellow-100 border-l-4 border-yellow-500 p-4 rounded relative">
          <div className="flex justify-between items-center">
            <p className="text-yellow-700">
              You are viewing in guest mode. <a href="/login" className="underline font-medium">Sign in</a> for a personalized experience.
            </p>
            <button 
              onClick={handleDismissGuestBanner}
              className="text-yellow-700 hover:text-yellow-900"
              aria-label="Dismiss notification"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </button>
          </div>
        </div>
      )}
      
      {/* Game Content */}
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
    </main>
  );
}