// components/GamePlayer.tsx
interface GamePlayerProps {
  streamUrl: string
  onBack: () => void
}

export default function GamePlayer({ streamUrl, onBack }: GamePlayerProps) {
  return (
    <div className="flex flex-col items-center mb-8 relative aspect-video">
      <div style={{ width: '80%', maxWidth: '1200px' }}>
        <div style={{ position: 'relative', paddingTop: '56.25%' }}>
          <iframe
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
        onClick={onBack}
        className="mt-4 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded"
      >
        Back to Games
      </button>
    </div>
  );
}