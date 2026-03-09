import React, { useEffect, useRef, useState } from 'react'
import { cn } from './Base'

// Animation hooks optimisés
export const useOptimizedAnimation = (duration: number = 300) => {
    const [isAnimating, setIsAnimating] = useState(false)
    const animationRef = useRef<number | null>(null)
    const startTimeRef = useRef<number | null>(null)

    const startAnimation = (callback: () => void) => {
        if (animationRef.current) {
            cancelAnimationFrame(animationRef.current)
        }

        setIsAnimating(true)
        startTimeRef.current = performance.now()

        const animate = (currentTime: number) => {
            if (!startTimeRef.current) return
            
            const elapsed = currentTime - startTimeRef.current
            const progress = Math.min(elapsed / duration, 1)

            // Easing function pour des animations fluides
            const easeOutCubic = 1 - Math.pow(1 - progress, 3)
            
            callback()

            if (progress < 1) {
                animationRef.current = requestAnimationFrame(animate)
            } else {
                setIsAnimating(false)
            }
        }

        animationRef.current = requestAnimationFrame(animate)
    }

    useEffect(() => {
        return () => {
            if (animationRef.current) {
                cancelAnimationFrame(animationRef.current)
            }
        }
    }, [])

    return { isAnimating, startAnimation }
}

// Composant d'animation optimisé
interface AnimatedProps {
    children: React.ReactNode
    animation?: 'fadeIn' | 'slideUp' | 'scaleIn' | 'rotateIn' | 'bounceIn'
    duration?: number
    delay?: number
    className?: string
    trigger?: boolean
}

export const Animated = ({ 
    children, 
    animation = 'fadeIn',
    duration = 300,
    delay = 0,
    className,
    trigger = true
}: AnimatedProps) => {
    const [isVisible, setIsVisible] = useState(false)
    const elementRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        if (!trigger) return

        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setTimeout(() => setIsVisible(true), delay)
                }
            },
            { threshold: 0.1 }
        )

        if (elementRef.current) {
            observer.observe(elementRef.current)
        }

        return () => observer.disconnect()
    }, [trigger, delay])

    const animations = {
        fadeIn: `opacity-0 translate-y-4 ${isVisible ? 'opacity-100 translate-y-0' : ''}`,
        slideUp: `opacity-0 translate-y-8 ${isVisible ? 'opacity-100 translate-y-0' : ''}`,
        scaleIn: `opacity-0 scale-95 ${isVisible ? 'opacity-100 scale-100' : ''}`,
        rotateIn: `opacity-0 rotate-12 ${isVisible ? 'opacity-100 rotate-0' : ''}`,
        bounceIn: `opacity-0 scale-75 ${isVisible ? 'opacity-100 scale-100' : ''}`
    }

    return (
        <div
            ref={elementRef}
            className={cn(
                'transition-all ease-out',
                animations[animation],
                isVisible && `duration-${Math.round(duration / 100) * 100}`,
                className
            )}
            style={{
                transitionDuration: isVisible ? `${duration}ms` : '0ms',
                transitionProperty: 'opacity, transform',
                transform: 'translateZ(0)', // Force GPU acceleration
                willChange: isVisible ? 'opacity, transform' : 'auto'
            }}
        >
            {children}
        </div>
    )
}

// Micro-interactions optimisées
interface MicroInteractionProps {
    children: React.ReactNode
    type?: 'pulse' | 'bounce' | 'shake' | 'glow' | 'float'
    trigger?: 'hover' | 'click' | 'auto'
    intensity?: 'subtle' | 'normal' | 'strong'
}

export const MicroInteraction = ({ 
    children, 
    type = 'pulse',
    trigger = 'hover',
    intensity = 'normal'
}: MicroInteractionProps) => {
    const [isActive, setIsActive] = useState(false)

    const interactions = {
        pulse: {
            subtle: 'animate-pulse',
            normal: 'animate-pulse',
            strong: 'animate-pulse'
        },
        bounce: {
            subtle: 'hover:scale-105',
            normal: 'hover:scale-110',
            strong: 'hover:scale-125'
        },
        shake: {
            subtle: 'hover:animate-bounce',
            normal: 'hover:animate-bounce',
            strong: 'hover:animate-bounce'
        },
        glow: {
            subtle: 'hover:shadow-lg',
            normal: 'hover:shadow-xl hover:shadow-[var(--primary)]/25',
            strong: 'hover:shadow-2xl hover:shadow-[var(--primary)]/50'
        },
        float: {
            subtle: 'hover:-translate-y-1',
            normal: 'hover:-translate-y-2',
            strong: 'hover:-translate-y-4'
        }
    }

    const eventHandlers = {
        hover: {
            onMouseEnter: () => setIsActive(true),
            onMouseLeave: () => setIsActive(false)
        },
        click: {
            onClick: () => setIsActive(!isActive)
        },
        auto: {}
    }

    return (
        <div
            className={cn(
                'transition-all duration-300 ease-out cursor-pointer',
                interactions[type][intensity],
                trigger === 'auto' && 'animate-pulse'
            )}
            style={{ transform: 'translateZ(0)' }}
            {...eventHandlers[trigger]}
        >
            {children}
        </div>
    )
}

// Loading skeletons optimisés
interface SkeletonProps {
    className?: string
    variant?: 'text' | 'circular' | 'rectangular' | 'custom'
    width?: string | number
    height?: string | number
    lines?: number
    animated?: boolean
}

export const Skeleton = ({ 
    className,
    variant = 'text',
    width,
    height,
    lines = 1,
    animated = true
}: SkeletonProps) => {
    const baseClasses = 'bg-gradient-to-r from-[var(--muted)] via-[var(--muted)]/50 to-[var(--muted)] rounded'

    const variants = {
        text: 'h-4 rounded-full',
        circular: 'rounded-full',
        rectangular: 'rounded-lg',
        custom: ''
    }

    const style = {
        width: width || (variant === 'text' ? '100%' : '40px'),
        height: height || (variant === 'text' ? '16px' : '40px'),
        transform: 'translateZ(0)'
    }

    if (variant === 'text' && lines > 1) {
        return (
            <div className={cn('space-y-2', className)}>
                {Array.from({ length: lines }).map((_, i) => (
                    <div
                        key={i}
                        className={cn(
                            baseClasses,
                            variants.text,
                            animated && 'animate-pulse'
                        )}
                        style={{
                            ...style,
                            width: i === lines - 1 ? '70%' : '100%' // Dernière ligne plus courte
                        }}
                    />
                ))}
            </div>
        )
    }

    return (
        <div
            className={cn(
                baseClasses,
                variants[variant],
                animated && 'animate-pulse',
                className
            )}
            style={style}
        />
    )
}

// Transitions de page optimisées
interface PageTransitionProps {
    children: React.ReactNode
    type?: 'fade' | 'slide' | 'scale' | 'flip'
    duration?: number
}

export const PageTransition = ({ 
    children, 
    type = 'fade',
    duration = 300
}: PageTransitionProps) => {
    const [isVisible, setIsVisible] = useState(false)

    useEffect(() => {
        // Déclencher l'animation au montage
        const timer = setTimeout(() => setIsVisible(true), 50)
        return () => clearTimeout(timer)
    }, [])

    const transitions = {
        fade: `transition-opacity duration-${duration} ${isVisible ? 'opacity-100' : 'opacity-0'}`,
        slide: `transition-transform duration-${duration} ${isVisible ? 'translate-x-0' : '-translate-x-full'}`,
        scale: `transition-all duration-${duration} ${isVisible ? 'scale-100 opacity-100' : 'scale-95 opacity-0'}`,
        flip: `transition-all duration-${duration} ${isVisible ? 'rotate-0' : 'rotate-180'}`
    }

    return (
        <div
            className={cn(transitions[type], 'will-change-transform')}
            style={{ transform: 'translateZ(0)' }}
        >
            {children}
        </div>
    )
}

export const useScrollAnimation = () => {
    const [scrollY, setScrollY] = useState(0)
    const ticking = useRef<boolean>(false)

    useEffect(() => {
        const handleScroll = () => {
            if (!ticking.current) {
                requestAnimationFrame(() => {
                    setScrollY(window.scrollY)
                    ticking.current = false
                })
                ticking.current = true
            }
        }

        window.addEventListener('scroll', handleScroll, { passive: true })
        return () => window.removeEventListener('scroll', handleScroll)
    }, [])

    return scrollY
}

// Animations de nombres (compteurs)
interface AnimatedNumberProps {
    value: number
    duration?: number
    prefix?: string
    suffix?: string
    className?: string
}

export const AnimatedNumber = ({ 
    value, 
    duration = 1000,
    prefix = '',
    suffix = '',
    className
}: AnimatedNumberProps) => {
    const [displayValue, setDisplayValue] = useState(0)
    const startTimeRef = useRef<number | null>(null)
    const animationRef = useRef<number | null>(null)

    useEffect(() => {
        startTimeRef.current = performance.now()
        const startValue = displayValue
        const endValue = value

        const animate = (currentTime: number) => {
            if (!startTimeRef.current) return

            const elapsed = currentTime - startTimeRef.current
            const progress = Math.min(elapsed / duration, 1)
            
            // Easing function
            const easeOutCubic = 1 - Math.pow(1 - progress, 3)
            const currentValue = startValue + (endValue - startValue) * easeOutCubic

            setDisplayValue(Math.round(currentValue))

            if (progress < 1) {
                animationRef.current = requestAnimationFrame(animate)
            }
        }

        animationRef.current = requestAnimationFrame(animate)

        return () => {
            if (animationRef.current) {
                cancelAnimationFrame(animationRef.current)
            }
        }
    }, [value, duration])

    return (
        <span className={cn('font-bold', className)}>
            {prefix}{displayValue.toLocaleString()}{suffix}
        </span>
    )
}
