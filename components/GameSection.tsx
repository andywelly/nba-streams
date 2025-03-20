'use client';

import GameList from '@/components/GameList';
import { Game } from '@/types';

interface GameSectionProps {
  title: string;
  games: Game[];
  onSelectGame: (gameId: string) => void;
}

export default function GameSection({ title, games, onSelectGame }: GameSectionProps) {
  return (
    <section>
      <h2 className="text-2xl font-bold mb-4">{title}</h2>
      <GameList games={games} onSelectGame={onSelectGame} />
    </section>
  );
}