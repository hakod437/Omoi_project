'use client'

import React from 'react'
import { TierBadge } from '@/components/atoms/Tier'

interface TierData {
  tier: string
  percentage: number
  count: number
}

interface TierDistributionProps {
  data: TierData[]
}

export const TierDistribution = ({ data }: TierDistributionProps) => {
  return (
    <div className="rounded-2xl border p-6 space-y-4" style={{
      backgroundColor: 'var(--card)',
      borderColor: 'var(--primary)'
    }}>
      <h3 className="text-xl font-kawaii" style={{ color: 'var(--primary)' }}>Répartition des Tiers</h3>
      
      {/* Bar chart */}
      <div className="flex h-8 rounded-full overflow-hidden" style={{ backgroundColor: 'var(--muted)' }}>
        {data.map((item) => (
          <div
            key={item.tier}
            className="flex items-center justify-center transition-all duration-1000"
            style={{
              width: `${item.percentage}%`,
              backgroundColor: item.tier === 'S' ? '#ff4757' : 
                             item.tier === 'A' ? '#ffa502' : 
                             item.tier === 'B' ? '#2ed573' : 
                             item.tier === 'C' ? '#1e90ff' : '#747d8c'
            }}
          >
            {item.percentage > 5 && (
              <span className="text-white text-xs font-bold">{item.percentage}%</span>
            )}
          </div>
        ))}
      </div>

      {/* Legend */}
      <div className="grid grid-cols-5 gap-2">
        {data.map((item) => (
          <div key={item.tier} className="text-center space-y-1">
            <TierBadge tier={item.tier as any} />
            <div className="text-xs font-ui" style={{ color: 'var(--foreground)', opacity: 0.6 }}>
              {item.percentage}%
            </div>
            <div className="text-xs font-ui" style={{ color: 'var(--foreground)', opacity: 0.4 }}>
              ({item.count})
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
