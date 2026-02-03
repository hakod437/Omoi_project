import { useState } from 'react';
import { Trash2, Sparkles } from 'lucide-react';
import { Button } from '@/app/components/ui/button';
import { Card } from '@/app/components/ui/card';
import { Badge } from '@/app/components/ui/badge';

export interface Anime {
  id: string;
  name: string;
  rating: number; // 1-6
  animationRating: number; // 1-6
  description?: string;
}

interface AnimeListProps {
  animes: Anime[];
  onDelete: (id: string) => void;
  showActions?: boolean;
}

const ratingEmojis = ['😢', '😕', '😐', '🙂', '😊', '🤩'];

export function AnimeList({ animes, onDelete, showActions = true }: AnimeListProps) {
  return (
    <div className="space-y-3">
      {animes.map((anime) => (
        <Card key={anime.id} className="p-4 hover:shadow-md transition-shadow">
          <div className="flex items-start justify-between mb-3">
            <div className="flex-1">
              <h3 className="font-semibold text-lg">{anime.name}</h3>
              <div className="flex items-center gap-4 mt-2">
                <div className="flex items-center gap-2">
                  <span className="text-2xl">{ratingEmojis[anime.rating - 1]}</span>
                  <div>
                    <p className="text-xs text-muted-foreground">Note globale</p>
                    <p className="text-sm font-medium">{anime.rating}/6</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Sparkles className="size-5 text-primary" />
                  <div>
                    <p className="text-xs text-muted-foreground">Animation</p>
                    <p className="text-sm font-medium">{anime.animationRating}/6</p>
                  </div>
                </div>
              </div>
            </div>
            {showActions && (
              <Button
                variant="ghost"
                size="icon"
                onClick={() => onDelete(anime.id)}
                className="text-destructive hover:text-destructive"
              >
                <Trash2 className="size-4" />
              </Button>
            )}
          </div>
          {anime.description && (
            <div className="mt-3 pt-3 border-t">
              <p className="text-sm text-muted-foreground italic">"{anime.description}"</p>
            </div>
          )}
        </Card>
      ))}
      {animes.length === 0 && (
        <div className="text-center py-12 text-muted-foreground">
          Aucun anime pour le moment
        </div>
      )}
    </div>
  );
}