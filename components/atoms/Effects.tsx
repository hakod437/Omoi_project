import React, { useState, useEffect } from 'react'
import { cn } from './Base'

interface CursorEffectProps {
    children: React.ReactNode
    variant?: 'glow' | 'trail' | 'magnetic' | 'spotlight'
    color?: string
    size?: number
    disabled?: boolean
}

export const CursorEffect = ({ 
    children, 
    variant = 'glow',
    color = 'var(--primary)',
    size = 20,
    disabled = false
}: CursorEffectProps) => {
    const [position, setPosition] = useState({ x: 0, y: 0 })
    const [isHovering, setIsHovering] = useState(false)
    const [trail, setTrail] = useState<Array<{ x: number; y: number; id: number }>>([])

    useEffect(() => {
        if (disabled) return

        const handleMouseMove = (e: MouseEvent) => {
            setPosition({ x: e.clientX, y: e.clientY })
            
            if (variant === 'trail') {
                setTrail(prev => [
                    ...prev.slice(-8), // Keep only last 8 positions
                    { x: e.clientX, y: e.clientY, id: Date.now() }
                ])
            }
        }

        window.addEventListener('mousemove', handleMouseMove)
        return () => window.removeEventListener('mousemove', handleMouseMove)
    }, [disabled, variant])

    useEffect(() => {
        if (variant === 'trail') {
            const interval = setInterval(() => {
                setTrail(prev => prev.slice(1))
            }, 50)
            return () => clearInterval(interval)
        }
    }, [variant])

    const handleMouseEnter = () => setIsHovering(true)
    const handleMouseLeave = () => setIsHovering(false)

    return (
        <div 
            className="relative"
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
        >
            {children}
            
            {!disabled && (
                <>
                    {variant === 'glow' && (
                        <div
                            className="pointer-events-none fixed rounded-full opacity-50 blur-xl transition-all duration-300 ease-out"
                            style={{
                                left: position.x - size / 2,
                                top: position.y - size / 2,
                                width: size,
                                height: size,
                                backgroundColor: color,
                                transform: isHovering ? 'scale(1.5)' : 'scale(1)',
                                opacity: isHovering ? 0.8 : 0.3
                            }}
                        />
                    )}
                    
                    {variant === 'trail' && (
                        <>
                            {trail.map((point, index) => (
                                <div
                                    key={point.id}
                                    className="pointer-events-none fixed rounded-full"
                                    style={{
                                        left: point.x - (size * (1 - index / trail.length)) / 2,
                                        top: point.y - (size * (1 - index / trail.length)) / 2,
                                        width: size * (1 - index / trail.length),
                                        height: size * (1 - index / trail.length),
                                        backgroundColor: color,
                                        opacity: (index + 1) / trail.length * 0.3
                                    }}
                                />
                            ))}
                        </>
                    )}
                    
                    {variant === 'spotlight' && (
                        <div
                            className="pointer-events-none fixed rounded-full opacity-20"
                            style={{
                                left: position.x - 100,
                                top: position.y - 100,
                                width: 200,
                                height: 200,
                                background: `radial-gradient(circle, ${color} 0%, transparent 70%)`,
                                transform: isHovering ? 'scale(1.2)' : 'scale(1)',
                                transition: 'transform 0.3s ease-out'
                            }}
                        />
                    )}
                </>
            )}
        </div>
    )
}

interface MagneticButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    children: React.ReactNode
    strength?: number
    variant?: 'default' | 'glass' | 'neumorphic'
}

export const MagneticButton = ({ 
    children, 
    strength = 0.3,
    variant = 'default',
    className,
    ...props 
}: MagneticButtonProps) => {
    const [position, setPosition] = useState({ x: 0, y: 0 })
    const [isHovering, setIsHovering] = useState(false)
    const buttonRef = React.useRef<HTMLButtonElement>(null)

    const handleMouseMove = (e: React.MouseEvent<HTMLButtonElement>) => {
        if (!buttonRef.current) return
        
        const rect = buttonRef.current.getBoundingClientRect()
        const centerX = rect.left + rect.width / 2
        const centerY = rect.top + rect.height / 2
        
        const deltaX = (e.clientX - centerX) * strength
        const deltaY = (e.clientY - centerY) * strength
        
        setPosition({ x: deltaX, y: deltaY })
    }

    const handleMouseEnter = () => setIsHovering(true)
    const handleMouseLeave = () => {
        setIsHovering(false)
        setPosition({ x: 0, y: 0 })
    }

    const variants = {
        default: 'bg-gradient-to-r from-[var(--primary)] to-[var(--accent)] text-white rounded-2xl font-bold transition-all duration-300',
        glass: 'bg-white/10 backdrop-blur-md border border-white/20 text-[var(--foreground)] rounded-2xl font-bold transition-all duration-300',
        neumorphic: 'bg-[var(--background)] shadow-[8px_8px_16px_rgba(0,0,0,0.1),_-8px_-8px_16px_rgba(255,255,255,0.1)] text-[var(--foreground)] rounded-2xl font-bold transition-all duration-300'
    }

    return (
        <button
            ref={buttonRef}
            className={cn(
                'relative overflow-hidden group',
                variants[variant],
                className
            )}
            style={{
                transform: `translate(${position.x}px, ${position.y}px)`,
            }}
            onMouseMove={handleMouseMove}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            {...props}
        >
            {/* Effet de brillance */}
            <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
            
            {/* Contenu */}
            <span className="relative z-10">{children}</span>
        </button>
    )
}

interface FloatingElementProps {
    children: React.ReactNode
    duration?: number
    delay?: number
    intensity?: number
    disabled?: boolean
}

export const FloatingElement = ({ 
    children, 
    duration = 3,
    delay = 0,
    intensity = 10,
    disabled = false
}: FloatingElementProps) => {
    const [transform, setTransform] = useState('')

    useEffect(() => {
        if (disabled) return

        const interval = setInterval(() => {
            const time = Date.now() / 1000
            const x = Math.sin(time / duration + delay) * intensity
            const y = Math.cos(time / duration + delay) * intensity * 0.5
            setTransform(`translate(${x}px, ${y}px)`)
        }, 50)

        return () => clearInterval(interval)
    }, [disabled, duration, delay, intensity])

    return (
        <div 
            className="transition-transform duration-1000 ease-in-out"
            style={{ transform }}
        >
            {children}
        </div>
    )
}

interface ParallaxElementProps {
    children: React.ReactNode
    speed?: number
    disabled?: boolean
}

export const ParallaxElement = ({ 
    children, 
    speed = 0.5,
    disabled = false 
}: ParallaxElementProps) => {
    const [offset, setOffset] = useState({ x: 0, y: 0 })

    useEffect(() => {
        if (disabled) return

        const handleScroll = () => {
            const scrolled = window.pageYOffset
            const parallax = scrolled * speed
            setOffset({ x: 0, y: parallax })
        }

        window.addEventListener('scroll', handleScroll)
        return () => window.removeEventListener('scroll', handleScroll)
    }, [disabled, speed])

    return (
        <div 
            className="relative"
            style={{ transform: `translateY(${offset.y}px)` }}
        >
            {children}
        </div>
    )
}
