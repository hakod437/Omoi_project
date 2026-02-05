"use client";

import { ThemeProvider } from "@/app/components/theme-provider";
import { AnimeProvider } from "@/contexts/anime-context";

export function Providers({ children }: { children: React.ReactNode }) {
    return (
        <ThemeProvider>
            <AnimeProvider>
                {children}
            </AnimeProvider>
        </ThemeProvider>
    );
}
