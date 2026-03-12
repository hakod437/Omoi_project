import React from 'react'
import { AnimeDetailTemplate } from '@/components/templates/AnimeDetailTemplate'
import { getTierFromScore } from '@/lib/scoring'
import prisma from '@/lib/prisma'

import { auth } from '@/lib/auth'
import { redirect } from 'next/navigation'

export default async function AnimeDetail({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params
    const session = await auth()

    // Protection server-side : redirige vers /login si non connecté
    if (!session?.user) {
        redirect('/login')
    }

    const res = await fetch(`https://api.jikan.moe/v4/anime/${encodeURIComponent(id)}`, {
        next: { revalidate: 3600 }
    })

    if (!res.ok) return <div>Anime not found</div>
    const payload = await res.json()
    const anime = payload?.data

    if (!anime) return <div>Anime not found</div>

    const genres = (anime.genres?.map((g: any) => g.name) || []) as string[]

    let animeRecord = await prisma.anime.findUnique({
        where: { malId: Number(id) },
        select: { id: true, malId: true }
    })

    if (!animeRecord) {
        animeRecord = await prisma.anime.create({
            data: {
                malId: Number(id),
                title: anime.title,
                titleEnglish: anime.titleEnglish || anime.title_english || null,
                imageUrl: anime.images?.webp?.large_image_url || anime.images?.jpg?.large_image_url || null,
                episodes: anime.episodes || null,
                status: anime.status || null,
                year: anime.year || null,
                season: anime.season || null,
                studio: anime.studios?.[0]?.name || null,
                genres: JSON.stringify(genres)
            },
            select: { id: true, malId: true }
        })
    }

    let userStatus = undefined
    if (session?.user?.id) {
        const userList = await prisma.userList.findUnique({
            where: {
                userId_animeId: {
                    userId: session.user.id,
                    animeId: animeRecord.id
                }
            }
        })
        userStatus = userList?.status
    }

    const communityStats = {
        totalReviews: 0,
        avgGlobalScore: 0,
        avgAnimationScore: 0,
        avgScenarioScore: 0,
        avgMusicScore: 0,
        tierDistribution: { S: { count: 0, percentage: 0 }, A: { count: 0, percentage: 0 }, B: { count: 0, percentage: 0 }, C: { count: 0, percentage: 0 }, D: { count: 0, percentage: 0 } }
    }

    const formattedReviews: any[] = []

    const airedText = (anime.aired?.string as string | undefined) || undefined
    const yearText = (anime.year as number | undefined) ? String(anime.year) : undefined

    const studio = anime.studios?.[0]?.name || 'Unknown'
    const episodes = anime.episodes || 0
    const communityGlobal = communityStats?.avgGlobalScore || 0
    const globalTier = getTierFromScore(communityGlobal)

    return (
        <AnimeDetailTemplate
            animeId={animeRecord.id}
            breadcrumbItems={[
                { label: 'Accueil', href: '/' },
                { label: 'Explorer', href: '/explorer' },
                { label: anime.title }
            ]}
            hero={{
                title: anime.title,
                subtitle: anime.titleEnglish || '',
                imageUrl: anime.images.webp.large_image_url,
                genres,
                studio,
                episodes,
                communityRating: communityGlobal,
                totalReviews: communityStats?.totalReviews || 0,
                animationScore: communityStats?.avgAnimationScore || 0,
                globalTier
            }}
            synopsis={anime.synopsis || 'Aucun synopsis disponible.'}
            information={{
                studio,
                episodes: episodes ? String(episodes) : undefined,
                diffusion: airedText || yearText,
                statut: anime.status || undefined,
                source: anime.source || undefined,
                genre: (anime.genres?.map((g: any) => g.name).slice(0, 2).join(' · ')) || undefined
            }}
            communityScores={{
                animation: communityStats?.avgAnimationScore || 0,
                scenario: communityStats?.avgScenarioScore || 0,
                music: communityStats?.avgMusicScore || 0
            }}
            tierDistribution={[
                { tier: 'S', percentage: communityStats?.tierDistribution.S.percentage || 0, count: communityStats?.tierDistribution.S.count || 0 },
                { tier: 'A', percentage: communityStats?.tierDistribution.A.percentage || 0, count: communityStats?.tierDistribution.A.count || 0 },
                { tier: 'B', percentage: communityStats?.tierDistribution.B.percentage || 0, count: communityStats?.tierDistribution.B.count || 0 },
                { tier: 'C', percentage: communityStats?.tierDistribution.C.percentage || 0, count: communityStats?.tierDistribution.C.count || 0 },
                { tier: 'D', percentage: communityStats?.tierDistribution.D.percentage || 0, count: communityStats?.tierDistribution.D.count || 0 }
            ]}
            reviews={formattedReviews}
            userId={session?.user?.id || undefined}
            initialStatus={userStatus}
        />
    )
}
