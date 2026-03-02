import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from "@/components/providers/ThemeProvider";
import { AuthProvider } from "@/components/providers/AuthProvider";
import { Navbar } from "@/components/organisms/Navbar";

// Google Fonts are commented out to avoid build-time network timeouts in this environment.
// Fallbacks are defined in globals.css.
/*
const hachiMaruPop = Hachi_Maru_Pop({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-kawaii",
});

const nunito = Nunito({
  subsets: ["latin"],
  variable: "--font-ui",
});

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-body",
});
*/

export const metadata: Metadata = {
  title: "AnimeVault | Rate your Vibes",
  description: "Community-driven anime rating platform with a focus on animation quality and tier-based scoring.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className="antialiased"
      >
        <AuthProvider>
          <ThemeProvider>
            <div className="aurora-container">
              <div className="blob blob-1" />
              <div className="blob blob-2" />
              <div className="blob blob-3" />
            </div>
            <Navbar />
            <main className="relative z-10 mx-auto max-w-7xl pt-8 px-4 sm:px-6 lg:px-8">
              {children}
            </main>
          </ThemeProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
