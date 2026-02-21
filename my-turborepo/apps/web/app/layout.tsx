/**
 * ARCHITECTURE OVERVIEW: ROOT LAYOUT
 * 
 * This is the entry point of the "Omoi" web application.
 * It manages the global HTML structure and cross-cutting concerns:
 * 1. Global CSS Injection (index.css containing Tailwind + Custom Themes)
 * 2. Font Optimization (Next.js Google Fonts)
 * 3. Global Visual Elements (AuroraBackground)
 * 4. Context Wrapping (Providers)
 */

import "../styles/index.css";
import React from "react";
import { Inter } from "next/font/google";
import { Providers } from "@/app/providers";
import { Metadata } from 'next';
import AuroraBackground from "./components/organisms/aurora-background";

// Primary typography using Inter for its high legibility in UI
const inter = Inter({
    subsets: ["latin"],
    display: "swap",
});

export const metadata: Metadata = {
    title: {
        default: 'Omoi - Mon Tracker Anime',
        template: '%s | Omoi'
    },
    description: 'Suivez vos animes, notez les animations et comparez vos avis avec vos amis. Une expérience fluide et rapide.',
};

/**
 * RootLayout: The shell component that wraps every page.
 * We inject the AuroraBackground here so it stays mounted during page transitions,
 * maintaining the performance of the fluid animation.
 */
export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="fr" suppressHydrationWarning className={inter.className}>
            <body className="antialiased font-sans">
                {/* Global Background Layer */}
                <AuroraBackground />

                {/* Core App Contexts (Theme, Auth, Data) */}
                <Providers>{children}</Providers>
            </body>
        </html>
    );
}