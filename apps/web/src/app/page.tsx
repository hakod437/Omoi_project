"use client";
import React from "react";

import { PageContainer } from "@/components/atoms/page-container";
import { useTheme } from "./providers";
import { Icon } from "@/components/atoms/icon";
import { AnimeCard } from "@/components/organisms/anime-card";
import { SearchBar } from "@/components/organisms/search-bar";

const MOCK_ANIME = [
  {
    id: 1,
    title: "Demon Slayer",
    imageUrl: "https://placehold.co/300x600/120f17/ffffff?text=Tall+Image",
    description: "L'histoire suit Tanjiro Kamado, un jeune garçon qui devient un tueur de démons après que sa famille a été massacrée.",
    score: 91,
    genres: ["Action", "Fantasy", "Shonen"],
    studio: "ufotable",
    year: 2019,
    ranking: "N°1 à Cotonou",
    reviewer: {
      name: "Awa T.",
      initials: "AT",
      vibeLocale: 92,
      rankingLabel: "N°1 à Cotonou"
    }
  },
  {
    id: 2,
    title: "Jujutsu Kaisen",
    imageUrl: "https://placehold.co/800x400/120f17/ffffff?text=Wide+Image",
    description: "Yuji Itadori est un lycéen ordinaire avec une force physique exceptionnelle qui mange un doigt maudit par accident.",
    score: 89,
    genres: ["Action", "Surnaturel"],
    studio: "MAPPA",
    year: 2020,
    reviewer: {
      name: "Koffi M.",
      initials: "KM",
      vibeLocale: 88
    }
  }
];

/**
 * Home component: This represents the "/" route of your application.
 * In Next.js, every file in the /app folder acts as a "Route".
 */
export default function Home() {
  // We use the useTheme hook to know if we are in Light or Dark mode.
  const { themeMode, resolvedTheme, setThemeMode } = useTheme();

  return (
    // PageContainer ensures consistent margins and padding on every page.
    <PageContainer>
      <SearchBar />

      {/* 
        This section displays anime that are popular in the user's current city.
      */}
      <header className="mb-6 flex justify-between items-end">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Icon icon="lucide:map-pin" size={20} className="text-brand-primary" />
            Tendances locales
          </h2>
          <p className="text-white/40 text-xs mt-1">Bénin • Cotonou</p>
        </div>
      </header>

      {/* 
        The .map() loop transforms our MOCK_ANIME array into a grid of AnimeCard components.
        The 'grid-cols-2' class makes them sit side-by-side in two columns.
      */}
      <div className="grid grid-cols-2 gap-4">
        {MOCK_ANIME.map((anime) => (
          <AnimeCard key={anime.id} {...anime} />
        ))}
      </div>

      <section className="mt-12">
        <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
          <Icon icon="lucide:compass" size={20} className="text-brand-primary" />
          Découverte rapide
        </h2>
        {/* 
          Variant Property: Here we pass variant="horizontal" to the AnimeCard.
          This tells the card to change its layout while using the same logic.
        */}
        <div className="flex flex-col gap-4">
          {MOCK_ANIME.map((anime) => (
            <AnimeCard key={`${anime.id}-horiz`} {...anime} variant="horizontal" />
          ))}
        </div>
      </section>
      
    </PageContainer>
  );
}
