import "../styles/tailwind.css";
import React from "react";
import { Providers } from "@/app/providers";

export const metadata = {
    title: 'Mon Tracker Anime',
    description: 'Suivez vos animes et comparez vos avis',
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="fr" suppressHydrationWarning>
            <body>
                <Providers>{children}</Providers>
            </body>
        </html>
    );
}