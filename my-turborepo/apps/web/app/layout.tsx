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
import { Providers } from "@/app/providers";
import { Metadata } from 'next';
import AuroraBackground from "./components/organisms/aurora-background";
import { Hachi_Maru_Pop, Nunito, DM_Sans } from "next/font/google";

/**
 * TYPOGRAPHY CONFIGURATION (Multi-Font System)
 * We use three distinct fonts to create a clear visual hierarchy.
 */

// 1. Hachi Maru Pop: For Logo, Titles, and Scores (Kawaii/Handwritten aesthetic)
const hachi = Hachi_Maru_Pop({
    weight: '400',
    subsets: ["latin"],
    display: "swap",
    variable: "--font-hachi",
});

// 2. Nunito: For UI elements like Labels, Buttons, and Navigation (Rounded/Soft)
const nunito = Nunito({
    subsets: ["latin"],
    display: "swap",
    variable: "--font-nunito",
});

// 3. DM Sans: For standard Body text and Descriptions (High readability)
const dmSans = DM_Sans({
    subsets: ["latin"],
    display: "swap",
    variable: "--font-dm",
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
 */
export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        /* We inject all font variables here so they are available globally via Tailwind or CSS */
        <html lang="fr" suppressHydrationWarning className={`${hachi.variable} ${nunito.variable} ${dmSans.variable}`}>
            <body className="antialiased font-sans">
                {/* Global Background Layer */}
                <AuroraBackground />

                {/* Core App Contexts (Theme, Auth, Data) */}
                <Providers>{children}</Providers>
            </body>
        </html>
    );
}