"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
    createContext,
    useContext,
    useEffect,
    useMemo,
    useState,
    type ReactNode,
} from "react";

type ThemeMode = "system" | "light" | "dark";
type ResolvedTheme = "light" | "dark";

type ThemeContextValue = {
    themeMode: ThemeMode;
    resolvedTheme: ResolvedTheme;
    setThemeMode: (mode: ThemeMode) => void;
};

const THEME_STORAGE_KEY = "omoi-theme-mode";

const ThemeContext = createContext<ThemeContextValue | null>(null);

function getSystemTheme(): ResolvedTheme {
    if (typeof window === "undefined") {
        return "light";
    }

    return window.matchMedia("(prefers-color-scheme: dark)").matches
        ? "dark"
        : "light";
}

function isThemeMode(value: string): value is ThemeMode {
    return value === "system" || value === "light" || value === "dark";
}

export function useTheme() {
    const context = useContext(ThemeContext);

    if (!context) {
        throw new Error("useTheme must be used within Providers");
    }

    return context;
}

export function Providers({ children }: { children: ReactNode }) {
    const [queryClient] = useState(
        () =>
            new QueryClient({
                defaultOptions: {
                    queries: {
                        staleTime: 60 * 1000,
                        refetchOnWindowFocus: false,
                    },
                },
            })
    );
    const [themeMode, setThemeMode] = useState<ThemeMode>(() => {
        if (typeof window === "undefined") {
            return "system";
        }

        const stored = window.localStorage.getItem(THEME_STORAGE_KEY);
        return stored && isThemeMode(stored) ? stored : "system";
    });
    const [resolvedTheme, setResolvedTheme] = useState<ResolvedTheme>("light");

    useEffect(() => {
        const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");

        const applyTheme = () => {
            const nextResolvedTheme =
                themeMode === "system" ? getSystemTheme() : themeMode;

            setResolvedTheme(nextResolvedTheme);
            document.documentElement.dataset.theme = themeMode;
            document.documentElement.style.colorScheme = nextResolvedTheme;
        };

        applyTheme();
        window.localStorage.setItem(THEME_STORAGE_KEY, themeMode);

        if (themeMode === "system") {
            mediaQuery.addEventListener("change", applyTheme);
            return () => mediaQuery.removeEventListener("change", applyTheme);
        }

        return;
    }, [themeMode]);

    const themeContextValue = useMemo(
        () => ({ themeMode, resolvedTheme, setThemeMode }),
        [themeMode, resolvedTheme]
    );

    return (
        <QueryClientProvider client={queryClient}>
            <ThemeContext.Provider value={themeContextValue}>
                {children}
            </ThemeContext.Provider>
        </QueryClientProvider>
    );
}
