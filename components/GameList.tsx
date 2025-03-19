// components/GameList.tsx
import { Game } from '@/types'
import GameCard from './GameCard'

interface GameListProps {
  games: Game[]
  onSelectGame: (id: string) => void
}

export default function GameList({ games, onSelectGame }: GameListProps) {
  if (games.length === 0) {
    return <p className="text-gray-500">No games scheduled</p>
  }
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {games.map((game) => (
        <GameCard 
          key={game.sources[0]?.id || `game-${game.title}`} 
          game={game} 
          onSelect={() => game.sources[0]?.id && onSelectGame(game.sources[0].id)} 
        />
      ))}
    </div>
  )
}