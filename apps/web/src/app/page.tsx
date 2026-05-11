"use client";
import React from "react";

import { Button } from "@/components/atoms/button";
import { GlassCard } from "@/components/molecules/glass-card";
import { VibeBadge } from "@/components/molecules/vibe-badge";
import { SectionHeader } from "@/components/molecules/section-header";
import { Surface } from "@/components/atoms/surface";
import { PageContainer } from "@/components/atoms/page-container";
import { THEME_TOKENS } from "@/theme/tokens";
import { useTheme } from "./providers";
import { Icon } from "@/components/atoms/icon";
import { AnimeCard } from "@/components/organisms/anime-card";

const MOCK_ANIME = [
  {
    id: 1,
    title: "Demon Slayer",
    imageUrl: "https://placehold.co/400x600/120f17/ffffff?text=Demon+Slayer",
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
    imageUrl: "https://placehold.co/400x600/120f17/ffffff?text=Jujutsu+Kaisen",
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

export default function Home() {
  const { themeMode, resolvedTheme, setThemeMode } = useTheme();

  return (
    <PageContainer>
      <Surface className="p-6 flex flex-col gap-4 mb-8">
       <Icon icon="lucide:search" size={24} className="text-brand-primary" />
       <input type="text" placeholder="Rechercher un anime, studio ou genre" className="bg-transparent border-none outline-none text-white w-full" />
      </Surface>

      <header className="mb-6 flex justify-between items-end">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Icon icon="lucide:map-pin" size={20} className="text-brand-primary" />
            Tendances locales
          </h2>
          <p className="text-white/40 text-xs mt-1">Bénin • Cotonou</p>
        </div>
      </header>

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
        <div className="flex flex-col gap-4">
          {MOCK_ANIME.map((anime) => (
            <AnimeCard key={`${anime.id}-horiz`} {...anime} variant="horizontal" />
          ))}
        </div>
      </section>
      
    </PageContainer>
  );
}
