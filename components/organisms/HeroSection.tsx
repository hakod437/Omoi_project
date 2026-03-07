'use client'

import React from 'react'
import Image from 'next/image'
import { Badge } from '@/components/atoms/Base'
import { Star, MessageCircle, Film, TrendingUp } from 'lucide-react'
import { TierBadge } from '@/components/atoms/Tier'

interface HeroSectionProps {
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

export const HeroSection = ({
  title,
  subtitle,
  imageUrl,
  genres,
  studio,
  episodes,
  communityRating,
  totalReviews,
  animationScore,
  globalTier
}: HeroSectionProps) => {
  return (
    <div className="relative h-[500px] w-full rounded-3xl overflow-hidden shadow-2xl mb-8">
      {/* Background image with gradient overlay */}
      <Image
        src={imageUrl}
        alt={title}
        fill
        className="object-cover"
        priority
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
      
      {/* Content overlay */}
      <div className="absolute bottom-0 left-0 right-0 p-8 space-y-6">
        {/* Genre tags */}
        <div className="flex flex-wrap gap-2">
          {genres.map((genre) => (
            <Badge 
              key={genre} 
              variant="primary" 
              className="text-sm px-3 py-1 bg-white/20 backdrop-blur-md border border-white/30 text-white font-kawaii"
            >
              {genre}
            </Badge>
          ))}
        </div>

        {/* Title and subtitle */}
        <div className="space-y-2">
          <h1 className="text-5xl md:text-6xl font-kawaii text-white tracking-tight drop-shadow-lg">
            {title}
          </h1>
          <p className="text-xl text-white/90 font-medium font-ui">
            {subtitle} - Studio {studio} - {episodes} épisodes
          </p>
        </div>

        {/* Stats */}
        <div className="flex flex-wrap gap-6 items-center">
          <div className="flex items-center gap-2 text-white">
            <Star className="text-yellow-400" size={20} />
            <span className="font-medium font-ui">Communauté {communityRating}/10</span>
          </div>
          <div className="flex items-center gap-2 text-white">
            <MessageCircle size={20} />
            <span className="font-medium font-ui">{totalReviews.toLocaleString()} avis</span>
          </div>
          <div className="flex items-center gap-2 text-white">
            <Film size={20} />
            <span className="font-medium font-ui">Animation {animationScore}/10</span>
          </div>
          <div className="flex items-center gap-2">
            <TierBadge tier={globalTier as any} />
            <span className="text-white font-medium font-ui">Tier {globalTier}</span>
          </div>
        </div>
      </div>
    </div>
  )
}
