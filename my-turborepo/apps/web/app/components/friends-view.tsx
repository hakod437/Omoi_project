import { useState } from 'react';
import { Users, Search } from 'lucide-react';
import { Card } from '@/app/components/ui/card';
import { Input } from '@/app/components/ui/input';
import { AnimeList } from '@/app/components/anime-list';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/app/components/ui/tabs';
import { Friend } from '@/types';

interface FriendsViewProps {
  friends: Friend[];
}

export function FriendsView({ friends }: FriendsViewProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFriend, setSelectedFriend] = useState<Friend | null>(friends[0] || null);

  const filteredAnimes = selectedFriend
    ? selectedFriend.animes.filter((anime) =>
      anime.title.toLowerCase().includes(searchTerm.toLowerCase())
    )
    : [];

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 mb-4">
        <Users className="size-6 text-primary" />
        <h2 className="text-2xl font-bold">Mes amis</h2>
      </div>

      <Tabs value={selectedFriend?.id} onValueChange={(id: string) => {
        const friend = friends.find(f => f.id === id);
        if (friend) setSelectedFriend(friend);
      }}>
        <TabsList className="w-full justify-start overflow-x-auto">
          {friends.map((friend) => (
            <TabsTrigger key={friend.id} value={friend.id}>
              {friend.name}
              <span className="ml-2 text-xs opacity-60">({friend.animes.length})</span>
            </TabsTrigger>
          ))}
        </TabsList>

        {friends.map((friend) => (
          <TabsContent key={friend.id} value={friend.id} className="space-y-4">
            <Card className="p-4 bg-muted/50">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-semibold">{friend.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {friend.animes.length} anime{friend.animes.length > 1 ? 's' : ''} regardé{friend.animes.length > 1 ? 's' : ''}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold">
                    {friend.animes.length > 0
                      ? (friend.animes.reduce((sum, a) => sum + a.rating, 0) / friend.animes.length).toFixed(1)
                      : '0.0'}
                  </p>
                  <p className="text-xs text-muted-foreground">Note moyenne</p>
                </div>
              </div>
            </Card>

            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
              <Input
                placeholder="Rechercher un anime..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* AnimeList maintenant typé pour AnimeWithUserData, mais FriendAnime est compatible grâce au Partial<JikanAnime> */}
            <AnimeList
              animes={filteredAnimes.map(a => ({
                ...a,
                userRating: a.rating,
                animationRating: a.animationRating,
                userDescription: a.description,
                userAnimeId: a.id
              }))}
              onDelete={() => { }}
              showActions={false}
            />
          </TabsContent>
        ))}
      </Tabs>

      {friends.length === 0 && (
        <Card className="p-12 text-center">
          <Users className="size-12 mx-auto mb-4 text-muted-foreground" />
          <p className="text-muted-foreground">Aucun ami pour le moment</p>
        </Card>
      )}
    </div>
  );
}
