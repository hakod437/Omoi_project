'use client'

import React from 'react'
import { useTheme } from '../providers/ThemeProvider'
import { Sun, Moon, Sparkles } from 'lucide-react'

export const ThemeSwitcher = () => {
    const { theme, setTheme } = useTheme()

    const themes = [
        { id: 'cyber', label: 'Cyber', icon: <Sparkles className="text-[#00b49b]" size={16} /> },
        { id: 'pastel', label: 'Pastel', icon: <Sun className="text-[#c77dff]" size={16} /> },
        { id: 'shonen', label: 'Shonen', icon: <Moon className="text-[#5a82b3]" size={16} /> },
    ]

    return (
        <div className="flex gap-1 p-1 bg-[var(--card)]/50 backdrop-blur-md border border-[var(--border)] rounded-full shadow-inner">
            {themes.map((t) => (
                <button
                    key={t.id}
                    onClick={() => setTheme(t.id as any)}
                    className={`
                        p-2 rounded-full transition-all duration-300
                        ${theme === t.id
                            ? 'bg-[var(--primary)] text-white shadow-md scale-105'
                            : 'hover:bg-[var(--muted)] text-[var(--foreground)]/40 hover:text-[var(--foreground)]'
                        }
                    `}
                    title={t.label}
                >
                    {t.icon}
                </button>
            ))}
        </div>
    )
}
