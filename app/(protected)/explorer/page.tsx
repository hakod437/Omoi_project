import React from 'react'
import { getTopAnime, getSeasonalAnime } from '@/lib/jikan'
import { AnimeCard } from '@/components/organisms/AnimeCard'
import { Compass, TrendingUp, Calendar, RefreshCw, AlertTriangle, ShieldCheck, TimerReset } from 'lucide-react'
import { auth } from '@/lib/auth'
import { redirect } from 'next/navigation'

export default async function ExplorerPage() {
    // Protection server-side : redirige vers /login si non connecté
    const session = await auth()
    if (!session?.user) {
        redirect('/login')
    }

    const startTime = Date.now()

    // Récupération avec timeout et fallback
    let topAnime: any[] = []
    let seasonalAnime: any[] = []
    let hasErrors = false

    try {
        const results = await Promise.allSettled([
            getTopAnime(),
            getSeasonalAnime()
        ])
        
        if (results[0].status === 'fulfilled') {
            topAnime = results[0].value
        } else {
            console.error('[🔍 EXPLORER] ❌ Erreur top anime:', results[0].reason)
            hasErrors = true
        }

        if (results[1].status === 'fulfilled') {
            seasonalAnime = results[1].value
        } else {
            console.error('[🔍 EXPLORER] ❌ Erreur seasonal anime:', results[1].reason)
            hasErrors = true
        }
    } catch (error) {
        console.error('[🔍 EXPLORER] ❌ Erreur générale:', error)
        hasErrors = true
    }

    const loadTime = Date.now() - startTime

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16">
            <header className="space-y-4">
                <h1 className="text-5xl font-kawaii text-[var(--foreground)] tracking-tight flex items-center gap-4">
                    <Compass className="size-12 text-primary animate-pulse" />
                    Explorer Vault
                </h1>
                <p className="text-muted-foreground font-medium text-lg max-w-2xl">
                    Flow A and D in action: discover titles, browse paged content, and keep going even if upstream is temporarily unstable.
                </p>

                <div className="flex flex-wrap gap-2 pt-2">
                    <span className="inline-flex items-center gap-1 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[10px] font-black uppercase tracking-[0.15em] text-white/70">
                        <ShieldCheck size={12} className="text-emerald-300" />
                        success
                    </span>
                    <span className="inline-flex items-center gap-1 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[10px] font-black uppercase tracking-[0.15em] text-white/70">
                        <AlertTriangle size={12} className="text-amber-300" />
                        partial
                    </span>
                    <span className="inline-flex items-center gap-1 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[10px] font-black uppercase tracking-[0.15em] text-white/70">
                        <TimerReset size={12} className="text-orange-300" />
                        retry aware
                    </span>
                </div>
                
                {hasErrors && (
                    <div className="flex items-center gap-2 p-4 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg">
                        <AlertTriangle className="size-5 text-amber-600 dark:text-amber-400" />
                        <span className="text-sm text-amber-800 dark:text-amber-200">
                            Some sections are degraded. Partial data loaded in {loadTime}ms. Retry/backoff remains active.
                        </span>
                    </div>
                )}
            </header>

            {/* Top Rated Section */}
            <section className="space-y-8">
                <div className="flex items-center justify-between border-b border-border pb-4">
                    <h2 className="text-2xl font-kawaii flex items-center gap-2">
                        <TrendingUp className="text-amber-400" />
                        Top Rated {topAnime.length > 0 && `(${topAnime.length})`}
                    </h2>
                    {topAnime.length === 0 && (
                        <RefreshCw className="size-4 animate-spin text-muted-foreground" />
                    )}
                </div>
                
                {topAnime.length > 0 ? (
                    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
                        {topAnime.slice(0, 10).map((anime: any) => (
                            <AnimeCard
                                key={anime.mal_id}
                                id={String(anime.mal_id)}
                                title={anime.title}
                                imageUrl={anime.images?.webp?.large_image_url || anime.image_url}
                                genres={anime.genres?.map((g: any) => g.name) || []}
                            />
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-12 text-muted-foreground">
                        <RefreshCw className="size-8 mx-auto mb-4 animate-spin" />
                        <p>Chargement des animes populaires...</p>
                    </div>
                )}
            </section>

            {/* Current Season Section */}
            <section className="space-y-8">
                <div className="flex items-center justify-between border-b border-border pb-4">
                    <h2 className="text-2xl font-kawaii flex items-center gap-2">
                        <Calendar className="text-sky-400" />
                        Current Season {seasonalAnime.length > 0 && `(${seasonalAnime.length})`}
                    </h2>
                    {seasonalAnime.length === 0 && (
                        <RefreshCw className="size-4 animate-spin text-muted-foreground" />
                    )}
                </div>
                
                {seasonalAnime.length > 0 ? (
                    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
                        {seasonalAnime.slice(0, 10).map((anime: any) => (
                            <AnimeCard
                                key={anime.mal_id}
                                id={String(anime.mal_id)}
                                title={anime.title}
                                imageUrl={anime.images?.webp?.large_image_url || anime.image_url}
                                genres={anime.genres?.map((g: any) => g.name) || []}
                            />
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-12 text-muted-foreground">
                        <RefreshCw className="size-8 mx-auto mb-4 animate-spin" />
                        <p>Chargement des animes de la saison...</p>
                    </div>
                )}
            </section>
        </div>
    )
}
