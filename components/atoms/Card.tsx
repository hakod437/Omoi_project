import React from 'react'
import { cn } from './Base'

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
    variant?: 'default' | 'glass' | 'neumorphic' | 'gradient' | 'elevated'
    padding?: 'sm' | 'md' | 'lg' | 'xl'
    hover?: boolean
    interactive?: boolean
}

export const Card = ({
    className,
    variant = 'default',
    padding = 'md',
    hover = true,
    interactive = false,
    children,
    ...props
}: CardProps) => {
    const variants = {
        default: 'bg-[var(--card-surface)] border border-[var(--card-border)] shadow-xl',
        glass: 'bg-white/10 backdrop-blur-xl border border-white/20 shadow-2xl shadow-white/10',
        neumorphic: 'bg-[var(--background)] shadow-[12px_12px_24px_rgba(0,0,0,0.1),_-12px_-12px_24px_rgba(255,255,255,0.05)] border border-[var(--border)]/20',
        gradient: 'bg-[var(--card-surface)] border border-[var(--card-border)] shadow-xl',
        elevated: 'bg-[var(--card-surface)] border border-[var(--card-border)] shadow-2xl'
    }

    const paddings = {
        sm: 'p-4',
        md: 'p-6',
        lg: 'p-8',
        xl: 'p-10'
    }

    const hoverEffects = hover ? 'hover:bg-[var(--card-surface-hover)] hover:shadow-2xl hover:scale-102' : ''
    const interactiveEffects = interactive ? 'cursor-pointer active:scale-98' : ''

    return (
        <div
            className={cn(
                'rounded-3xl transition-all duration-500',
                variants[variant],
                paddings[padding],
                hoverEffects,
                interactiveEffects,
                className
            )}
            {...props}
        >
            {children}
        </div>
    )
}

interface StatCardProps {
    icon: React.ReactNode
    value: string
    label?: string
    variant?: 'default' | 'glass' | 'neumorphic' | 'gradient'
    size?: 'sm' | 'md' | 'lg'
    trend?: {
        value: number
        isPositive: boolean
    }
    loading?: boolean
}

export const StatCard = ({
    icon,
    value,
    label,
    variant = 'default',
    size = 'md',
    trend,
    loading = false
}: StatCardProps) => {
    const sizes = {
        sm: 'p-4',
        md: 'p-6',
        lg: 'p-8'
    }

    const iconSizes = {
        sm: 'w-4 h-4',
        md: 'w-6 h-6',
        lg: 'w-8 h-8'
    }

    const valueSizes = {
        sm: 'text-lg',
        md: 'text-2xl',
        lg: 'text-3xl'
    }

    const labelSizes = {
        sm: 'text-xs',
        md: 'text-sm',
        lg: 'text-base'
    }

    return (
        <Card variant={variant} padding={size} hover interactive>
            <div className="flex items-start justify-between">
                <div className="flex-1">
                    <div className={cn('text-[var(--muted-foreground)] mb-2', iconSizes[variant === 'glass' ? 'md' : size])}>
                        {loading ? (
                            <div className="w-full h-4 bg-[var(--muted)]/30 rounded animate-pulse" />
                        ) : (
                            icon
                        )}
                    </div>
                    <div className={cn('font-bold text-[var(--foreground)]', valueSizes[size])}>
                        {loading ? (
                            <div className="w-20 h-6 bg-[var(--muted)]/30 rounded animate-pulse" />
                        ) : (
                            value
                        )}
                    </div>
                    {label && (
                        <div className={cn('text-[var(--muted-foreground)] mt-1', labelSizes[size])}>
                            {label}
                        </div>
                    )}
                </div>
                {trend && (
                    <div className={cn(
                        'flex items-center gap-1 text-sm font-bold',
                        trend.isPositive ? 'text-green-500' : 'text-red-500'
                    )}>
                        <span>{trend.isPositive ? '↑' : '↓'}</span>
                        <span>{Math.abs(trend.value)}%</span>
                    </div>
                )}
            </div>
        </Card>
    )
}

interface AvatarProps {
    src?: string
    alt?: string
    size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl'
    variant?: 'default' | 'glass' | 'neumorphic'
    fallback?: string
    online?: boolean
    loading?: boolean
}

export const Avatar = ({
    src,
    alt,
    size = 'md',
    variant = 'default',
    fallback = '?',
    online = false,
    loading = false
}: AvatarProps) => {
    const sizes = {
        xs: 'w-6 h-6 text-xs',
        sm: 'w-8 h-8 text-sm',
        md: 'w-10 h-10 text-base',
        lg: 'w-12 h-12 text-lg',
        xl: 'w-16 h-16 text-xl',
        '2xl': 'w-20 h-20 text-2xl'
    }

    const variants = {
        default: 'rounded-full bg-[var(--muted)] border-2 border-[var(--border)]',
        glass: 'rounded-full bg-white/20 backdrop-blur-md border-2 border-white/30',
        neumorphic: 'rounded-full bg-[var(--background)] shadow-[4px_4px_8px_rgba(0,0,0,0.1),_-4px_-4px_8px_rgba(255,255,255,0.1)] border-2 border-[var(--border)]/20'
    }

    if (loading) {
        return (
            <div className={cn(
                'rounded-full bg-[var(--muted)]/30 animate-pulse',
                sizes[size]
            )} />
        )
    }

    return (
        <div className="relative inline-block">
            <div className={cn(
                'flex items-center justify-center font-bold text-[var(--foreground)] overflow-hidden',
                sizes[size],
                variants[variant]
            )}>
                {src ? (
                    <img
                        src={src}
                        alt={alt}
                        className="w-full h-full object-cover"
                    />
                ) : (
                    fallback
                )}
            </div>
            {online && (
                <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-[var(--background)] rounded-full" />
            )}
        </div>
    )
}

interface ProgressProps {
    value: number
    max?: number
    variant?: 'default' | 'glass' | 'neumorphic' | 'gradient'
    size?: 'sm' | 'md' | 'lg'
    color?: 'primary' | 'accent' | 'success' | 'warning' | 'error'
    showLabel?: boolean
    animated?: boolean
}

export const Progress = ({
    value,
    max = 100,
    variant = 'default',
    size = 'md',
    color = 'primary',
    showLabel = false,
    animated = true
}: ProgressProps) => {
    const percentage = Math.min(Math.max((value / max) * 100, 0), 100)

    const sizes = {
        sm: 'h-2',
        md: 'h-3',
        lg: 'h-4'
    }

    const variants = {
        default: 'bg-[var(--muted)] rounded-full overflow-hidden',
        glass: 'bg-white/10 backdrop-blur-md rounded-full overflow-hidden border border-white/20',
        neumorphic: 'bg-[var(--background)] shadow-[inset_2px_2px_4px_rgba(0,0,0,0.1),_inset_-2px_-2px_4px_rgba(255,255,255,0.1)] rounded-full overflow-hidden',
        gradient: 'bg-gradient-to-r from-[var(--muted)] to-transparent rounded-full overflow-hidden'
    }

    const colors = {
        primary: 'bg-gradient-to-r from-[var(--primary)] to-[var(--accent)]',
        accent: 'bg-gradient-to-r from-[var(--accent)] to-[var(--primary)]',
        success: 'bg-gradient-to-r from-green-500 to-emerald-500',
        warning: 'bg-gradient-to-r from-yellow-500 to-orange-500',
        error: 'bg-gradient-to-r from-red-500 to-pink-500'
    }

    return (
        <div className="w-full">
            {showLabel && (
                <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium text-[var(--foreground)]">Progress</span>
                    <span className="text-sm font-bold text-[var(--foreground)]">{percentage.toFixed(0)}%</span>
                </div>
            )}
            <div className={cn(sizes[size], variants[variant])}>
                <div
                    className={cn(
                        'h-full rounded-full transition-all duration-500 ease-out',
                        colors[color],
                        animated && 'animate-pulse'
                    )}
                    style={{ width: `${percentage}%` }}
                />
            </div>
        </div>
    )
}
