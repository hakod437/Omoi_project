import "../styles/tailwind.css";
import React from "react";
import { Inter } from "next/font/google";
import { Providers } from "@/app/providers";
import { Metadata } from 'next';

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

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="fr" suppressHydrationWarning className={inter.className}>
            <body className="antialiased">
                <Providers>{children}</Providers>
            </body>
        </html>
    );
}