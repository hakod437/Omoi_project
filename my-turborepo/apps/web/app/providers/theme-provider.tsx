/**
 * THEME SYSTEM ARCHITECTURE: PILLAR 2 (THE ENGINE)
 * 
 * This Provider manages the application's visual state.
 * It implements the bridge between React logic and CSS variables.
 * 
 * FLOW:
 * 1. User/App logic calls `setTheme`.
 * 2. State updates + Persistent storage (localStorage).
 * 3. A data-attribute `data-theme` is injected into the root `<html>` element.
 * 4. CSS selectors in `theme.css` detect this change and swap variable values.
 */

"use client";

import { createContext, useContext, useEffect, useState } from "react";

// Types defining our supported design variants
export type ThemeColor = "pastel" | "cyber" | "shonen";

interface ThemeContextType {
    theme: ThemeColor;
    setTheme: (theme: ThemeColor) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

/**
 * ThemeProvider: The orchestrator of your app's look and feel.
 */
export function ThemeProvider({ children }: { children: React.ReactNode }) {
    // We default to 'cyber' as the signature theme of the app
    const [theme, setTheme] = useState<ThemeColor>("cyber");

    // Rehydration: Load user preference on mount
    useEffect(() => {
        const savedTheme = localStorage.getItem("animeTheme") as ThemeColor;
        if (savedTheme) {
            setTheme(savedTheme);
            document.documentElement.setAttribute("data-theme", savedTheme);
        }
    }, []);

    /**
     * handleSetTheme: Handles the 3-step update:
     * 1. Updates local state for reactive UI components.
     * 2. Persists choice for future sessions.
     * 3. Triggers the CSS variable swap by updating the DOM attribute.
     */
    const handleSetTheme = (newTheme: ThemeColor) => {
        setTheme(newTheme);
        localStorage.setItem("animeTheme", newTheme);
        document.documentElement.setAttribute("data-theme", newTheme);
    };

    return (
        <ThemeContext.Provider value={{ theme, setTheme: handleSetTheme }}>
            {children}
        </ThemeContext.Provider>
    );
}

/**
 * useTheme Hook: The standard way to interact with the theme anywhere in the app.
 */
export function useTheme() {
    const context = useContext(ThemeContext);
    if (context === undefined) {
        throw new Error("useTheme must be used within a ThemeProvider");
    }
    return context;
}
