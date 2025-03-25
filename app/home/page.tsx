'use client';

import { Suspense, useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';
import GameList from '@/components/GameList';
import { fetchNBAGames } from '@/lib/api';
import { GroupedGames, Game, NBA_TEAMS } from '@/types';
import { categorizeGamesByDate } from '@/lib/utils';

function HomeContent() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const searchParams = useSearchParams();
  const isGuestMode = searchParams.get('guest') === 'true';
  const [showGuestBanner, setShowGuestBanner] = useState(true);

  const [groupedGames, setGroupedGames] = useState<GroupedGames>({
    today: [],
    tomorrow: [],
    later: [],
  });
  const [favoriteTeamGames, setFavoriteTeamGames] = useState<Game[]>([]);
  const [watchlistTeamGames, setWatchlistTeamGames] = useState<Game[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [favoriteTeam, setFavoriteTeam] = useState<string | null>(null);
  const [watchList, setWatchList] = useState<string[]>([]);

  useEffect(() => {
    if (status === 'unauthenticated' && !isGuestMode) {
      router.push('/');
    }
  }, [status, router, isGuestMode]);

  useEffect(() => {
    const loadGames = async () => {
      try {
        setIsLoading(true);
        setError(null);

        // Only fetch profile if there's a valid session and not in guest mode
        if (session?.user?.id && !isGuestMode) {
          try {
            const response = await fetch('/api/profile');
            if (response.ok) {
              const userData = await response.json();
              
              // Safely set favorite team and watchlist
              const fetchedFavoriteTeam = userData.favoriteTeam || null;
              const fetchedWatchList = userData.watchList || [];

              // Use setter functions to update state
              setFavoriteTeam(fetchedFavoriteTeam);
              setWatchList(fetchedWatchList);
            } else {
              console.error('Failed to fetch profile:', response.statusText);
            }
          } catch (err) {
            console.error('Error fetching user profile:', err);
          }
        }

        // Fetch NBA games
        const nbaGames = await fetchNBAGames();
        const grouped = categorizeGamesByDate(nbaGames);
        setGroupedGames(grouped);

        // Filter games for favorite team
        if (favoriteTeam) {
          const teamGames = getTeamGames(grouped, favoriteTeam);
          setFavoriteTeamGames(teamGames);
        }

        // Filter games for watchlist teams
        if (watchList.length > 0) {
          const allWatchlistGames: Game[] = [];
          watchList.forEach(team => {
            const teamGames = getTeamGames(grouped, team);
            allWatchlistGames.push(...teamGames);
          });

          setWatchlistTeamGames(allWatchlistGames);
        }
      } catch (err) {
        setError('Failed to load NBA games. Please try again later.');
        console.error('Error loading games:', err);
      } finally {
        setIsLoading(false);
      }
    };

    // Only load games if there's a session or guest mode is active
    if (session || isGuestMode) {
      loadGames();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session, isGuestMode]);

  const getTeamGames = (grouped: GroupedGames, team: string): Game[] => {
    const teamName = NBA_TEAMS[team as keyof typeof NBA_TEAMS];
    return [
      ...grouped.today.filter(game => game.title.includes(teamName)),
      ...grouped.tomorrow.filter(game => game.title.includes(teamName)),
      ...grouped.later.filter(game => game.title.includes(teamName)),
    ];
  };

  const handleGameSelect = (gameId: string) => {
    router.push(`/player?id=${gameId}`);
  };

  const handleDismissGuestBanner = () => {
    setShowGuestBanner(false);
  };

  if (status === 'loading' && !isGuestMode) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-700"></div>
      </div>
    );
  }

  if (!session && !isGuestMode) {
    return null;
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
      {isGuestMode && showGuestBanner && (
        <div className="mb-8">
          <div className="mb-4 bg-yellow-100 border-l-4 border-yellow-500 p-4 rounded relative">
            <div className="flex justify-between items-center">
              <p className="text-yellow-700">
                You are viewing in guest mode. <a href="/login" className="underline font-medium">Log in</a> for a
                personalized experience with your favorite team&apos;s games.
              </p>
              <button
                onClick={handleDismissGuestBanner}
                className="text-yellow-700 hover:text-yellow-900"
                aria-label="Dismiss notification"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>
      )}

      {!isGuestMode && favoriteTeam && favoriteTeamGames.length > 0 && (
        <section className="mb-8">
          <h2 className="text-2xl font-bold mb-4">
            <span className="font-bold">{NBA_TEAMS[favoriteTeam as keyof typeof NBA_TEAMS]}</span> Games
          </h2>
          <GameList games={favoriteTeamGames} onSelectGame={handleGameSelect} />
        </section>
      )}

      {!isGuestMode && favoriteTeam && favoriteTeamGames.length === 0 && (
        <section className="mb-8">
          <h3 className="text-xl font-semibold mb-4">
            No <span className="font-bold">{NBA_TEAMS[favoriteTeam as keyof typeof NBA_TEAMS]}</span> Games Today
          </h3>
        </section>
      )}

      {!isGuestMode && watchList && watchlistTeamGames.length > 0 && (
        <section className="mb-8">
          <h2 className="text-2xl font-bold mb-4">Watchlist Games</h2>
          <div className="text-sm text-gray-600 mb-4">
            {watchList.map(team => NBA_TEAMS[team as keyof typeof NBA_TEAMS]).join(', ')}
          </div>
          <GameList games={watchlistTeamGames} onSelectGame={handleGameSelect} />
        </section>
      )}

      <div className="space-y-8">
        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-700"></div>
          </div>
        ) : (
          <>
            <section>
              <h2 className="text-2xl font-bold mb-4">Today&apos;s Games</h2>
              <GameList games={groupedGames.today} onSelectGame={handleGameSelect} />
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">Tomorrow&apos;s Games</h2>
              <GameList games={groupedGames.tomorrow} onSelectGame={handleGameSelect} />
            </section>

            {groupedGames.later.length > 0 && (
              <section>
                <h2 className="text-2xl font-bold mb-4">Upcoming Games</h2>
                <GameList games={groupedGames.later} onSelectGame={handleGameSelect} />
              </section>
            )}
          </>
        )}
      </div>
    </main>
  );
}

export default function NbaHomePage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <HomeContent />
    </Suspense>
  );
}