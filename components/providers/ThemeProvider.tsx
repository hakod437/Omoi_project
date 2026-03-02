'use client'

import React, { createContext, useContext, useEffect, useState } from 'react'

type Theme = 'jade' | 'pastel' | 'abyss'

interface ThemeContextType {
    theme: Theme
    setTheme: (theme: Theme) => void
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
    const [theme, setThemeState] = useState<Theme>('jade')

    useEffect(() => {
        const savedTheme = localStorage.getItem('animevault-theme') as Theme
        if (savedTheme) {
            setThemeState(savedTheme)
            document.documentElement.setAttribute('data-theme', savedTheme)
        }
    }, [])

    const setTheme = (newTheme: Theme) => {
        setThemeState(newTheme)
        localStorage.setItem('animevault-theme', newTheme)
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
