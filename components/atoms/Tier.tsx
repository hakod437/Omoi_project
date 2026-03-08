import React from 'react'
import type { Tier } from '@/types/anime'

const TIER_COLORS: Record<Tier, string> = {
    S: 'var(--tier-s)',
    A: 'var(--tier-a)',
    B: 'var(--tier-b)',
    C: 'var(--tier-c)',
    D: 'var(--tier-d)',
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
            className="flex items-center justify-center w-8 h-8 rounded-lg font-kawaii text-white text-lg shadow-lg border border-white/20"
            style={{ background: TIER_COLORS[tier] }}
        >
            {tier}
        </div>
    )
}
