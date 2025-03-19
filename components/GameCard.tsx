// components/GameCard.tsx
import { Game } from '@/types'
import { formatGameDate } from '@/lib/utils'

interface GameCardProps {
  game: Game
  onSelect: () => void
}

export default function GameCard({ game, onSelect }: GameCardProps) {
  const API_BASE = "https://streamed.su"
  
  return (
    <div 
      className="border rounded-lg overflow-hidden shadow-lg cursor-pointer hover:shadow-xl transition-shadow"
      onClick={onSelect}
    >
      <div className="relative h-48 w-full">
        {game.poster ? (
          <img
            src={`${API_BASE}${game.poster}`}
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
        <p className="text-gray-600 text-sm mt-1">
          {formatGameDate(game.date)}
        </p>
      </div>
    </div>
  )
}