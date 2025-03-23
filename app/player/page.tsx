'use client';

import { Suspense, useEffect, useState } from 'react'; // Import Suspense
import { useRouter, useSearchParams } from 'next/navigation';
import GamePlayer from '@/components/GamePlayer';

// Component that uses useSearchParams
function PlayerContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const gameId = searchParams.get('id');
  const [streamUrl, setStreamUrl] = useState<string | null>(null);

  useEffect(() => {
    if (!gameId) {
      router.push('/home'); // Redirect if no game ID is provided
      return;
    }
    
    // Create the stream URL based on the game ID
    setStreamUrl(`https://embedme.top/embed/alpha/${gameId}/1`);
  }, [gameId, router]);

  if (!streamUrl) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-700"></div>
      </div>
    );
  }

  return (
    <main className="container mx-auto p-4">
      <GamePlayer streamUrl={streamUrl} />
    </main>
  );
}

// Main Player Page Component
export default function PlayerPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <PlayerContent />
    </Suspense>
  );
}