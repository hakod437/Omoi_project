import React from 'react'

import { HeroSection } from '@/components/organisms/HeroSection'
import { SynopsisCard } from '@/components/molecules/SynopsisCard'
import { SpecialAnimationScore } from '@/components/molecules/SpecialAnimationScore'
import { CommunityScores } from '@/components/molecules/CommunityScores'
import { TierDistribution } from '@/components/molecules/TierDistribution'
import { RecentReviews } from '@/components/organisms/RecentReviews'
import { ReviewForm } from '@/components/organisms/ReviewForm'
import { Breadcrumb, type BreadcrumbItem } from '@/components/molecules/Breadcrumb'
import { AnimeInformationCard } from '@/components/molecules/AnimeInformationCard'

export interface AnimeDetailTemplateProps {
  animeId: string
  hero: {
    title: string
    subtitle: string
    imageUrl: string
    genres: string[]
    studio: string
    episodes: number
    communityRating: number
    totalReviews: number
    animationScore: number
    globalTier: string
  }
  breadcrumbItems: BreadcrumbItem[]
  synopsis: string
  information: {
    studio?: string
    diffusion?: string
    genre?: string
    episodes?: string
    statut?: string
    source?: string
  }
  communityScores: {
    animation: number
    scenario: number
    music: number
  }
  tierDistribution: { tier: string; percentage: number; count: number }[]
  reviews: Array<{
    username: string
    avatar?: string
    timeAgo: string
    tiers: { animation: string; scenario: string; music: string }
    content: string
    likes: number
  }>
}

export const AnimeDetailTemplate = ({
  animeId,
  hero,
  breadcrumbItems,
  synopsis,
  information,
  communityScores,
  tierDistribution,
  reviews
}: AnimeDetailTemplateProps) => {
  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--background)' }}>
      <div className="container mx-auto px-4 pt-6">
        <Breadcrumb items={breadcrumbItems} />
      </div>

      <div className="container mx-auto px-4 pt-4">
        <HeroSection {...hero} />
      </div>

      <div className="container mx-auto px-4 pb-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 space-y-6">
                <SynopsisCard synopsis={synopsis} />
                <AnimeInformationCard {...information} />
              </div>
              <div>
                <SpecialAnimationScore score={communityScores.animation} />
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <CommunityScores
                scores={[
                  { category: 'Animation', score: communityScores.animation, maxScore: 10 },
                  { category: 'Scénario', score: communityScores.scenario, maxScore: 10 },
                  { category: 'Musique', score: communityScores.music, maxScore: 10 }
                ]}
              />
              <TierDistribution data={tierDistribution} />
            </div>

            <RecentReviews reviews={reviews} />
          </div>

          <div className="lg:sticky lg:top-8 h-fit space-y-6">
            <ReviewForm animeId={animeId} />
          </div>
        </div>
      </div>
    </div>
  )
}
