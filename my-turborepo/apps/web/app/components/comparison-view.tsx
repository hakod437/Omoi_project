import { Search } from 'lucide-react';
import { useState, useMemo } from 'react';
import { Card } from '@/app/components/ui/card';
import { Input } from '@/app/components/ui/input';
import { Badge } from '@/app/components/ui/badge';
import { RATING_EMOJIS } from '@/lib/constants';
import { AnimeWithUserData, Friend } from '@/types';

interface ComparisonViewProps {
  myAnimes: AnimeWithUserData[];
  friends: Friend[];
  myName: string;
}

export function ComparisonView({ myAnimes, friends, myName }: ComparisonViewProps) {
  const [searchTerm, setSearchTerm] = useState('');

  // Créer une map de tous les animes uniques
  const allAnimes = useMemo(() => {
    const animeMap = new Map<string, { title: string; ratings: { person: string; rating: number }[] }>();

    // Ajouter mes animes
    myAnimes.forEach((anime) => {
      const key = anime.title.toLowerCase();
      if (!animeMap.has(key)) {
        animeMap.set(key, { title: anime.title, ratings: [] });
      }
      animeMap.get(key)!.ratings.push({ person: myName, rating: anime.userRating });
    });

    // Ajouter les animes des amis
    friends.forEach((friend) => {
      friend.animes.forEach((anime) => {
        const key = anime.title.toLowerCase();
        if (!animeMap.has(key)) {
          animeMap.set(key, { title: anime.title, ratings: [] });
        }
        animeMap.get(key)!.ratings.push({ person: friend.name, rating: anime.rating });
      });
    });

    return Array.from(animeMap.values())
      .filter((anime) => anime.ratings.length > 1) // Seulement les animes vus par plusieurs personnes
      .sort((a, b) => b.ratings.length - a.ratings.length);
  }, [myAnimes, friends, myName]);

  const filteredAnimes = allAnimes.filter((anime) =>
    anime.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const calculateAgreement = (ratings: { person: string; rating: number }[]) => {
    const avg = ratings.reduce((sum, r) => sum + r.rating, 0) / ratings.length;
    const variance = ratings.reduce((sum, r) => sum + Math.pow(r.rating - avg, 2), 0) / ratings.length;
    const stdDev = Math.sqrt(variance);

    if (stdDev < 0.5) return 'Accord total';
    if (stdDev < 1) return 'Bon accord';
    if (stdDev < 1.5) return 'Accord modéré';
    return 'Avis divergents';
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2">Comparaisons</h2>
        <p className="text-muted-foreground">
          Animes vus par plusieurs personnes ({allAnimes.length})
        </p>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
        <Input
          placeholder="Rechercher un anime..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
        />
      </div>

      <div className="space-y-4">
        {filteredAnimes.map((anime, index) => {
          const agreement = calculateAgreement(anime.ratings);
          const avgRating = anime.ratings.reduce((sum, r) => sum + r.rating, 0) / anime.ratings.length;

          return (
            <Card key={index} className="p-4">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="font-semibold text-lg">{anime.title}</h3>
                  <Badge variant="secondary" className="mt-1">
                    {agreement}
                  </Badge>
                </div>
                <div className="text-right">
                  <div className="text-2xl">{RATING_EMOJIS[Math.round(avgRating) - 1]}</div>
                  <p className="text-xs text-muted-foreground mt-1">
                    Moyenne: {avgRating.toFixed(1)}/6
                  </p>
                </div>
              </div>

              <div className="space-y-2 border-t pt-3">
                {anime.ratings.map((rating, idx) => (
                  <div key={idx} className="flex items-center justify-between text-sm">
                    <span className="font-medium">{rating.person}</span>
                    <div className="flex items-center gap-2">
                      <span className="text-xl">{RATING_EMOJIS[rating.rating - 1]}</span>
                      <span className="text-muted-foreground">{rating.rating}/6</span>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          );
        })}

        {filteredAnimes.length === 0 && allAnimes.length === 0 && (
          <Card className="p-12 text-center">
            <p className="text-muted-foreground">
              Aucun anime en commun pour le moment. Ajoutez des animes et invitez des amis !
            </p>
          </Card>
        )}

        {filteredAnimes.length === 0 && allAnimes.length > 0 && (
          <Card className="p-12 text-center">
            <p className="text-muted-foreground">Aucun résultat pour "{searchTerm}"</p>
          </Card>
        )}
      </div>
    </div>
  );
}
