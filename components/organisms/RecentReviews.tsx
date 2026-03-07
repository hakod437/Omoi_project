'use client'

import React from 'react'
import { ReviewCard } from '@/components/molecules/ReviewCard'

interface ReviewData {
  username: string
  avatar?: string
  timeAgo: string
  tiers: {
    animation: string
    scenario: string
    music: string
  }
  content: string
  likes: number
  isLiked?: boolean
}

interface RecentReviewsProps {
  reviews: ReviewData[]
}

export const RecentReviews = ({ reviews }: RecentReviewsProps) => {
  return (
    <div className="space-y-6">
      <h3 className="text-2xl font-kawaii" style={{ color: 'var(--foreground)' }}>Avis Récents</h3>
      <div className="space-y-4">
        {reviews.map((review, index) => (
          <ReviewCard key={index} {...review} />
        ))}
      </div>
    </div>
  )
}
