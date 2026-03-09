import React from 'react'
import { Tv, Trophy, Music, Book, Play } from 'lucide-react'
import { DashboardTemplate } from '@/components/templates/DashboardTemplate'
import { getUserStatsAction } from '@/actions/user.actions'

export const dynamic = 'force-dynamic'

import { auth } from '@/lib/auth'
import { redirect } from 'next/navigation'

export default async function Dashboard() {
    console.log("[📊 DASHBOARD] 🚀 Début du rendu SSR", new Date().toISOString())

    const session = await auth()
    console.log("[📊 DASHBOARD] 🔐 Session récupérée:", session ? '✅' : '❌')
    console.log("[📊 DASHBOARD] 👤 Utilisateur:", session?.user?.id, session?.user?.name)

    if (!session?.user?.id) {
        console.log("[📊 DASHBOARD] 🚫 Pas de session, redirection vers /login")
        redirect('/login')
    }

    const userId = session.user.id
    console.log("[📊 DASHBOARD] 📈 Récupération des stats pour userId:", userId)
    const t0 = Date.now()
    const result = await getUserStatsAction(userId)
    console.log("[📊 DASHBOARD] ⏱️ getUserStatsAction terminé en", Date.now() - t0, "ms, success:", result.success)

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

    console.log("[📊 DASHBOARD] 📊 Stats finales:", stats)

    const criteriaAverages = [
        { name: 'Animation', value: stats.avgAnimation, color: 'from-green-400 to-teal-400' },
        { name: 'Musique', value: stats.avgMusic, color: 'from-purple-400 to-pink-400' },
        { name: 'Scénario', value: stats.avgScenario, color: 'from-blue-400 to-cyan-400' },
        { name: 'Global', value: parseFloat(((stats.avgAnimation + stats.avgMusic + stats.avgScenario) / 3).toFixed(1)) || 0, color: 'from-orange-400 to-red-400' }
    ]

    console.log("[📊 DASHBOARD] 🎨 Template Dashboard prêt, rendu en cours...")
    return (
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
    )
}
