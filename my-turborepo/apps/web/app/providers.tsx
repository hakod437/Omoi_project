/**
 * PROVIDERS COMPONENT
 * 
 * This component handles the "Context Stacking" pattern.
 * Order matters here:
 * 1. ThemeProvider: Lowest level, handles visual foundation.
 * 2. TODO: AuthProvider: To be implemented with Prisma.
 * 3. TODO: AnimeProvider: To be implemented with Prisma.
 */

"use client";

import { SessionProvider } from 'next-auth/react'
import { ThemeProvider } from "@/app/providers/theme-provider";
// TODO: Implement with Prisma
// import { AuthProvider } from "@/contexts/auth-context";
// import { AnimeProvider } from "@/contexts/anime-context";
import { Toaster } from "sonner";

export function Providers({ children }: { children: React.ReactNode }) {
    return (
        <SessionProvider>
            <ThemeProvider>
                {/* TODO: Add AuthProvider when implemented */}
                {/* TODO: Add AnimeProvider when implemented */}
                {children}

                {/* Global Notification Orchestrator */}
                <Toaster richColors position="top-right" />
            </ThemeProvider>
        </SessionProvider>
    );
}
