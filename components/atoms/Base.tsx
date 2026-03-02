import React from 'react'
import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs))
}

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary' | 'outline' | 'ghost'
    size?: 'sm' | 'md' | 'lg'
}

export const Button = ({
    className,
    variant = 'primary',
    size = 'md',
    ...props
}: ButtonProps) => {
    const variants = {
        primary: 'bg-[var(--primary)] text-white hover:opacity-90 shadow-md',
        secondary: 'bg-[var(--accent)] text-[var(--background)] hover:opacity-90',
        outline: 'border-2 border-[var(--primary)] text-[var(--primary)] hover:bg-[var(--primary)] hover:text-white',
        ghost: 'hover:bg-[var(--muted)] text-[var(--foreground)]',
    }

    const sizes = {
        sm: 'px-3 py-1.5 text-sm',
        md: 'px-5 py-2',
        lg: 'px-8 py-3 text-lg',
    }

    return (
        <button
            className={cn(
                'rounded-full font-bold transition-all active:scale-95 disabled:opacity-50',
                variants[variant],
                sizes[size],
                className
            )}
            {...props}
        />
    )
}

export const Badge = ({
    children,
    className,
    variant = 'primary'
}: {
    children: React.ReactNode
    className?: string
    variant?: 'primary' | 'accent' | 'muted'
}) => {
    const variants = {
        primary: 'bg-[var(--primary)]/20 text-[var(--primary)] border-[var(--primary)]/30',
        accent: 'bg-[var(--accent)]/20 text-[var(--accent)] border-[var(--accent)]/30',
        muted: 'bg-[var(--muted)] text-[var(--foreground)]/60 border-transparent',
    }

    return (
        <span className={cn(
            'px-2 py-0.5 rounded-md text-xs font-bold border capitalize',
            variants[variant],
            className
        )}>
            {children}
        </span>
    )
}
