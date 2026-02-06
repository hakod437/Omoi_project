import { useState, useEffect } from 'react';
import Image from 'next/image';
import { Search, Loader2 } from 'lucide-react';
import { Input } from '@/app/components/ui/input';
import { Card } from '@/app/components/ui/card';
import { Button } from '@/app/components/ui/button';
import { Badge } from '@/app/components/ui/badge';

export interface JikanAnime {
  mal_id: number;
  title: string;
  title_english?: string;
  title_japanese?: string;
  images: {
    jpg: {
      image_url: string;
      large_image_url: string;
    };
  };
  synopsis?: string;
  type?: string;
  episodes?: number;
  status?: string;
  aired?: {
    from?: string;
    to?: string;
    string?: string;
  };
  season?: string;
  year?: number;
  studios?: Array<{ name: string }>;
  genres?: Array<{ name: string }>;
  themes?: Array<{ name: string }>;
  demographics?: Array<{ name: string }>;
  source?: string;
  duration?: string;
  rating?: string;
  score?: number;
  scored_by?: number;
  rank?: number;
  popularity?: number;
}

interface AnimeSearchProps {
  onSelectAnime: (anime: JikanAnime) => void;
}

export function AnimeSearch({ onSelectAnime }: AnimeSearchProps) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<JikanAnime[]>([]);
  const [loading, setLoading] = useState(false);
  const [showResults, setShowResults] = useState(false);

  useEffect(() => {
    if (query.length < 3) {
      setResults([]);
      setShowResults(false);
      return;
    }

    const timeoutId = setTimeout(async () => {
      setLoading(true);
      try {
        const response = await fetch(
          `https://api.jikan.moe/v4/anime?q=${encodeURIComponent(query)}&limit=10`
        );
        const data = await response.json();
        setResults(data.data || []);
        setShowResults(true);
      } catch (error) {
        console.error('Error fetching anime:', error);
        setResults([]);
      } finally {
        setLoading(false);
      }
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [query]);

  const handleSelect = (anime: JikanAnime) => {
    onSelectAnime(anime);
    setQuery('');
    setResults([]);
    setShowResults(false);
  };

  return (
    <div className="relative">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
        <Input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Rechercher un anime (min. 3 caractères)..."
          className="pl-10 pr-10"
        />
        {loading && (
          <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 size-4 animate-spin text-muted-foreground" />
        )}
      </div>

      {showResults && results.length > 0 && (
        <Card className="absolute z-50 w-full mt-2 max-h-[500px] overflow-y-auto shadow-lg">
          <div className="p-2 space-y-2">
            {results.map((anime) => (
              <button
                key={anime.mal_id}
                onClick={() => handleSelect(anime)}
                className="w-full p-3 hover:bg-accent rounded-lg transition-colors text-left flex gap-3"
              >
                <Image
                  src={anime.images.jpg.image_url}
                  alt={anime.title}
                  width={64}
                  height={80}
                  className="object-cover rounded"
                />
                <div className="flex-1 min-w-0">
                  <p className="font-semibold truncate">{anime.title}</p>
                  {anime.title_english && anime.title_english !== anime.title && (
                    <p className="text-sm text-muted-foreground truncate">
                      {anime.title_english}
                    </p>
                  )}
                  <div className="flex gap-2 mt-1 flex-wrap">
                    {anime.type && (
                      <Badge variant="secondary" className="text-xs">
                        {anime.type}
                      </Badge>
                    )}
                    {anime.year && (
                      <Badge variant="outline" className="text-xs">
                        {anime.year}
                      </Badge>
                    )}
                  </div>
                </div>
              </button>
            ))}
          </div>
        </Card>
      )}

      {showResults && results.length === 0 && !loading && query.length >= 3 && (
        <Card className="absolute z-50 w-full mt-2 p-4 text-center text-muted-foreground">
          Aucun résultat trouvé
        </Card>
      )}
    </div>
  );
}
