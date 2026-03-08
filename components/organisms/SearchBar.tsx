'use client'

import React, { useState, useEffect, useRef } from 'react'
import { Search, Loader2, Plus, Star } from 'lucide-react'
import { searchAnime } from '@/lib/jikan'
import { useDebounce } from '@/hooks/useDebounce' // I'll create this next
import Link from 'next/link'
import Image from 'next/image'

export const SearchBar = () => {
    const [query, setQuery] = useState('')
    const [results, setResults] = useState<any[]>([])
    const [isLoading, setIsLoading] = useState(false)
    const [isOpen, setIsOpen] = useState(false)
    const debouncedQuery = useDebounce(query, 500)
    const containerRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
                setIsOpen(false)
            }
        }
        document.addEventListener('mousedown', handleClickOutside)
        return () => document.removeEventListener('mousedown', handleClickOutside)
    }, [])

    useEffect(() => {
        if (!debouncedQuery || debouncedQuery.length < 3) {
            setResults([])
            setIsOpen(false)
            return
        }

        const fetchResults = async () => {
            setIsLoading(true)
            try {
                const data = await searchAnime(debouncedQuery, 5)
                setResults(data)
                setIsOpen(true)
            } catch (error) {
                console.error("Search error:", error)
            } finally {
                setIsLoading(false)
            }
        }

        fetchResults()
    }, [debouncedQuery])

    return (
        <div ref={containerRef} className="relative w-full max-w-md">
            <div className="relative group">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                <input
                    type="text"
                    placeholder="Search anime..."
                    className="w-full h-10 pl-10 pr-4 rounded-full bg-muted/50 border-none focus:ring-2 focus:ring-primary/20 transition-all outline-none text-sm"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onFocus={() => query.length >= 3 && setIsOpen(true)}
                />
                {isLoading && (
                    <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 size-4 animate-spin text-primary" />
                )}
            </div>

            {isOpen && results.length > 0 && (
                <div className="absolute top-full left-0 mt-2 w-full bg-background border border-border rounded-xl shadow-2xl overflow-hidden z-[100] animate-in fade-in slide-in-from-top-2 duration-200">
                    <div className="flex flex-col">
                        {results.map((anime) => (
                            <div
                                key={anime.mal_id}
                                className="flex items-center gap-3 p-3 hover:bg-muted/50 transition-colors group border-b border-border/50 last:border-none"
                            >
                                <div className="relative size-12 shrink-0 rounded-md overflow-hidden bg-muted">
                                    <Image
                                        src={anime.images.jpg.image_url}
                                        alt={anime.title}
                                        fill
                                        className="object-cover"
                                    />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <h4 className="text-sm font-bold truncate group-hover:text-primary transition-colors">
                                        {anime.title}
                                    </h4>
                                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                        <span className="flex items-center gap-1">
                                            <Star className="size-3 fill-amber-400 text-amber-400" />
                                            {anime.score}
                                        </span>
                                        <span>•</span>
                                        <span>{anime.type}</span>
                                        <span>•</span>
                                        <span>{anime.year || 'N/A'}</span>
                                    </div>
                                </div>
                                <button
                                    className="p-2 rounded-full bg-primary/10 text-primary hover:bg-primary hover:text-white transition-all active:scale-90"
                                    title="Add to list"
                                >
                                    <Plus className="size-4" />
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    )
}
