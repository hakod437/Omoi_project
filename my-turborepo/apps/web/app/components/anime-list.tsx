import { Trash2, Sparkles } from 'lucide-react';
import { AnimeCard } from '@/app/components/anime-card';
import { AnimeWithUserData } from '@/types';

interface AnimeListProps {
  animes: AnimeWithUserData[];
  onDelete: (id: string) => void;
  showActions?: boolean;
}

export function AnimeList({ animes, onDelete, showActions = true }: AnimeListProps) {
  return (
    <div className="space-y-4">
      {animes.map((anime, index) => (
        <AnimeCard
          key={anime.userAnimeId || anime.mal_id}
          anime={anime}
          onDelete={onDelete}
          showActions={showActions}
          priority={index < 2}
        />
      ))}
      {animes.length === 0 && (
        <div className="text-center py-12 text-muted-foreground">
          Aucun anime pour le moment
        </div>
      )}
    </div>
  );
}