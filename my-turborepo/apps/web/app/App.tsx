'use client';
import { useState, useEffect } from 'react';
import { Tv, Users, BarChart3 } from 'lucide-react';
import { AddAnimeForm } from '@/app/components/add-anime-form';
import { AnimeCard, AnimeWithUserData } from '@/app/components/anime-card';
import { FriendsView, Friend } from '@/app/components/friends-view';
import { ComparisonView } from '@/app/components/comparison-view';
import type { Anime } from '@/app/components/anime-list';
import { ThemeColor, ThemeSelector } from '@/app/components/theme-selector';
import { useTheme } from '@/app/components/theme-provider';
import { JikanAnime } from '@/app/components/anime-search';
import { Card } from '@/app/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/app/components/ui/tabs';

const MY_NAME = 'Moi';

// Données d'exemple pour les amis
const MOCK_FRIENDS: Friend[] = [
  {
    id: '1',
    name: 'Sarah',
    animes: [
      { id: '1', name: 'One Piece', rating: 6, animationRating: 5, description: 'Incroyable aventure avec des personnages attachants' },
      { id: '2', name: 'Attack on Titan', rating: 5, animationRating: 6, description: 'Animation époustouflante, histoire prenante' },
      { id: '3', name: 'Death Note', rating: 6, animationRating: 4, description: 'Le meilleur thriller psychologique que j\'ai vu' },
      { id: '4', name: 'Demon Slayer', rating: 4, animationRating: 6, description: 'Visuellement magnifique mais histoire classique' },
    ],
  },
  {
    id: '2',
    name: 'Lucas',
    animes: [
      { id: '1', name: 'Naruto', rating: 5, animationRating: 4, description: 'Mon anime d\'enfance, nostalgie assurée' },
      { id: '2', name: 'One Piece', rating: 5, animationRating: 4, description: 'Long mais ça vaut le coup' },
      { id: '3', name: 'My Hero Academia', rating: 4, animationRating: 5, description: 'Bon shonen moderne' },
      { id: '4', name: 'Jujutsu Kaisen', rating: 6, animationRating: 6, description: 'Le meilleur du genre actuellement' },
    ],
  },
  {
    id: '3',
    name: 'Emma',
    animes: [
      { id: '1', name: 'Death Note', rating: 5, animationRating: 4, description: 'Très intelligent mais la fin est faible' },
      { id: '2', name: 'Fullmetal Alchemist', rating: 6, animationRating: 5, description: 'Une œuvre d\'art complète' },
      { id: '3', name: 'Hunter x Hunter', rating: 6, animationRating: 5, description: 'Complexe et brillant' },
      { id: '4', name: 'Attack on Titan', rating: 4, animationRating: 5, description: 'Bon mais trop sombre à mon goût' },
    ],
  },
];

function App() {
  const [animes, setAnimes] = useState<AnimeWithUserData[]>([]);
  const [friends] = useState<Friend[]>(MOCK_FRIENDS);
  const { theme, setTheme } = useTheme();

  // Charger les animes depuis localStorage
  useEffect(() => {
    const saved = localStorage.getItem('myAnimes');
    if (saved) {
      try {
        setAnimes(JSON.parse(saved));
      } catch (e) {
        console.error('Error loading animes:', e);
      }
    }
  }, []);

  // Sauvegarder les animes dans localStorage
  useEffect(() => {
    localStorage.setItem('myAnimes', JSON.stringify(animes));
  }, [animes]);

  const handleThemeChange = (newTheme: ThemeColor) => {
    setTheme(newTheme);
  };

  const handleAddAnime = (
    anime: JikanAnime,
    rating: number,
    animationRating: number,
    description: string
  ) => {
    const newAnime: AnimeWithUserData = {
      ...anime,
      userRating: rating,
      animationRating: animationRating,
      userDescription: description,
      userAnimeId: Date.now().toString(),
    };
    setAnimes([newAnime, ...animes]);
  };

  const handleDeleteAnime = (id: string) => {
    setAnimes(animes.filter((anime) => anime.userAnimeId !== id));
  };

  const averageRating =
    animes.length > 0
      ? (animes.reduce((sum, anime) => sum + anime.userRating, 0) / animes.length).toFixed(1)
      : '0.0';

  return (
    <div className="min-h-screen bg-background">
      <div className="container max-w-6xl mx-auto py-8 px-4">
        <header className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-3">
              <Tv className="size-8 text-primary" />
              <h1 className="text-4xl font-bold">Mon Tracker Anime</h1>
            </div>
            <ThemeSelector currentTheme={theme} onThemeChange={handleThemeChange} />
          </div>
          <p className="text-muted-foreground">
            Suivez vos animes et comparez vos avis avec vos amis
          </p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <Card className="p-4 text-center">
            <p className="text-3xl font-bold text-primary">{animes.length}</p>
            <p className="text-sm text-muted-foreground">Animes regardés</p>
          </Card>
          <Card className="p-4 text-center">
            <p className="text-3xl font-bold text-primary">{averageRating}</p>
            <p className="text-sm text-muted-foreground">Note moyenne</p>
          </Card>
          <Card className="p-4 text-center">
            <p className="text-3xl font-bold text-primary">{friends.length}</p>
            <p className="text-sm text-muted-foreground">Amis</p>
          </Card>
        </div>

        <Tabs defaultValue="my-animes" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="my-animes">
              <Tv className="size-4 mr-2" />
              Mes animes
            </TabsTrigger>
            <TabsTrigger value="friends">
              <Users className="size-4 mr-2" />
              Amis
            </TabsTrigger>
            <TabsTrigger value="comparison">
              <BarChart3 className="size-4 mr-2" />
              Comparaisons
            </TabsTrigger>
          </TabsList>

          <TabsContent value="my-animes" className="space-y-6">
            <AddAnimeForm onAdd={handleAddAnime} />
            <div>
              <h2 className="text-2xl font-bold mb-4">Ma liste ({animes.length})</h2>
              <div className="space-y-4">
                {animes.map((anime) => (
                  <AnimeCard
                    key={anime.userAnimeId}
                    anime={anime}
                    onDelete={handleDeleteAnime}
                  />
                ))}
                {animes.length === 0 && (
                  <div className="text-center py-12 text-muted-foreground">
                    <Tv className="size-12 mx-auto mb-4 opacity-20" />
                    <p>Aucun anime pour le moment</p>
                    <p className="text-sm mt-2">
                      Utilisez la recherche ci-dessus pour ajouter vos premiers animes
                    </p>
                  </div>
                )}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="friends">
            <FriendsView friends={friends} />
          </TabsContent>

          <TabsContent value="comparison">
            <ComparisonView
              myAnimes={animes.map((a): Anime => ({
                id: a.userAnimeId,
                name: a.title,
                rating: a.userRating,
                animationRating: a.animationRating,
                description: a.userDescription,
              }))}
              friends={friends}
              myName={MY_NAME}
            />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

export default App;