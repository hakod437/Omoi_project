"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { AnimeWithUserData, JikanAnime } from "@/types";

interface AnimeContextType {
    animes: AnimeWithUserData[];
    addAnime: (anime: JikanAnime, rating: number, animationRating: number, description: string) => void;
    deleteAnime: (id: string) => void;
    averageRating: string;
}

const AnimeContext = createContext<AnimeContextType | undefined>(undefined);

export function AnimeProvider({ children }: { children: React.ReactNode }) {
    const [animes, setAnimes] = useState<AnimeWithUserData[]>([]);

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

    const addAnime = (
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
        setAnimes((prev) => [newAnime, ...prev]);
    };

    const deleteAnime = (id: string) => {
        setAnimes((prev) => prev.filter((anime) => anime.userAnimeId !== id));
    };

    const averageRating =
        animes.length > 0
            ? (animes.reduce((sum, anime) => sum + anime.userRating, 0) / animes.length).toFixed(1)
            : '0.0';

    return (
        <AnimeContext.Provider value={{ animes, addAnime, deleteAnime, averageRating }}>
            {children}
        </AnimeContext.Provider>
    );
}

export function useAnimes() {
    const context = useContext(AnimeContext);
    if (context === undefined) {
        throw new Error("useAnimes must be used within an AnimeProvider");
    }
    return context;
}
