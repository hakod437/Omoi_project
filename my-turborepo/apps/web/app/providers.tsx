"use client";

import { ThemeProvider } from "@/app/components/theme-provider";
import { AuthProvider } from "@/contexts/auth-context";
import { AnimeProvider } from "@/contexts/anime-context";

export function Providers({ children }: { children: React.ReactNode }) {
    return (
        <ThemeProvider>
            <AuthProvider>
                <AnimeProvider>
                    {children}
                </AnimeProvider>
            </AuthProvider>
        </ThemeProvider>
    );
}
