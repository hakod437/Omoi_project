import React from 'react'
import { AnimeDetailTemplate } from '@/components/templates/AnimeDetailTemplate'

import { AnimeService } from '@/services/anime.service'
import { CommunityService } from '@/services/community.service'
import { getTierFromScore } from '@/lib/scoring'

export default async function AnimeDetail({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params
    const result = await AnimeService.getById(parseInt(id))

    if (!result.success || !result.data) return <div>{result.error || 'Anime not found'}</div>
    const anime = result.data

    // Get community data
    const communityStatsResult = await CommunityService.getCommunityStats(id)
    const reviewsResult = await CommunityService.getRecentReviews(id, 5)

    const communityStats = communityStatsResult.success ? communityStatsResult.data : {
        totalReviews: 0,
        avgGlobalScore: 0,
        avgAnimationScore: 0,
        avgScenarioScore: 0,
        avgMusicScore: 0,
        tierDistribution: { S: { count: 0, percentage: 0 }, A: { count: 0, percentage: 0 }, B: { count: 0, percentage: 0 }, C: { count: 0, percentage: 0 }, D: { count: 0, percentage: 0 } }
    }

    const reviews = reviewsResult.success ? (reviewsResult.data || []) : []

    // Format reviews for display
    const formattedReviews = reviews.map(review => ({
        username: review.username,
        avatar: review.avatar,
        timeAgo: `il y a ${Math.floor((Date.now() - review.createdAt.getTime()) / (1000 * 60 * 60 * 24))} jours`,
        tiers: {
            animation: review.tiers.animation,
            scenario: review.tiers.scenario,
            music: review.tiers.music
        },
        content: review.content,
        likes: review.likes
    }))

    const airedText = (anime.aired?.string as string | undefined) || undefined
    const yearText = (anime.year as number | undefined) ? String(anime.year) : undefined

    const studio = anime.studios?.[0]?.name || 'Unknown'
    const episodes = anime.episodes || 0
    const communityGlobal = communityStats?.avgGlobalScore || 0
    const globalTier = getTierFromScore(communityGlobal)

    return (
        <AnimeDetailTemplate
            animeId={id}
            breadcrumbItems={[
                { label: 'Accueil', href: '/' },
                { label: 'Animes', href: '/explorer' },
                { label: anime.title }
            ]}
            hero={{
                title: anime.title,
                subtitle: anime.titleEnglish || '',
                imageUrl: anime.images.webp.large_image_url,
                genres: anime.genres?.map((g: any) => g.name) || [],
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
        />
    )
}
