'use client'

import React, { createContext, useContext, useEffect, useState } from 'react'

type Theme = 'cyber' | 'pastel' | 'shonen'

const THEME_STORAGE_KEY = 'animevault-theme'

function normalizeTheme(value: string | null): Theme | null {
    if (!value) return null

    if (value === 'jade') return 'cyber'
    if (value === 'abyss') return 'shonen'

    if (value === 'cyber' || value === 'pastel' || value === 'shonen') return value
    return null
}

interface ThemeContextType {
    theme: Theme
    setTheme: (theme: Theme) => void
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
    const [theme, setThemeState] = useState<Theme>('cyber')

    useEffect(() => {
        const savedTheme = normalizeTheme(localStorage.getItem(THEME_STORAGE_KEY))
        if (savedTheme) {
            setThemeState(savedTheme)
            localStorage.setItem(THEME_STORAGE_KEY, savedTheme)
            document.documentElement.setAttribute('data-theme', savedTheme)
        } else {
            document.documentElement.setAttribute('data-theme', 'cyber')
        }
    }, [])

    const setTheme = (newTheme: Theme) => {
        setThemeState(newTheme)
        localStorage.setItem(THEME_STORAGE_KEY, newTheme)
        document.documentElement.setAttribute('data-theme', newTheme)
    }

    return (
        <ThemeContext.Provider value={{ theme, setTheme }}>
            {children}
        </ThemeContext.Provider>
    )
}

export const useTheme = () => {
    const context = useContext(ThemeContext)
    if (!context) throw new Error('useTheme must be used within ThemeProvider')
    return context
}
