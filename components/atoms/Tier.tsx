import React from 'react'
import type { Tier } from '@/types/anime'
import { cn } from './Base'

const TIER_COLORS: Record<Tier, string> = {
    S: 'var(--tier-s)',
    A: 'var(--tier-a)',
    B: 'var(--tier-b)',
    C: 'var(--tier-c)',
    D: 'var(--tier-d)',
}

const TIER_EMOJIS: Record<Tier, string> = {
    S: '🏆',
    A: '🔥',
    B: '👍',
    C: '😐',
    D: '💀',
}

export const TierDot = ({ 
    tier, 
    size = 'md',
    variant = 'default',
    animated = false 
}: { 
    tier: Tier, 
    size?: 'sm' | 'md' | 'lg' | 'xl'
    variant?: 'default' | 'glass' | 'neumorphic'
    animated?: boolean
}) => {
    const sizes = {
        sm: 'w-2 h-2',
        md: 'w-3 h-3',
        lg: 'w-4 h-4',
        xl: 'w-6 h-6',
    }

    const variants = {
        default: `rounded-full shadow-lg transform transition-all duration-300 hover:scale-125 cursor-pointer`,
        glass: `rounded-full bg-white/20 backdrop-blur-md border border-white/30 shadow-lg shadow-white/20 transform transition-all duration-300 hover:scale-125 cursor-pointer`,
        neumorphic: `rounded-full shadow-[4px_4px_8px_rgba(0,0,0,0.2),_-4px_-4px_8px_rgba(255,255,255,0.1)] transform transition-all duration-300 hover:scale-125 cursor-pointer active:shadow-[inset_2px_2px_4px_rgba(0,0,0,0.2),_inset_-2px_-2px_4px_rgba(255,255,255,0.1)]`
    }

    return (
        <div
            className={cn(
                sizes[size],
                variants[variant],
                animated && 'animate-pulse'
            )}
            style={{ backgroundColor: TIER_COLORS[tier] }}
            title={`Tier ${tier} - ${getTierDescription(tier)}`}
        >
            {animated && (
                <div className="absolute inset-0 rounded-full animate-ping opacity-75" style={{ backgroundColor: TIER_COLORS[tier] }} />
            )}
        </div>
    )
}

export const TierBadge = ({ 
    tier, 
    size = 'md',
    variant = 'default',
    showEmoji = false,
    animated = false 
}: { 
    tier: Tier
    size?: 'sm' | 'md' | 'lg'
    variant?: 'default' | 'glass' | 'neumorphic' | 'gradient'
    showEmoji?: boolean
    animated?: boolean
}) => {
    const sizes = {
        sm: 'w-6 h-6 text-xs',
        md: 'w-8 h-8 text-sm',
        lg: 'w-10 h-10 text-base',
    }

    const variants = {
        default: `flex items-center justify-center rounded-xl font-kawaii text-white shadow-lg border border-white/20 transform transition-all duration-300 hover:scale-110 hover:shadow-xl cursor-pointer`,
        glass: `flex items-center justify-center rounded-xl font-kawaii text-white backdrop-blur-md bg-white/20 border border-white/30 shadow-lg shadow-white/20 transform transition-all duration-300 hover:scale-110 hover:shadow-xl cursor-pointer`,
        neumorphic: `flex items-center justify-center rounded-xl font-kawaii text-white shadow-[6px_6px_12px_rgba(0,0,0,0.3),_-6px_-6px_12px_rgba(255,255,255,0.1)] transform transition-all duration-300 hover:scale-110 cursor-pointer active:shadow-[inset_3px_3px_6px_rgba(0,0,0,0.3),_inset_-3px_-3px_6px_rgba(255,255,255,0.1)]`,
        gradient: `flex items-center justify-center rounded-xl font-kawaii text-white bg-gradient-to-br from-white/20 to-transparent backdrop-blur-md border border-white/30 shadow-lg shadow-white/20 transform transition-all duration-300 hover:scale-110 hover:shadow-xl cursor-pointer`
    }

    return (
        <div
            className={cn(
                sizes[size],
                variants[variant],
                animated && 'animate-bounce'
            )}
            style={{ 
                background: variant === 'gradient' 
                    ? `linear-gradient(135deg, ${TIER_COLORS[tier]}, ${TIER_COLORS[tier]}dd)`
                    : TIER_COLORS[tier]
            }}
            title={`Tier ${tier} - ${getTierDescription(tier)}`}
        >
            {showEmoji ? (
                <span className="text-lg">{TIER_EMOJIS[tier]}</span>
            ) : (
                tier
            )}
        </div>
    )
}

export const TierCard = ({ 
    tier, 
    title, 
    subtitle, 
    count = 0,
    animes = [],
    expanded = false,
    onToggle,
    variant = 'default'
}: {
    tier: Tier
    title: string
    subtitle: string
    count?: number
    animes?: Array<{
        id: string
        title: string
        imageUrl?: string
        dots?: Array<Tier>
    }>
    expanded?: boolean
    onToggle?: () => void
    variant?: 'default' | 'glass' | 'neumorphic'
}) => {
    const variants = {
        default: `rounded-3xl border border-[var(--border)]/20 bg-[var(--card)]/40 backdrop-blur-xl shadow-xl transform transition-all duration-500 hover:shadow-2xl cursor-pointer`,
        glass: `rounded-3xl border border-white/20 bg-white/10 backdrop-blur-xl shadow-2xl shadow-white/10 transform transition-all duration-500 hover:shadow-3xl cursor-pointer`,
        neumorphic: `rounded-3xl border border-[var(--border)]/20 bg-[var(--background)] shadow-[12px_12px_24px_rgba(0,0,0,0.1),_-12px_-12px_24px_rgba(255,255,255,0.05)] transform transition-all duration-500 hover:shadow-[8px_8px_16px_rgba(0,0,0,0.1),_-8px_-8px_16px_rgba(255,255,255,0.05)] cursor-pointer active:shadow-[inset_6px_6px_12px_rgba(0,0,0,0.1),_inset_-6px_-6px_12px_rgba(255,255,255,0.05)]`
    }

    return (
        <div
            className={cn(
                variants[variant],
                expanded ? 'scale-105' : 'hover:scale-102'
            )}
            onClick={onToggle}
        >
            {/* Header */}
            <div className="p-6 flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <TierBadge tier={tier} size="lg" variant={variant} showEmoji />
                    <div>
                        <h3 className="font-kawaii text-xl font-bold text-[var(--foreground)]">{title}</h3>
                        <p className="text-[var(--foreground)]/60 text-sm">{subtitle}</p>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <span className="text-2xl font-bold text-[var(--foreground)]">{count}</span>
                    <div className={`transform transition-transform duration-300 ${expanded ? 'rotate-180' : ''}`}>
                        <svg className="w-5 h-5 text-[var(--foreground)]/60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                    </div>
                </div>
            </div>

            {/* Expanded Content */}
            {expanded && animes.length > 0 && (
                <div className="px-6 pb-6 border-t border-[var(--border)]/20">
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-4">
                        {animes.map((anime) => (
                            <div
                                key={anime.id}
                                className="group relative rounded-xl overflow-hidden bg-[var(--muted)]/30 backdrop-blur-sm transform transition-all duration-300 hover:scale-105 cursor-pointer"
                            >
                                {anime.imageUrl && (
                                    <img
                                        src={anime.imageUrl}
                                        alt={anime.title}
                                        className="w-full h-24 object-cover"
                                    />
                                )}
                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                    <div className="absolute bottom-2 left-2 right-2">
                                        <p className="text-white text-xs font-bold truncate">{anime.title}</p>
                                        {anime.dots && (
                                            <div className="flex gap-1 mt-1">
                                                {anime.dots.map((dotTier, index) => (
                                                    <TierDot key={index} tier={dotTier} size="sm" />
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    )
}

// Helper function
function getTierDescription(tier: Tier): string {
    const descriptions = {
        S: 'Légendaire - Chef-d\'œuvre absolu',
        A: 'Excellent - Anime qui déchire',
        B: 'Bon - Agréable à regarder',
        C: 'Moyen - Décevant',
        D: 'Nul - À éviter absolument'
    }
    return descriptions[tier]
}
