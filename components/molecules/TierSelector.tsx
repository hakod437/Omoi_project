'use client'

import React from 'react'
import type { Tier } from '@/types/anime'
import { TierBadge } from '../atoms/Tier'

interface TierButtonProps {
    tier: Tier
    selected: boolean
    onClick: (tier: Tier) => void
    label: string
}

export const TierButton = ({ tier, selected, onClick, label }: TierButtonProps) => {
    return (
        <button
            onClick={() => onClick(tier)}
            className={`
        flex flex-col items-center gap-2 p-3 rounded-xl transition-all
        ${selected
                    ? 'bg-[var(--primary)]/20 border-2 border-[var(--primary)] scale-105 shadow-xl'
                    : 'bg-[var(--card)] border-2 border-transparent hover:bg-[var(--muted)] opacity-70 hover:opacity-100'
                }
      `}
        >
            <TierBadge tier={tier} />
            <span className="text-xs font-bold text-[var(--foreground)] opacity-80 uppercase tracking-tighter">
                {label}
            </span>
        </button>
    )
}

export const TierSelector = ({
    value,
    onChange,
    title
}: {
    value: Tier | null,
    onChange: (t: Tier) => void,
    title: string
}) => {
    const tiers: Tier[] = ['S', 'A', 'B', 'C', 'D']

    return (
        <div className="space-y-3">
            <h4 className="text-sm font-bold uppercase tracking-widest text-[var(--primary)]">
                {title}
            </h4>
            <div className="flex gap-2">
                {tiers.map((t) => (
                    <TierButton
                        key={t}
                        tier={t}
                        selected={value === t}
                        onClick={onChange}
                        label={t}
                    />
                ))}
            </div>
        </div>
    )
}
