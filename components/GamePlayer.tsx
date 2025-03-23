'use client'; // Add this directive if not already present

import React, { useRef } from 'react';
import { useRouter } from 'next/navigation'; // Import useRouter

interface GamePlayerProps {
  streamUrl: string;
}

export default function GamePlayer({ streamUrl }: GamePlayerProps) {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const router = useRouter(); // Initialize the router

  // Handle the back button click
  const handleBackClick = (e: React.MouseEvent) => {
    e.preventDefault(); // Prevent default behavior (if any)
    router.back(); // Use the browser's back functionality
  };

  return (
    <div className="flex flex-col items-center mb-8 relative aspect-video">
      <div style={{ width: '80%', maxWidth: '1200px' }}>
        <div style={{ position: 'relative', paddingTop: '56.25%' }}>
          <iframe
            ref={iframeRef}
            title="NBA Game Stream"
            src={streamUrl}
            allowFullScreen={true}
            allow="encrypted-media; picture-in-picture;"
            style={{ 
              position: 'absolute', 
              top: 0, 
              left: 0, 
              width: '100%', 
              height: '100%', 
              border: 'none' 
            }}
          ></iframe>
        </div>
      </div>
      <button 
        onClick={handleBackClick}
        className="mt-4 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded"
      >
        Back to Games
      </button>
    </div>
  );
}