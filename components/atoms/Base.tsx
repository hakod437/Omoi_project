import React from 'react'
import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs))
}

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'glass' | 'neumorphic'
    size?: 'sm' | 'md' | 'lg'
    loading?: boolean
}

export const Button = ({
    className,
    variant = 'primary',
    size = 'md',
    loading = false,
    children,
    disabled,
    ...props
}: ButtonProps) => {
    const variants = {
        primary: 'bg-[var(--btn-primary-bg)] text-[var(--btn-primary-text)] hover:bg-[var(--btn-primary-hover)] hover:shadow-lg hover:shadow-[var(--primary)]/25 transform hover:-translate-y-0.5 transition-all duration-300',
        secondary: 'bg-[var(--btn-secondary-bg)] text-[var(--btn-secondary-text)] hover:bg-[var(--btn-secondary-hover)] hover:shadow-lg hover:shadow-[var(--accent)]/20 transform hover:-translate-y-0.5 transition-all duration-300',
        outline: 'border-2 border-[var(--btn-outline-border)] text-[var(--btn-outline-text)] hover:bg-[var(--btn-outline-hover-bg)] hover:text-[var(--btn-outline-hover-text)] hover:shadow-lg hover:shadow-[var(--primary)]/20 transform hover:-translate-y-0.5 transition-all duration-300',
        ghost: 'hover:bg-[var(--muted)]/50 text-[var(--foreground)] hover:shadow-md transform hover:scale-105 transition-all duration-200',
        glass: 'bg-white/10 backdrop-blur-md border border-white/20 text-[var(--foreground)] hover:bg-white/20 hover:shadow-lg hover:shadow-white/10 transform hover:-translate-y-0.5 transition-all duration-300',
        neumorphic: 'bg-[var(--background)] shadow-[8px_8px_16px_rgba(0,0,0,0.1),_-8px_-8px_16px_rgba(255,255,255,0.1)] hover:shadow-[4px_4px_8px_rgba(0,0,0,0.1),_-4px_-4px_8px_rgba(255,255,255,0.1)] active:shadow-[inset_4px_4px_8px_rgba(0,0,0,0.1),_inset_-4px_-4px_8px_rgba(255,255,255,0.1)] text-[var(--foreground)] transition-all duration-200'
    }

    const sizes = {
        sm: 'px-4 py-2 text-sm',
        md: 'px-6 py-3 text-base',
        lg: 'px-8 py-4 text-lg',
    }

    return (
        <button
            className={cn(
                'relative rounded-2xl font-bold transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none overflow-hidden group',
                variants[variant],
                sizes[size],
                className
            )}
            disabled={disabled || loading}
            {...props}
        >
            {/* Contenu avec animation de loading */}
            <span className="relative z-10 flex items-center justify-center gap-2">
                {loading && (
                    <div className="w-4 h-4 border-2 border-current/20 border-t-current rounded-full animate-spin" />
                )}
                {children}
            </span>
        </button>
    )
}

export const Badge = ({
    children,
    className,
    variant = 'primary',
    size = 'md'
}: {
    children: React.ReactNode
    className?: string
    variant?: 'primary' | 'accent' | 'muted' | 'glass' | 'neumorphic'
    size?: 'sm' | 'md' | 'lg'
}) => {
    const variants = {
        primary: 'bg-[var(--tag-bg)] text-[var(--tag-fg)] border border-[var(--border)] shadow-sm',
        accent: 'bg-[var(--muted)] text-[var(--accent)] border border-[var(--border)] shadow-sm',
        muted: 'bg-[var(--muted)]/50 text-[var(--foreground)]/70 border border-[var(--border)]/50 backdrop-blur-sm',
        glass: 'bg-white/10 backdrop-blur-md text-[var(--foreground)] border border-white/20 shadow-lg shadow-white/10',
        neumorphic: 'bg-[var(--background)] shadow-[4px_4px_8px_rgba(0,0,0,0.1),_-4px_-4px_8px_rgba(255,255,255,0.1)] text-[var(--foreground)] border border-[var(--border)]/20'
    }

    const sizes = {
        sm: 'px-2 py-1 text-xs',
        md: 'px-3 py-1.5 text-sm',
        lg: 'px-4 py-2 text-base',
    }

    return (
        <span className={cn(
            'inline-flex items-center justify-center rounded-xl font-bold capitalize transition-all duration-300 hover:scale-105',
            variants[variant],
            sizes[size],
            className
        )}>
            {children}
        </span>
    )
}

// Nouveau composant Input moderne
export const Input = ({
    className,
    variant = 'default',
    ...props
}: React.InputHTMLAttributes<HTMLInputElement> & {
    variant?: 'default' | 'glass' | 'neumorphic'
}) => {
    const variants = {
        default: 'bg-[var(--muted)]/50 border border-[var(--border)] focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary)]/20',
        glass: 'bg-white/10 backdrop-blur-md border border-white/20 text-[var(--foreground)] placeholder:text-[var(--foreground)]/50 focus:border-white/40 focus:ring-2 focus:ring-white/20',
        neumorphic: 'bg-[var(--background)] shadow-[inset_4px_4px_8px_rgba(0,0,0,0.1),_inset_-4px_-4px_8px_rgba(255,255,255,0.1)] border border-[var(--border)]/20 focus:shadow-[inset_6px_6px_12px_rgba(0,0,0,0.15),_inset_-6px_-6px_12px_rgba(255,255,255,0.15)] focus:ring-2 focus:ring-[var(--primary)]/20'
    }

    return (
        <input
            className={cn(
                'w-full px-4 py-3 rounded-2xl bg-transparent outline-none transition-all duration-300 placeholder:text-[var(--foreground)]/50',
                variants[variant],
                className
            )}
            {...props}
        />
    )
}
