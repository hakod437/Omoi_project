import { Trash2, Sparkles } from 'lucide-react';
import { AnimeCard, AnimeWithUserData } from '@/app/components/anime-card';

interface AnimeListProps {
  animes: AnimeWithUserData[];
  onDelete: (id: string) => void;
  showActions?: boolean;
}

export function AnimeList({ animes, onDelete, showActions = true }: AnimeListProps) {
  return (
    <div className="space-y-4">
      {animes.map((anime) => (
        <AnimeCard
          key={anime.userAnimeId || anime.mal_id}
          anime={anime}
          onDelete={onDelete}
          showActions={showActions}
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