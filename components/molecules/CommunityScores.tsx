'use client'

import React from 'react'

interface ScoreItem {
  category: string
  score: number
  maxScore: number
}

interface CommunityScoresProps {
  scores: ScoreItem[]
}

export const CommunityScores = ({ scores }: CommunityScoresProps) => {
  return (
    <div className="rounded-2xl border p-6 space-y-4" style={{
      backgroundColor: 'var(--card)',
      borderColor: 'var(--primary)'
    }}>
      <h3 className="text-xl font-kawaii" style={{ color: 'var(--primary)' }}>Scores de la Communauté</h3>
      <div className="space-y-3">
        {scores.map((item) => (
          <div key={item.category} className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="font-medium font-ui" style={{ color: 'var(--foreground)', opacity: 0.8 }}>{item.category}</span>
              <span className="font-bold" style={{ color: 'var(--primary)' }}>{item.score}/{item.maxScore}</span>
            </div>
            <div className="w-full rounded-full h-2" style={{ backgroundColor: 'var(--muted)' }}>
              <div 
                className="h-2 rounded-full transition-all duration-1000"
                style={{
                  width: `${(item.score / item.maxScore) * 100}%`,
                  backgroundColor: 'var(--primary)'
                }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
