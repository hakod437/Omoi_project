import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Providers } from "./providers";
import { Navbar } from "../components/organisms/navbar";
import { Header } from "../components/organisms/header";
import { DevMobileFrame } from "../components/atoms/dev-mobile-frame";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

/**
 * metadata: This is used by Next.js to set the HTML <title> and <meta> tags.
 * This is crucial for SEO and how your app appears when shared on social media.
 */
export const metadata: Metadata = {
  title: "Omoi",
  description: "Omoi — Your anime tracking companion",
};

/**
 * RootLayout: The very first component that wraps your entire application.
 * In Next.js App Router, this is where the <html> and <body> tags live.
 * 
 * @param children - This represents the specific Page you are currently viewing.
 */
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        {/* 
          Providers: This is a "Wrapper" that shares Global State (Theme, Data) 
          with every single component inside it.
        */}
        <Providers>
          <DevMobileFrame>
            {/* Screen container */}
            <main className="flex-1 overflow-y-auto pb-16">
              <Header />

              {children}
            </main>

            {/* Floating Navbar */}
            <Navbar />
          </DevMobileFrame>
        </Providers>
      </body>
    </html>
  );
}
