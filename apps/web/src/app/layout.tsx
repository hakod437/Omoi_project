import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Providers } from "./providers";
import { Navbar } from "../components/organisms/navbar";
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
          <div className="flex min-h-full flex-1 flex-col px-4 pt-4">
            {/* 
               <main>: The heart of your page. 
               The {children} here will be replaced by your Page or Template content.
            */}
            <main className="flex-1 pb-20">{children}</main>
            
            {/* The Navbar stays here so it's always visible on every page. */}
            <Navbar />
          </div>
        </Providers>
      </body>
    </html>
  );
}
