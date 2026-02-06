"use client";

import { useAnimes } from "@/contexts/anime-context";
import { ComparisonView } from "@/app/components/comparison-view";
import { MOCK_FRIENDS } from "@/data/mock-friends";

const MY_NAME = 'Moi';

export default function ComparePage() {
    const { animes } = useAnimes();

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold">Comparaison</h1>
            <ComparisonView
                myAnimes={animes}
                friends={MOCK_FRIENDS}
                myName={MY_NAME}
            />
        </div>
    );
}
