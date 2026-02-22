/**
 * PROVIDERS COMPONENT
 * 
 * This component handles the "Context Stacking" pattern.
 * Order matters here:
 * 1. ThemeProvider: Lowest level, handles visual foundation.
 * 2. AuthProvider: Manages user session (Depends on theme for any auth UIs).
 * 3. AnimeProvider: Business logic/Data (Depends on auth for user-specific data).
 */

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

                    {/* Global Notification Orchestrator */}
                    <Toaster richColors position="top-right" />
                </AnimeProvider>
            </AuthProvider>
        </ThemeProvider>
    );
}
