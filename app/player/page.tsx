'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import GamePlayer from '@/components/GamePlayer';

export default function PlayerPage() {
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