'use client'

import React from 'react'
import { Heart, Clock } from 'lucide-react'
import { TierBadge } from '@/components/atoms/Tier'

interface ReviewCardProps {
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

export const ReviewCard = ({
  username,
  avatar,
  timeAgo,
  tiers,
  content,
  likes,
  isLiked = false
}: ReviewCardProps) => {
  return (
    <div className="rounded-2xl border p-6 space-y-4" style={{
      backgroundColor: 'var(--card)',
      borderColor: 'var(--border)'
    }}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          {avatar ? (
            <img 
              src={avatar} 
              alt={username}
              className="w-10 h-10 rounded-full"
            />
          ) : (
            <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{
              background: 'linear-gradient(to bottom right, var(--primary), var(--accent))'
            }}>
              <span className="text-white font-bold">
                {username.charAt(0).toUpperCase()}
              </span>
            </div>
          )}
          <div>
            <div className="font-medium font-ui" style={{ color: 'var(--foreground)' }}>{username}</div>
            <div className="flex items-center gap-1 text-xs font-ui" style={{ color: 'var(--foreground)', opacity: 0.6 }}>
              <Clock size={12} />
              {timeAgo}
            </div>
          </div>
        </div>
        
        {/* Tiers */}
        <div className="flex gap-1">
          <TierBadge tier={tiers.animation as any} />
          <TierBadge tier={tiers.scenario as any} />
          <TierBadge tier={tiers.music as any} />
        </div>
      </div>

      {/* Content */}
      <p className="leading-relaxed font-body" style={{ color: 'var(--foreground)', opacity: 0.8 }}>
        {content}
      </p>

      {/* Actions */}
      <div className="flex items-center gap-4 pt-2">
        <button 
          className={`flex items-center gap-2 px-3 py-1 rounded-lg transition-all font-ui ${
            isLiked 
              ? 'bg-red-500/20 text-red-400 border border-red-500/30' 
              : 'border hover:bg-opacity-50'
          }`}
          style={{
            backgroundColor: isLiked ? 'rgba(239, 68, 68, 0.2)' : 'var(--muted)',
            borderColor: isLiked ? 'rgba(239, 68, 68, 0.3)' : 'var(--border)',
            color: isLiked ? '#f87171' : 'var(--foreground)',
            opacity: isLiked ? 1 : 0.6
          }}
        >
          <Heart size={16} className={isLiked ? 'fill-current' : ''} />
          <span className="text-sm font-medium">{likes}</span>
          <span className="text-sm">Utile</span>
        </button>
      </div>
    </div>
  )
}
