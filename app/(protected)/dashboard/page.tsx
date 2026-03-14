import React from 'react'
import { Tv, Trophy, Music, Book, Play } from 'lucide-react'
import { DashboardTemplate } from '@/components/templates/DashboardTemplate'
import { getUserStatsAction } from '@/actions/user.actions'

import { auth } from '@/lib/auth'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { User2, ListChecks, ShieldAlert } from 'lucide-react'

export default async function Dashboard() {
    const session = await auth()

    if (!session?.user?.id) {
        redirect('/login')
    }

    const result = await getUserStatsAction()

    const stats = result.success ? result.data : {
        totalAnimes: 0,
        completedCount: 0,
        tierSCount: 0,
        avgAnimation: 0,
        avgScenario: 0,
        avgMusic: 0,
        lastFiveRatings: []
    }
    
    const statsSubtitle = `${stats.completedCount} animes complétés dans votre Omoi`

    const criteriaAverages = [
        { name: 'Animation', value: stats.avgAnimation, color: 'from-green-400 to-teal-400' },
        { name: 'Musique', value: stats.avgMusic, color: 'from-purple-400 to-pink-400' },
        { name: 'Scénario', value: stats.avgScenario, color: 'from-blue-400 to-cyan-400' },
        { name: 'Global', value: parseFloat(((stats.avgAnimation + stats.avgMusic + stats.avgScenario) / 3).toFixed(1)) || 0, color: 'from-orange-400 to-red-400' }
    ]

    return (
        <>
            <DashboardTemplate
                usernameLabel={session.user.name || "Omoi Master"}
                statsSubtitle={statsSubtitle}
                addAnimeHref="/explorer"
                statsCards={[
                    { icon: <Tv size={24} />, value: `${stats.totalAnimes} ANIMES` },
                    { icon: <Trophy size={24} />, value: `${stats.tierSCount} TIER S` },
                    { icon: <Play size={24} />, value: `${stats.avgAnimation} MOT. ANIM` },
                    { icon: <Book size={24} />, value: `${stats.avgScenario} MOY. SCEN` },
                    { icon: <Music size={24} />, value: `${stats.avgMusic} MOY. MUS` },
                ]}
                criteriaAverages={criteriaAverages}
                tastes={[]}
                favoriteStudios={[]}
                tierRows={stats.tierRows || []}
                activity={(stats.activities || []).map((a: any) => ({
                    id: a.id,
                    icon: <Tv size={16} className="text-primary" />,
                    text: a.content || `Activité: ${a.type}`,
                    right: <span className="text-xs opacity-50">{new Date(a.createdAt).toLocaleDateString()}</span>
                }))}
                lastRatings={stats.lastFiveRatings}
            />

            <div className="mx-auto w-full max-w-7xl px-4 pb-12 sm:px-6 lg:px-8">
                <div className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl">
                    <h2 className="text-2xl font-kawaii text-white">Flow Shortcuts</h2>
                    <p className="mt-2 text-sm text-white/50">Access the key user-flow pages directly.</p>
                    <div className="mt-4 grid grid-cols-1 gap-3 md:grid-cols-3">
                        <Link href="/me" className="inline-flex items-center gap-2 rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-sm font-bold text-white/80 transition hover:border-[var(--primary)]/30 hover:text-[var(--primary)]">
                            <User2 size={16} /> Viewer profile
                        </Link>
                        <Link href="/me/list" className="inline-flex items-center gap-2 rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-sm font-bold text-white/80 transition hover:border-[var(--primary)]/30 hover:text-[var(--primary)]">
                            <ListChecks size={16} /> Update list status
                        </Link>
                        <Link href="/sync" className="inline-flex items-center gap-2 rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-sm font-bold text-white/80 transition hover:border-[var(--primary)]/30 hover:text-[var(--primary)]">
                            <ShieldAlert size={16} /> Error recovery states
                        </Link>
                    </div>
                </div>
            </div>
        </>
    )
}
