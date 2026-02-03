import { useState } from 'react';
import { Plus, Sparkles } from 'lucide-react';
import { Button } from '@/app/components/ui/button';
import { Input } from '@/app/components/ui/input';
import { Label } from '@/app/components/ui/label';
import { Textarea } from '@/app/components/ui/textarea';
import { Card } from '@/app/components/ui/card';
import { AnimeSearch, JikanAnime } from '@/app/components/anime-search';

interface AddAnimeFormProps {
  onAdd: (anime: JikanAnime, rating: number, animationRating: number, description: string) => void;
}

const ratingEmojis = [
  { emoji: '😢', value: 1, label: 'Très mauvais' },
  { emoji: '😕', value: 2, label: 'Mauvais' },
  { emoji: '😐', value: 3, label: 'Moyen' },
  { emoji: '🙂', value: 4, label: 'Bon' },
  { emoji: '😊', value: 5, label: 'Très bon' },
  { emoji: '🤩', value: 6, label: 'Excellent' },
];

export function AddAnimeForm({ onAdd }: AddAnimeFormProps) {
  const [selectedAnime, setSelectedAnime] = useState<JikanAnime | null>(null);
  const [rating, setRating] = useState<number>(4);
  const [animationRating, setAnimationRating] = useState<number>(4);
  const [description, setDescription] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedAnime && rating && animationRating) {
      onAdd(selectedAnime, rating, animationRating, description.trim());
      setSelectedAnime(null);
      setRating(4);
      setAnimationRating(4);
      setDescription('');
    }
  };

  return (
    <Card className="p-6">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Label>Rechercher un anime</Label>
          <div className="mt-2">
            <AnimeSearch onSelectAnime={setSelectedAnime} />
          </div>
          {selectedAnime && (
            <div className="mt-3 p-3 bg-primary/5 rounded-lg flex items-center gap-3">
              <img
                src={selectedAnime.images.jpg.image_url}
                alt={selectedAnime.title}
                className="w-12 h-16 object-cover rounded"
              />
              <div className="flex-1 min-w-0">
                <p className="font-semibold truncate">{selectedAnime.title}</p>
                {selectedAnime.title_english && (
                  <p className="text-xs text-muted-foreground truncate">
                    {selectedAnime.title_english}
                  </p>
                )}
              </div>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => setSelectedAnime(null)}
              >
                Changer
              </Button>
            </div>
          )}
        </div>

        {selectedAnime && (
          <>
            <div>
              <Label>Note globale</Label>
              <div className="grid grid-cols-6 gap-2 mt-2">
                {ratingEmojis.map((item) => (
                  <button
                    key={item.value}
                    type="button"
                    onClick={() => setRating(item.value)}
                    className={`p-3 rounded-lg border-2 transition-all hover:scale-110 ${
                      rating === item.value
                        ? 'border-primary bg-primary/10 scale-105'
                        : 'border-border hover:border-primary/50'
                    }`}
                    title={item.label}
                  >
                    <span className="text-2xl">{item.emoji}</span>
                  </button>
                ))}
              </div>
              <p className="text-sm text-muted-foreground mt-2 text-center">
                {ratingEmojis.find((r) => r.value === rating)?.label}
              </p>
            </div>

            <div>
              <Label className="flex items-center gap-2">
                <Sparkles className="size-4 text-primary" />
                Note de l'animation
              </Label>
              <div className="grid grid-cols-6 gap-2 mt-2">
                {ratingEmojis.map((item) => (
                  <button
                    key={item.value}
                    type="button"
                    onClick={() => setAnimationRating(item.value)}
                    className={`p-3 rounded-lg border-2 transition-all hover:scale-110 ${
                      animationRating === item.value
                        ? 'border-primary bg-primary/10 scale-105'
                        : 'border-border hover:border-primary/50'
                    }`}
                    title={item.label}
                  >
                    <span className="text-2xl">{item.emoji}</span>
                  </button>
                ))}
              </div>
              <p className="text-sm text-muted-foreground mt-2 text-center">
                {ratingEmojis.find((r) => r.value === animationRating)?.label}
              </p>
            </div>

            <div>
              <Label htmlFor="description">Votre avis / Note personnelle</Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Ajoutez une description ou vos notes sur cet anime..."
                rows={3}
                className="resize-none"
              />
            </div>

            <Button type="submit" className="w-full">
              <Plus className="size-4 mr-2" />
              Ajouter l'anime
            </Button>
          </>
        )}
      </form>
    </Card>
  );
}