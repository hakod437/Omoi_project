import { Trash2, Sparkles, Calendar, Film, Tv, Play, Clock, Users } from 'lucide-react';
import { Button } from '@/app/components/ui/button';
import { Card } from '@/app/components/ui/card';
import { Badge } from '@/app/components/ui/badge';
import { JikanAnime } from '@/app/components/anime-search';
import { RATING_EMOJIS, STATUS_COLORS } from '@/lib/constants';

export interface AnimeWithUserData extends Partial<JikanAnime> {
  title: string;
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

// Utilitaire global
const formatDate = (dateString?: string) => {
  if (!dateString) return null;
  const date = new Date(dateString);
  return date.toLocaleDateString('fr-FR', { year: 'numeric', month: 'short', day: 'numeric' });
};

// --- ATOMES (Composants UI) ---

const AnimeImage = ({ src, alt }: { src?: string; alt: string }) => {
  if (!src) return null;
  return (
    <div className="flex-shrink-0">
      <img src={src} alt={alt} className="w-full md:w-48 h-64 object-cover rounded-lg" />
    </div>
  );
};

// Interface explicite pour les badges (ne dépend pas de AnimeWithUserData)
interface AnimeBadgesProps {
  type?: string;
  status?: string;
  episodes?: number;
  duration?: string;
  season?: string;
  year?: number;
}

const AnimeBadges = ({ type, status, episodes, duration, season, year }: AnimeBadgesProps) => {
  const hasBadges = type || status || episodes || duration || (season && year);
  if (!hasBadges) return null;

  return (
    <div className="flex flex-wrap gap-2 mb-3">
      {type && (
        <Badge variant="secondary" className="gap-1">
          {type === 'TV' ? <Tv className="size-3" /> : <Film className="size-3" />}
          {type}
        </Badge>
      )}
      {status && (
        <Badge className={STATUS_COLORS[status] || 'bg-muted'}>
          {status}
        </Badge>
      )}
      {episodes && (
        <Badge variant="outline" className="gap-1">
          <Play className="size-3" />
          {episodes} ép.
        </Badge>
      )}
      {duration && (
        <Badge variant="outline" className="gap-1">
          <Clock className="size-3" />
          {duration}
        </Badge>
      )}
      {season && year && (
        <Badge variant="outline" className="gap-1">
          <Calendar className="size-3" />
          {season} {year}
        </Badge>
      )}
    </div>
  );
};

// --- COMPOSANT PARENT ---

export function AnimeCard({ anime, onDelete, showActions = true }: AnimeCardProps) {
  // Calcul local (Scope: dépend de 'anime')
  const allGenres = [
    ...(anime.genres || []),
    ...(anime.themes || []),
    ...(anime.demographics || []),
  ];

  const imageSrc = anime.images?.jpg?.large_image_url || anime.images?.jpg?.image_url;

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-all">
      <div className="flex flex-col md:flex-row gap-4 p-4">
        {/* Atome Image */}
        <AnimeImage src={imageSrc} alt={anime.title} />

        <div className="flex-1 min-w-0">
          {/* Header (Titre + Delete) */}
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

          {/* Atome Badges */}
          <AnimeBadges
            type={anime.type}
            status={anime.status}
            episodes={anime.episodes}
            duration={anime.duration}
            season={anime.season}
            year={anime.year}
          />

          {/* User Ratings */}
          <div className="flex items-center gap-4 mb-3 p-3 bg-primary/5 rounded-lg">
            <div className="flex items-center gap-2">
              <span className="text-3xl">{RATING_EMOJIS[anime.userRating - 1]}</span>
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
