import React from 'react'
import type { Tier } from '@/types/anime'

const TIER_COLORS: Record<Tier, string> = {
    S: '#ff4757', // High impact red
    A: '#ffa502', // Orange
    B: '#2ed573', // Green
    C: '#1e90ff', // Blue
    D: '#747d8c', // Grey
}

export const TierDot = ({ tier, size = 'md' }: { tier: Tier, size?: 'sm' | 'md' | 'lg' }) => {
    const sizes = {
        sm: 'w-2 h-2',
        md: 'w-3 h-3',
        lg: 'w-5 h-5',
    }

    return (
        <div
            className={`${sizes[size]} rounded-full shadow-sm`}
            style={{ backgroundColor: TIER_COLORS[tier] }}
            title={`Tier ${tier}`}
        />
    )
}

export const TierBadge = ({ tier }: { tier: Tier }) => {
    return (
        <div
            className="flex items-center justify-center w-8 h-8 rounded-lg font-kawaii text-white text-lg shadow-lg"
            style={{ backgroundColor: TIER_COLORS[tier] }}
        >
            {tier}
        </div>
    )
}
