'use client'

import React, { useState, useEffect } from 'react'
import { Search, Zap, Star, Users, Loader2 } from 'lucide-react'
import { Button } from '@/components/atoms/Base'
import { AnimeCard } from '@/components/organisms/AnimeCard'
import Link from 'next/link'

export default function Home() {
  const [searchQuery, setSearchQuery] = useState('')
  const [results, setResults] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(false)

  // Debounced search
  useEffect(() => {
    const timer = setTimeout(async () => {
      if (searchQuery.length > 2) {
        setIsLoading(true)
        try {
          const res = await fetch(`/api/anime/search?q=${encodeURIComponent(searchQuery)}`)
          const data = await res.json()
          setResults(data || [])
        } catch (error) {
          console.error('Search failed:', error)
        } finally {
          setIsLoading(false)
        }
      } else {
        setResults([])
      }
    }, 500)

    return () => clearTimeout(timer)
  }, [searchQuery])

  return (
    <div className="space-y-24 py-12 pb-24">
      {/* Hero Section */}
      <section className="text-center space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-700">
        <h1 className="text-5xl md:text-7xl lg:text-8xl font-kawaii tracking-tighter text-[var(--foreground)] drop-shadow-2xl">
          Rate your <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-[var(--primary)] to-[var(--accent)]">
            Vibes & Vision
          </span>
        </h1>

        <p className="max-w-2xl mx-auto text-lg md:text-xl font-body text-[var(--foreground)]/60 font-medium">
          The only tier-based platform focused on the peak of animation quality.
          S-Tier visuals, community reviews, and friend compatibility.
        </p>

        {/* Search Bar Landing */}
        <div className="max-w-xl mx-auto relative group">
          <div className="absolute inset-0 bg-[var(--primary)]/20 blur-3xl group-focus-within:bg-[var(--primary)]/40 transition-all rounded-full" />
          <div className="relative flex items-center bg-[var(--card)]/80 backdrop-blur-md border border-[var(--border)] rounded-full px-6 py-4 shadow-2xl">
            {isLoading ? (
              <Loader2 className="animate-spin text-[var(--primary)] mr-4" size={24} />
            ) : (
              <Search className="text-[var(--primary)] mr-4" size={24} />
            )}
            <input
              type="text"
              placeholder="Search for an anime to rate..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-transparent border-none outline-none w-full font-ui font-bold text-lg placeholder:text-[var(--foreground)]/30"
            />
          </div>
        </div>

        {/* Stats */}
        <div className="flex flex-wrap justify-center gap-12 pt-8">
          <Stat icon={<Zap size={20} className="text-yellow-400" />} value="98K" label="Ratings" />
          <Stat icon={<Star size={20} className="text-[var(--primary)]" />} value="12K" label="Animes" />
          <Stat icon={<Users size={20} className="text-[var(--accent)]" />} value="4.8K" label="Members" />
        </div>
      </section>

      {/* Results or Trending */}
      <section className="space-y-8 min-h-[400px]">
        <div className="flex items-end justify-between border-b border-[var(--border)] pb-4">
          <h2 className="text-3xl font-kawaii text-[var(--foreground)]">
            {searchQuery.length > 2 ? `Results for "${searchQuery}"` : 'Trending Peaks'}
          </h2>
          {searchQuery.length <= 2 && (
            <Link href="/trending" className="text-[var(--primary)] font-bold font-ui hover:underline underline-offset-4">
              View All →
            </Link>
          )}
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {results.length > 0 ? (
            results.map((anime) => (
              <AnimeCard
                key={anime.mal_id}
                id={anime.mal_id.toString()}
                title={anime.title}
                imageUrl={anime.images.webp.large_image_url}
                genres={anime.genres.map((g: any) => g.name)}
              />
            ))
          ) : (
            // Placeholder/Skeleton or Trending data could go here
            [1, 2, 4, 5].map((i) => (
              <div key={i} className="aspect-[2/3] rounded-2xl bg-[var(--card)]/30 animate-pulse" />
            ))
          )}
        </div>
      </section>
    </div>
  )
}

function Stat({ icon, value, label }: { icon: React.ReactNode, value: string, label: string }) {
  return (
    <div className="flex flex-col items-center gap-1">
      <div className="flex items-center gap-2 mb-1">
        {icon}
        <span className="text-2xl font-kawaii font-bold">{value}</span>
      </div>
      <span className="text-xs uppercase tracking-widest font-bold opacity-40">{label}</span>
    </div>
  )
}
