'use client'

import React, { useState } from 'react'
import { Search, Users, Zap, Loader2 } from 'lucide-react'
import { Button } from '@/components/atoms/Base'

export default function Compare() {
    const [query, setQuery] = useState('')
    const [results, setResults] = useState<any[]>([])
    const [isLoading, setIsLoading] = useState(false)

    const handleSearch = async () => {
        if (query.length < 2) return
        setIsLoading(true)
        try {
            const res = await fetch(`/api/users/search?q=${encodeURIComponent(query)}`)
            const data = await res.json()
            setResults(data)
        } catch (error) {
            console.error(error)
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="max-w-4xl mx-auto py-12 space-y-12">
            <div className="text-center space-y-4">
                <h1 className="text-5xl font-kawaii text-[var(--foreground)] tracking-tight">
                    Taste <span className="text-[var(--primary)]">Sync</span>
                </h1>
                <p className="text-[var(--foreground)]/60 font-medium font-ui flex items-center justify-center gap-2">
                    <Users size={18} />
                    Compare your vault with other members to find your anime soulmate.
                </p>
            </div>

            <div className="bg-[var(--card)]/40 border border-[var(--border)] rounded-3xl p-8 backdrop-blur-xl space-y-8 shadow-2xl">
                <div className="space-y-4">
                    <h2 className="text-xl font-kawaii text-[var(--foreground)]">Find a Friend</h2>
                    <div className="flex gap-4">
                        <div className="relative flex-1">
                            <input
                                type="text"
                                placeholder="Search by username..."
                                value={query}
                                onChange={(e) => setQuery(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                                className="w-full bg-[var(--background)]/60 border border-[var(--border)] rounded-2xl px-6 py-4 outline-none focus:ring-2 ring-[var(--primary)] text-lg"
                            />
                            {isLoading && (
                                <Loader2 className="absolute right-4 top-1/2 -translate-y-1/2 animate-spin text-[var(--primary)]" />
                            )}
                        </div>
                        <Button onClick={handleSearch} className="px-8">Search</Button>
                    </div>
                </div>

                <div className="space-y-4">
                    {results.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {results.map((user) => (
                                <div key={user.id} className="flex items-center justify-between p-4 rounded-2xl bg-[var(--background)]/40 border border-[var(--border)] hover:border-[var(--primary)] transition-colors group">
                                    <div className="flex items-center gap-4">
                                        <div className="size-12 rounded-full bg-[var(--muted)] overflow-hidden">
                                            {user.avatar ? (
                                                <img src={user.avatar} alt={user.username} className="size-full object-cover" />
                                            ) : (
                                                <div className="size-full flex items-center justify-center font-bold text-lg uppercase">
                                                    {user.username[0]}
                                                </div>
                                            )}
                                        </div>
                                        <div>
                                            <div className="font-bold text-[var(--foreground)]">{user.displayName || user.username}</div>
                                            <div className="text-sm opacity-40">@{user.username}</div>
                                        </div>
                                    </div>
                                    <Button size="sm" variant="ghost" className="group-hover:text-[var(--primary)]">
                                        Compare →
                                    </Button>
                                </div>
                            ))}
                        </div>
                    ) : query && !isLoading ? (
                        <div className="text-center py-12 opacity-30 italic font-medium">
                            No vault-dwellers found with that name...
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center py-12 opacity-20 space-y-4">
                            <Zap size={64} />
                            <div className="text-center font-bold">Search for someone to start comparing vibes!</div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
