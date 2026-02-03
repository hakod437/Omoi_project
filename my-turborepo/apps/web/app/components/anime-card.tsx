import { Trash2, Sparkles, Calendar, Film, Tv, Play, Clock, Users } from 'lucide-react';
import { Button } from '@/app/components/ui/button';
import { Card } from '@/app/components/ui/card';
import { Badge } from '@/app/components/ui/badge';
import { JikanAnime } from '@/app/components/anime-search';

export interface AnimeWithUserData extends JikanAnime {
  userRating: number; // 1-6
  animationRating: number; // 1-6
  userDescription?: string;
  userAnimeId: string;
}

interface AnimeCardProps {
  anime: AnimeWithUserData;
  onDelete?: (id: string) => void;
  showActions?: boolean;
}

const ratingEmojis = ['😢', '😕', '😐', '🙂', '😊', '🤩'];

const statusColors: Record<string, string> = {
  'Currently Airing': 'bg-green-500/10 text-green-600 border-green-500/20',
  'Finished Airing': 'bg-blue-500/10 text-blue-600 border-blue-500/20',
  'Not yet aired': 'bg-yellow-500/10 text-yellow-600 border-yellow-500/20',
};

export function AnimeCard({ anime, onDelete, showActions = true }: AnimeCardProps) {
  const formatDate = (dateString?: string) => {
    if (!dateString) return null;
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', { year: 'numeric', month: 'short', day: 'numeric' });
  };

  const allGenres = [
    ...(anime.genres || []),
    ...(anime.themes || []),
    ...(anime.demographics || []),
  ];

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-all">
      <div className="flex flex-col md:flex-row gap-4 p-4">
        {/* Image */}
        <div className="flex-shrink-0">
          <img
            src={anime.images.jpg.large_image_url || anime.images.jpg.image_url}
            alt={anime.title}
            className="w-full md:w-48 h-64 object-cover rounded-lg"
          />
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          {/* Header */}
          <div className="flex items-start justify-between gap-3 mb-3">
            <div className="flex-1 min-w-0">
              <h3 className="font-bold text-xl mb-1 line-clamp-2">{anime.title}</h3>
              {anime.title_english && anime.title_english !== anime.title && (
                <p className="text-sm text-muted-foreground line-clamp-1">
                  {anime.title_english}
                </p>
              )}
              {anime.title_japanese && (
                <p className="text-sm text-muted-foreground line-clamp-1">
                  {anime.title_japanese}
                </p>
              )}
            </div>
            {showActions && onDelete && (
              <Button
                variant="ghost"
                size="icon"
                onClick={() => onDelete(anime.userAnimeId)}
                className="text-destructive hover:text-destructive flex-shrink-0"
              >
                <Trash2 className="size-4" />
              </Button>
            )}
          </div>

          {/* Metadata */}
          <div className="flex flex-wrap gap-2 mb-3">
            {anime.type && (
              <Badge variant="secondary" className="gap-1">
                {anime.type === 'TV' ? <Tv className="size-3" /> : <Film className="size-3" />}
                {anime.type}
              </Badge>
            )}
            {anime.status && (
              <Badge className={statusColors[anime.status] || 'bg-muted'}>
                {anime.status}
              </Badge>
            )}
            {anime.episodes && (
              <Badge variant="outline" className="gap-1">
                <Play className="size-3" />
                {anime.episodes} ép.
              </Badge>
            )}
            {anime.duration && (
              <Badge variant="outline" className="gap-1">
                <Clock className="size-3" />
                {anime.duration}
              </Badge>
            )}
            {anime.season && anime.year && (
              <Badge variant="outline" className="gap-1">
                <Calendar className="size-3" />
                {anime.season} {anime.year}
              </Badge>
            )}
          </div>

          {/* User Ratings */}
          <div className="flex items-center gap-4 mb-3 p-3 bg-primary/5 rounded-lg">
            <div className="flex items-center gap-2">
              <span className="text-3xl">{ratingEmojis[anime.userRating - 1]}</span>
              <div>
                <p className="text-xs text-muted-foreground">Note globale</p>
                <p className="text-sm font-bold">{anime.userRating}/6</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Sparkles className="size-6 text-primary" />
              <div>
                <p className="text-xs text-muted-foreground">Animation</p>
                <p className="text-sm font-bold">{anime.animationRating}/6</p>
              </div>
            </div>
          </div>

          {/* Synopsis */}
          {anime.synopsis && (
            <p className="text-sm text-muted-foreground line-clamp-3 mb-3">
              {anime.synopsis.replace('[Written by MAL Rewrite]', '')}
            </p>
          )}

          {/* User Description */}
          {anime.userDescription && (
            <div className="mb-3 p-3 bg-accent/50 rounded-lg border border-border/50">
              <p className="text-xs text-muted-foreground mb-1">Ma note personnelle</p>
              <p className="text-sm italic">"{anime.userDescription}"</p>
            </div>
          )}

          {/* Additional Info */}
          <div className="grid grid-cols-2 gap-2 text-xs mb-3">
            {anime.studios && anime.studios.length > 0 && (
              <div>
                <span className="text-muted-foreground">Studio: </span>
                <span className="font-medium">
                  {anime.studios.map((s) => s.name).join(', ')}
                </span>
              </div>
            )}
            {anime.source && (
              <div>
                <span className="text-muted-foreground">Source: </span>
                <span className="font-medium">{anime.source}</span>
              </div>
            )}
            {anime.aired?.from && (
              <div>
                <span className="text-muted-foreground">Début: </span>
                <span className="font-medium">{formatDate(anime.aired.from)}</span>
              </div>
            )}
            {anime.aired?.to && (
              <div>
                <span className="text-muted-foreground">Fin: </span>
                <span className="font-medium">{formatDate(anime.aired.to)}</span>
              </div>
            )}
            {anime.popularity && (
              <div>
                <span className="text-muted-foreground">Popularité: </span>
                <span className="font-medium">#{anime.popularity}</span>
              </div>
            )}
            {anime.rank && (
              <div>
                <span className="text-muted-foreground">Classement: </span>
                <span className="font-medium">#{anime.rank}</span>
              </div>
            )}
          </div>

          {/* Genres */}
          {allGenres.length > 0 && (
            <div className="flex flex-wrap gap-1.5">
              {allGenres.map((genre, index) => (
                <Badge
                  key={index}
                  variant="outline"
                  className="text-xs bg-primary/5 hover:bg-primary/10"
                >
                  {genre.name}
                </Badge>
              ))}
            </div>
          )}
        </div>
      </div>
    </Card>
  );
}
