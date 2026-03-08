import React from 'react'
import { getTopAnime, getSeasonalAnime } from '@/lib/jikan'
import { AnimeCard } from '@/components/organisms/AnimeCard'
import { Compass, TrendingUp, Calendar } from 'lucide-react'

export const dynamic = 'force-dynamic'

export default async function ExplorerPage() {
    const [topAnime, seasonalAnime] = await Promise.all([
        getTopAnime(),
        getSeasonalAnime()
    ])

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16">
            <header className="space-y-4">
                <h1 className="text-5xl font-kawaii text-[var(--foreground)] tracking-tight flex items-center gap-4">
                    <Compass className="size-12 text-primary animate-pulse" />
                    Explorer Vault
                </h1>
                <p className="text-muted-foreground font-medium text-lg max-w-2xl">
                    Discover your next obsession. Browse through the highest rated masterpieces and the hottest shows of current season.
                </p>
            </header>

            {/* Top Rated Section */}
            <section className="space-y-8">
                <div className="flex items-center justify-between border-b border-border pb-4">
                    <h2 className="text-2xl font-kawaii flex items-center gap-2">
                        <TrendingUp className="text-amber-400" />
                        Top Rated
                    </h2>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
                    {topAnime.slice(0, 10).map((anime: any) => (
                        <AnimeCard
                            key={anime.mal_id}
                            id={String(anime.mal_id)}
                            title={anime.title}
                            imageUrl={anime.images.webp.large_image_url}
                            genres={anime.genres.map((g: any) => g.name)}
                        />
                    ))}
                </div>
            </section>

            {/* Current Season Section */}
            <section className="space-y-8">
                <div className="flex items-center justify-between border-b border-border pb-4">
                    <h2 className="text-2xl font-kawaii flex items-center gap-2">
                        <Calendar className="text-sky-400" />
                        Current Season
                    </h2>
                </div>
                <div className="grid grid-cols-2 md:md:grid-cols-4 lg:grid-cols-5 gap-6">
                    {seasonalAnime.slice(0, 10).map((anime: any) => (
                        <AnimeCard
                            key={anime.mal_id}
                            id={String(anime.mal_id)}
                            title={anime.title}
                            imageUrl={anime.images.webp.large_image_url}
                            genres={anime.genres.map((g: any) => g.name)}
                        />
                    ))}
                </div>
            </section>
        </div>
    )
}
