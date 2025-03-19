// components/GamePlayer.tsx
interface GamePlayerProps {
    streamUrl: string
    onBack: () => void
  }
  
  export default function GamePlayer({ streamUrl, onBack }: GamePlayerProps) {
    return (
      <div className="mb-8">
        <iframe
          title="NBA Game Stream"
          src={streamUrl}
          allowFullScreen={true}
          allow="encrypted-media; picture-in-picture;"
          className="w-full h-[500px] border-none"
        ></iframe>
        <button 
          onClick={onBack}
          className="mt-4 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded transition-colors"
        >
          Back to Games
        </button>
      </div>
    )
  }