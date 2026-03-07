'use client'

import React from 'react'
import { Clapperboard } from 'lucide-react'

interface SpecialAnimationScoreProps {
  score: number
}

export const SpecialAnimationScore = ({ score }: SpecialAnimationScoreProps) => {
  return (
    <div className="rounded-2xl border p-6 space-y-4" style={{
      backgroundColor: 'var(--card)',
      borderColor: 'var(--primary)'
    }}>
      <div className="flex items-center gap-3">
        <Clapperboard style={{ color: 'var(--primary)' }} size={24} />
        <div>
          <h3 className="text-xl font-kawaii" style={{ color: 'var(--primary)' }}>SCORE ANIMATION SPÉCIAL</h3>
          <p className="text-xs uppercase tracking-wider font-ui" style={{ color: 'var(--primary)', opacity: 0.8 }}>Critère exclusif AnimeVault</p>
        </div>
      </div>
      <div className="text-5xl font-kawaii font-bold" style={{ color: 'var(--primary)' }}>
        {score}
      </div>
    </div>
  )
}
