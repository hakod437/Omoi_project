"use client";

import { ThemeProvider } from "@/app/providers/theme-provider";
import { AuthProvider } from "@/contexts/auth-context";
import { AnimeProvider } from "@/contexts/anime-context";

import { Toaster } from "sonner";

export function Providers({ children }: { children: React.ReactNode }) {
    return (
        <ThemeProvider>
            <AuthProvider>
                <AnimeProvider>
                    {children}
                    <Toaster richColors position="top-right" />
                </AnimeProvider>
            </AuthProvider>
        </ThemeProvider>
    );
}
