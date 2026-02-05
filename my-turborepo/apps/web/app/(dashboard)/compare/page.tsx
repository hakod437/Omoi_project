"use client";

import { useAnimes } from "@/contexts/anime-context";
import { ComparisonView } from "@/app/components/comparison-view";
import { MOCK_FRIENDS } from "@/data/mock-friends";
import { Anime } from "@/app/components/anime-list";

const MY_NAME = 'Moi';

export default function ComparePage() {
    const { animes } = useAnimes();

    // Adapter les animes du contexte au format attendu par ComparisonView (qui semble attendre une interface simplifiée)
    const myAnimesList: Anime[] = animes.map((a) => ({
        id: a.userAnimeId,
        name: a.title,
        rating: a.userRating,
        animationRating: a.animationRating,
        description: a.userDescription,
    }));

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold">Comparaison</h1>
            <ComparisonView
                myAnimes={myAnimesList}
                friends={MOCK_FRIENDS}
                myName={MY_NAME}
            />
        </div>
    );
}
