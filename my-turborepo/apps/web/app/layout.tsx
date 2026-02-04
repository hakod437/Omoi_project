import "../styles/tailwind.css";
import React from "react";
import { ThemeProvider } from "@/app/components/theme-provider";

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
        <html lang="fr">
            <body>
                <ThemeProvider>{children}</ThemeProvider>
            </body>
        </html>
    );
}