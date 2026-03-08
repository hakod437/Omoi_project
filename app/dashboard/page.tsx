import React from 'react'
import { Tv, Trophy, Music, Book, Play } from 'lucide-react'
import { DashboardTemplate } from '@/components/templates/DashboardTemplate'
import { getUserStatsAction } from '@/actions/user.actions'

export const dynamic = 'force-dynamic'

export default async function Dashboard() {
    // In a real scenario, we'd get the userId from the session
    const userId = "temp-user-id"
    const result = await getUserStatsAction(userId)

    const stats = result.success ? result.data : {
        totalAnimes: 0,
        tierSCount: 0,
        avgAnimation: 0,
        avgScenario: 0,
        avgMusic: 0
    }

    const criteriaAverages = [
        { name: 'Animation', value: stats.avgAnimation, color: 'from-green-400 to-teal-400' },
        { name: 'Musique', value: stats.avgMusic, color: 'from-purple-400 to-pink-400' },
        { name: 'Scénario', value: stats.avgScenario, color: 'from-blue-400 to-cyan-400' },
        { name: 'Global', value: parseFloat(((stats.avgAnimation + stats.avgMusic + stats.avgScenario) / 3).toFixed(1)) || 0, color: 'from-orange-400 to-red-400' }
    ]

    // Simplified for now, we'll keep the template mocks for tastes and studios as those need more logic
    return (
        <DashboardTemplate
            usernameLabel="Vault Master"
            statsSubtitle={`${stats.totalAnimes} animes in your vault`}
            addAnimeHref="/explorer"
            statsCards={[
                { icon: <Tv size={24} />, value: `${stats.totalAnimes} ANIMES` },
                { icon: <Trophy size={24} />, value: `${stats.tierSCount} TIER S` },
                { icon: <Play size={24} />, value: `${stats.avgAnimation} MOT. ANIM` },
                { icon: <Book size={24} />, value: `${stats.avgScenario} MOY. SCEN` },
                { icon: <Music size={24} />, value: `${stats.avgMusic} MOY. MUS` },
            ]}
            criteriaAverages={criteriaAverages}
            tastes={[]} // To be implemented later with genre analysis
            favoriteStudios={[]} // To be implemented later
            tierRows={stats.tierRows || []}
            activity={(stats.activities || []).map((a: any) => ({
                id: a.id,
                icon: <Tv size={16} className="text-primary" />,
                text: a.content || `Activity: ${a.type}`,
                right: <span className="text-xs opacity-50">{new Date(a.createdAt).toLocaleDateString()}</span>
            }))}
        />
    )
}
