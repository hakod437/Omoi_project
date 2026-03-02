'use client'

import React from 'react'
import { useTheme } from '../providers/ThemeProvider'
import { Sun, Moon, Sparkles, Check } from 'lucide-react'

export const ThemeSwitcher = () => {
    const { theme, setTheme } = useTheme()

    const themes = [
        { id: 'jade', label: 'Jade', icon: <Sparkles className="text-[#00b49b]" size={16} /> },
        { id: 'pastel', label: 'Pastel', icon: <Sun className="text-[#c77dff]" size={16} /> },
        { id: 'abyss', label: 'Abyss', icon: <Moon className="text-[#5a82b3]" size={16} /> },
    ]

    return (
        <div className="flex gap-2 p-1 bg-[var(--card)]/50 backdrop-blur-md border border-[var(--border)] rounded-full">
            {themes.map((t) => (
                <button
                    key={t.id}
                    onClick={() => setTheme(t.id as any)}
                    className={`
                        flex items-center gap-2 px-3 py-1.5 rounded-full transition-all text-sm font-bold font-ui
                        ${theme === t.id
                            ? 'bg-[var(--primary)] text-white shadow-lg scale-105'
                            : 'hover:bg-[var(--muted)] text-[var(--foreground)]/60'
                        }
                    `}
                >
                    {t.icon}
                    <span className="hidden lg:inline">{t.label}</span>
                    {theme === t.id && <Check size={12} className="ml-1" />}
                </button>
            ))}
        </div>
    )
}
