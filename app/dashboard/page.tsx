import React from 'react'
import { getServerSession } from 'next-auth/next'
import { redirect } from 'next/navigation'
import { AnimeCard } from '@/components/organisms/AnimeCard'
import type { Tier } from '@/types/anime'
import { Star, Trophy, BarChart } from 'lucide-react'
import { RatingService } from '@/services/rating.service'
import { authOptions } from '@/pages/api/auth/[...nextauth]'

export const dynamic = 'force-dynamic'

export default async function Dashboard() {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
        redirect('/login')
    }

    // Données mock pour les tests
    const mockRatings = [
        { 
            id: 1, 
            animeId: 1,
            animeTitle: "Attack on Titan", 
            userRating: "S", 
            globalRating: "A",
            anime: {
                title: "Attack on Titan",
                imageUrl: "",
                genres: ["Action", "Drama"]
            }
        },
        { 
            id: 2, 
            animeId: 2,
            animeTitle: "Demon Slayer", 
            userRating: "A", 
            globalRating: "S",
            anime: {
                title: "Demon Slayer",
                imageUrl: "",
                genres: ["Action", "Fantasy"]
            }
        },
        { 
            id: 3, 
            animeId: 3,
            animeTitle: "Jujutsu Kaisen", 
            userRating: "S", 
            globalRating: "S",
            anime: {
                title: "Jujutsu Kaisen",
                imageUrl: "",
                genres: ["Action", "Supernatural"]
            }
        }
    ]

    // Group by global tier
    const tiers: Tier[] = ['S', 'A', 'B', 'C', 'D']
    const grouped = tiers.reduce((acc, tier) => {
        acc[tier] = mockRatings.filter((r: any) => r.globalRating === tier)
        return acc
    }, {} as Record<Tier, any[]>)

    const stats = {
        total: mockRatings.length,
        avgGlobal: mockRatings.length > 0
            ? (mockRatings.reduce((acc: number, r: any) => acc + (r.globalRating === 'S' ? 5 : r.globalRating === 'A' ? 4 : 3), 0) / mockRatings.length).toFixed(1)
            : '0',
        sTierCount: grouped['S'].length,
    }

    return (
        <div className="space-y-12 py-8 pb-24">
            {/* Header & Stats */}
            <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-8">
                <div className="space-y-2">
                    <h1 className="text-4xl font-kawaii text-[var(--foreground)]">Your Vault</h1>
                    <p className="text-[var(--foreground)]/60 font-medium font-ui">
                        Tracking {stats.total} peaks and valleys.
                    </p>
                </div>

                <div className="grid grid-cols-3 gap-8 p-6 rounded-2xl bg-[var(--card)]/40 border border-[var(--border)] backdrop-blur-md">
                    <DashboardStat icon={<Trophy className="text-yellow-400" size={18} />} label="S-Tiers" value={stats.sTierCount.toString()} />
                    <DashboardStat icon={<Star className="text-[var(--primary)]" size={18} />} label="Avg Score" value={stats.avgGlobal} />
                    <DashboardStat icon={<BarChart className="text-[var(--accent)]" size={18} />} label="Total" value={stats.total.toString()} />
                </div>
            </header>

            {/* Tier Swimlanes */}
            <div className="space-y-16">
                {tiers.map((tier) => (
                    <section key={tier} className="space-y-6">
                        <div className="flex items-center gap-4">
                            <div className={`size-10 rounded-xl flex items-center justify-center font-kawaii text-2xl text-white shadow-lg ${getTierBg(tier)}`}>
                                {tier}
                            </div>
                            <h2 className="text-2xl font-kawaii text-[var(--foreground)]">
                                {getTierLabel(tier)}
                                <span className="ml-3 text-sm font-ui opacity-40">({grouped[tier].length})</span>
                            </h2>
                        </div>

                        {grouped[tier].length > 0 ? (
                            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
                                {grouped[tier].map((r) => (
                                    <AnimeCard
                                        key={r.animeId}
                                        id={r.animeId}
                                        title={r.anime.title}
                                        imageUrl={r.anime.imageUrl || ''}
                                        genres={r.anime.genres}
                                        globalTier={r.globalTier}
                                    />
                                ))}
                            </div>
                        ) : (
                            <div className="h-32 rounded-2xl border-2 border-dashed border-[var(--border)] flex items-center justify-center text-[var(--foreground)]/20 font-bold italic">
                                No peaks in this tier yet...
                            </div>
                        )}
                    </section>
                ))}
            </div>
        </div>
    )
}

function DashboardStat({ icon, label, value }: { icon: React.ReactNode, label: string, value: string }) {
    return (
        <div className="flex flex-col items-center gap-1">
            <div className="flex items-center gap-2">
                {icon}
                <span className="text-xl font-bold font-kawaii">{value}</span>
            </div>
            <span className="text-[10px] uppercase tracking-widest font-bold opacity-40">{label}</span>
        </div>
    )
}

function getTierBg(tier: Tier) {
    switch (tier) {
        case 'S': return 'bg-[#ff4757]'
        case 'A': return 'bg-[#ffa502]'
        case 'B': return 'bg-[#2ed573]'
        case 'C': return 'bg-[#1e90ff]'
        case 'D': return 'bg-[#747d8c]'
    }
}

function getTierLabel(tier: Tier) {
    switch (tier) {
        case 'S': return 'Masterpieces'
        case 'A': return 'Exceptional'
        case 'B': return 'Great Vibes'
        case 'C': return 'Average'
        case 'D': return 'Rough Watch'
    }
}
