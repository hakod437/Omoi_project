import Image from 'next/image';
import { Trash2, Sparkles, Calendar, Film, Tv, Play, Clock, Users } from 'lucide-react';
import { Button } from '@/app/components/ui/button';
import { Card } from '@/app/components/ui/card';
import { Badge } from '@/app/components/ui/badge';
import { RATING_EMOJIS, STATUS_COLORS } from '@/lib/constants';
import { AnimeWithUserData } from '@/types';

interface AnimeCardProps {
  anime: AnimeWithUserData;
  onDelete?: (id: string) => void;
  showActions?: boolean;
  priority?: boolean;
}

// ... (formatDate remains the same)

// --- ATOMES (Composants UI) ---

const AnimeImage = ({ src, alt, priority }: { src?: string; alt: string; priority?: boolean }) => {
  if (!src) return null;
  return (
    <div className="flex-shrink-0 relative w-full md:w-48 h-64">
      <Image
        src={src}
        alt={alt}
        fill
        priority={priority}
        className="object-cover rounded-lg"
        sizes="(max-width: 768px) 100vw, 192px"
      />
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
  studios?: Array<{ name: string }>;
  source?: string;
  rating?: string;
  rank?: number;
  popularity?: number;
  aired?: { string?: string };
}

const AnimeBadges = ({ type, status, episodes, duration, season, year, studios, source, rating, rank, popularity, aired }: AnimeBadgesProps) => {
  const hasBadges = type || status || (episodes !== undefined && episodes !== null) || duration || (season && year) || (studios && studios.length > 0) || source || rank || popularity || aired;
  if (!hasBadges) return null;

  return (
    <div className="flex flex-wrap gap-2 mb-3">
      {rank && (
        <Badge className="bg-yellow-500 text-white border-none font-bold">
          #{rank} Rank
        </Badge>
      )}
      {popularity && (
        <Badge variant="secondary" className="bg-primary/10 text-primary border-primary/20">
          #{popularity} Pop.
        </Badge>
      )}
      {type && (
        <Badge variant="secondary" className="gap-1">
          {type === 'TV' ? <Tv className="size-3" /> : <Film className="size-3" />}
          {type}
        </Badge>
      )}
      {aired?.string && (
        <Badge variant="outline" className="text-[10px] opacity-80">
          Aired: {aired.string}
        </Badge>
      )}
      {rating && (
        <Badge variant="outline" className="text-[10px] opacity-60">
          {rating}
        </Badge>
      )}
      {status && (
        <Badge className={`${STATUS_COLORS[status] || 'bg-muted'} border`}>
          {status}
        </Badge>
      )}
      {studios && studios.length > 0 && (
        <Badge variant="outline" className="gap-1 bg-primary/5">
          <Users className="size-3" />
          {studios.at(0)?.name}
        </Badge>
      )}
      {source && (
        <Badge variant="outline" className="text-[10px] uppercase opacity-70">
          Source: {source}
        </Badge>
      )}
      {(episodes !== undefined && episodes !== null) && (
        <Badge variant="outline" className="gap-1">
          <Play className="size-3" />
          {episodes === 0 ? 'En cours' : `${episodes} ép.`}
        </Badge>
      )}
      {duration && (
        <Badge variant="outline" className="gap-1 text-xs">
          <Clock className="size-3" />
          {duration.replace(' per ep', '')}
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

export function AnimeCard({ anime, onDelete, showActions = true, priority = false }: AnimeCardProps) {
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
        <AnimeImage src={imageSrc} alt={anime.title} priority={priority} />

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
            studios={anime.studios}
            source={anime.source}
            rating={anime.rating}
            rank={anime.rank}
            popularity={anime.popularity}
            aired={anime.aired}
          />

          {/* User Ratings & Stats */}
          <div className="flex items-center gap-4 mb-3 p-3 bg-primary/5 rounded-lg border border-primary/10">
            <div className="flex items-center gap-2 pr-4 border-r border-border/50">
              <span className="text-3xl">{RATING_EMOJIS[anime.userRating - 1]}</span>
              <div>
                <p className="text-[10px] uppercase font-bold text-muted-foreground">Ma Note</p>
                <p className="text-sm font-bold">{anime.userRating}/6</p>
              </div>
            </div>

            <div className="flex items-center gap-2 pr-4 border-r border-border/50">
              <Sparkles className="size-6 text-primary" />
              <div>
                <p className="text-[10px] uppercase font-bold text-muted-foreground">Animation</p>
                <p className="text-sm font-bold">{anime.animationRating}/6</p>
              </div>
            </div>

            {anime.score && (
              <div className="flex items-center gap-2">
                <div className="bg-yellow-500/10 text-yellow-600 px-1.5 py-0.5 rounded text-[10px] font-bold">MAL</div>
                <div>
                  <p className="text-[10px] uppercase font-bold text-muted-foreground">Score</p>
                  <p className="text-sm font-bold">{anime.score}</p>
                </div>
              </div>
            )}
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
