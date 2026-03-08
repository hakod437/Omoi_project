'use client'

import { motion } from 'framer-motion'
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
        <motion.button
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => onClick(tier)}
            className={`
        flex flex-col items-center gap-2 p-4 rounded-2xl transition-all duration-300
        ${selected
                    ? 'bg-white/10 border-2 border-[var(--primary)] shadow-[var(--glow)] z-10'
                    : 'bg-white/5 border-2 border-transparent hover:bg-white/10 opacity-60 hover:opacity-100 backdrop-blur-md'
                }
      `}
        >
            <div className={`transition-transform duration-500 ${selected ? 'scale-110' : ''}`}>
                <TierBadge tier={tier} />
            </div>
            <span className={`text-[10px] font-black uppercase tracking-widest transition-colors ${selected ? 'text-[var(--primary)]' : 'text-white/40'}`}>
                {label}
            </span>
        </motion.button>
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
