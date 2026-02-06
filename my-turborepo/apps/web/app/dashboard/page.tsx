"use client";

import { useAnimes } from "@/contexts/anime-context";
import { AddAnimeForm } from "@/app/components/add-anime-form";
import { AnimeCard } from "@/app/components/anime-card";
import { Tv } from "lucide-react";
import { Card } from "@/app/components/ui/card";

export default function DashboardPage() {
    const { animes, addAnime, deleteAnime, averageRating } = useAnimes();

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card className="p-4 text-center">
                    <p className="text-3xl font-bold text-primary">{animes.length}</p>
                    <p className="text-sm text-muted-foreground">Animes regardés</p>
                </Card>
                <Card className="p-4 text-center">
                    <p className="text-3xl font-bold text-primary">{averageRating}</p>
                    <p className="text-sm text-muted-foreground">Note moyenne</p>
                </Card>
            </div>

            <AddAnimeForm onAdd={addAnime} />

            <div>
                <h2 className="text-2xl font-bold mb-4">Ma liste ({animes.length})</h2>
                <div className="space-y-4">
                    {animes.map((anime, index) => (
                        <AnimeCard
                            key={anime.userAnimeId}
                            anime={anime}
                            onDelete={deleteAnime}
                            priority={index < 2}
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
        </div>
    );
}
