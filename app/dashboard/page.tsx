import React from 'react'
import { Tv, Trophy, Music, Book, Play, User, Film, BookText, Heart } from 'lucide-react'
import { DashboardTemplate } from '@/components/templates/DashboardTemplate'

export const dynamic = 'force-dynamic'

export default async function Dashboard() {
    // Mock data pour correspondre à l'image
    const stats = {
        totalAnimes: 42,
        tierSCount: 18,
        avgAnimation: 9.1,
        avgScenario: 7.8,
        avgMusic: 8.4
    }

    const criteriaAverages = [
        { name: 'Animation', value: 9.1, color: 'from-green-400 to-teal-400' },
        { name: 'Musique', value: 8.4, color: 'from-purple-400 to-pink-400' },
        { name: 'Scénario', value: 7.8, color: 'from-blue-400 to-cyan-400' },
        { name: 'Global', value: 8.6, color: 'from-orange-400 to-red-400' }
    ]

    const tastes = [
        { name: 'Action', value: 88, color: 'from-red-400 to-orange-400' },
        { name: 'Isekai', value: 72, color: 'from-purple-400 to-indigo-400' },
        { name: 'Seinen', value: 60, color: 'from-blue-400 to-cyan-400' },
        { name: 'Romance', value: 45, color: 'from-pink-400 to-rose-400' },
        { name: 'Slice of Life', value: 30, color: 'from-green-400 to-teal-400' }
    ]

    const favoriteStudios = [
        { name: 'ufotable', count: 8, color: 'from-orange-400 to-red-400' },
        { name: 'MAPPA', count: 7, color: 'from-purple-400 to-pink-400' },
        { name: 'Wit Studio', count: 4, color: 'from-blue-400 to-cyan-400' },
        { name: 'KyoAni', count: 3, color: 'from-green-400 to-teal-400' },
        { name: 'Bones', count: 2, color: 'from-yellow-400 to-orange-400' }
    ]

    const tierRows = [
        {
            tier: 'S',
            title: 'Tier S — Légendaire 🏆',
            subtitle: 'Les chefs-d’œuvre absolus',
            count: 18,
            expanded: true,
            animes: [
                { id: '1', title: 'Demon Slayer', gradient: 'from-fuchsia-700 via-purple-700 to-violet-800', dots: ['S', 'S', 'S'] },
                { id: '2', title: 'Attack on Titan', gradient: 'from-emerald-900 via-teal-800 to-emerald-700', dots: ['S', 'A', 'S'] },
                { id: '3', title: 'Your Name', gradient: 'from-sky-500 via-cyan-500 to-blue-600', dots: ['S', 'S', 'A'] },
                { id: '4', title: 'FMA Brotherhood', gradient: 'from-red-950 via-rose-900 to-amber-800', dots: ['S', 'S', 'S'] },
            ],
            remainingLabel: '14 AUTRES',
        },
        {
            tier: 'A',
            title: 'Tier A — Excellent 🔥',
            subtitle: 'Des animes qui déchirent vraiment',
            count: 12,
            expanded: true,
            animes: [
                { id: '5', title: 'Jujutsu Kaisen', gradient: 'from-zinc-700 via-slate-700 to-indigo-950', dots: ['A', 'A', 'A'] },
                { id: '6', title: 'Violet Evergarden', gradient: 'from-rose-800 via-fuchsia-800 to-purple-900', dots: ['A', 'S', 'A'] },
                { id: '7', title: 'Chainsaw Man', gradient: 'from-indigo-800 via-blue-900 to-slate-950', dots: ['A', 'A', 'S'] },
            ],
            remainingLabel: '9 AUTRES',
        },
        {
            tier: 'B',
            title: 'Tier B — Bien 👍',
            subtitle: 'Bons animes, pas mémorables',
            count: 7,
            expanded: false,
            animes: [],
            remainingLabel: '',
        },
        {
            tier: 'C',
            title: 'Tier C — Moyen 😐',
            subtitle: 'Décevants ou sans intérêt',
            count: 4,
            expanded: false,
            animes: [],
            remainingLabel: '',
        },
        {
            tier: 'D',
            title: 'Tier D — Nul 💀',
            subtitle: 'À éviter absolument',
            count: 1,
            expanded: false,
            animes: [],
            remainingLabel: '',
        },
    ] as const

    const activity = [
        {
            id: 'a1',
            icon: <Film size={16} className="text-[var(--primary)]" />,
            text: (
                <>
                    Tu as noté <span className="font-bold text-[var(--primary)]">Demon Slayer</span> — Animation, Scénario, Musique
                </>
            ),
            right: (
                <>
                    <span className="rounded-full border border-[var(--border)] bg-[var(--primary)]/10 px-3 py-1 text-xs font-bold text-[var(--primary)]">
                        Tier S
                    </span>
                    <span className="ml-4 text-xs text-[var(--foreground)]/50">Il y a 2h</span>
                </>
            ),
        },
        {
            id: 'a2',
            icon: <User size={16} className="text-[var(--primary)]" />,
            text: (
                <>
                    <span className="font-bold text-[var(--primary)]">SakuraDream</span> a comparé ses goûts avec toi — <span className="font-bold text-[var(--primary)]">76% de compatibilité</span>
                </>
            ),
            right: <span className="text-xs text-[var(--foreground)]/50">Hier</span>,
        },
        {
            id: 'a3',
            icon: <BookText size={16} className="text-[var(--primary)]" />,
            text: (
                <>
                    Tu as noté <span className="font-bold text-[var(--primary)]">Chainsaw Man</span> — Scénario et Musique
                </>
            ),
            right: (
                <>
                    <span className="rounded-full border border-[var(--border)] bg-[var(--primary)]/10 px-3 py-1 text-xs font-bold text-[var(--primary)]">
                        Tier A
                    </span>
                    <span className="ml-4 text-xs text-[var(--foreground)]/50">Il y a 3 jours</span>
                </>
            ),
        },
        {
            id: 'a4',
            icon: <Heart size={16} className="text-[var(--primary)]" />,
            text: (
                <>
                    Ton avis sur <span className="font-bold text-[var(--primary)]">Attack on Titan</span> a reçu <span className="font-bold text-[var(--primary)]">142 likes</span>
                </>
            ),
            right: <span className="text-xs text-[var(--foreground)]/50">Il y a 5 jours</span>,
        },
    ]

    return (
        <DashboardTemplate
            usernameLabel="🔥 YUKI_OTAKU"
            statsSubtitle={`${stats.totalAnimes} animes notés • Membre depuis janvier 2024`}
            addAnimeHref="/anime"
            statsCards={[
                { icon: <Tv size={24} />, value: `${stats.totalAnimes} ANIMES NOTÉS` },
                { icon: <Trophy size={24} />, value: `${stats.tierSCount} TIER S` },
                { icon: <Play size={24} />, value: `${stats.avgAnimation} MOY. ANIMATION` },
                { icon: <Book size={24} />, value: `${stats.avgScenario} MOY. SCÉNARIO` },
                { icon: <Music size={24} />, value: `${stats.avgMusic} MOY. MUSIQUE` },
            ]}
            criteriaAverages={criteriaAverages}
            tastes={tastes}
            favoriteStudios={favoriteStudios.map((s) => ({ ...s, maxCount: 8 }))}
            tierRows={tierRows}
            activity={activity}
        />
    )
}
