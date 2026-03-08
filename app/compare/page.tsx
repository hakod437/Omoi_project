'use client'

import React, { useState } from 'react'
import { Search, Users, Zap, Loader2, Heart, ArrowLeft, Info } from 'lucide-react'
import { Button, Badge } from '@/components/atoms/Base'
import { searchUsersAction, compareUsersAction } from '@/actions/social.actions'
import Image from 'next/image'

export default function Compare() {
    const [query, setQuery] = useState('')
    const [results, setResults] = useState<any[]>([])
    const [isLoading, setIsLoading] = useState(false)
    const [comparison, setComparison] = useState<any | null>(null)
    const [isComparing, setIsComparing] = useState(false)
    const [selectedUser, setSelectedUser] = useState<any | null>(null)

    const handleSearch = async () => {
        if (query.length < 2) return
        setIsLoading(true)
        try {
            const res = await searchUsersAction(query)
            if (res.success) {
                setResults(res.data)
            }
        } catch (error) {
            console.error(error)
        } finally {
            setIsLoading(false)
        }
    }

    const handleCompare = async (user: any) => {
        setIsComparing(true)
        setSelectedUser(user)
        try {
            // userId would normally come from session
            const currentUserId = "temp-user-id"
            const res = await compareUsersAction(currentUserId, user.id)
            if (res.success) {
                setComparison(res.data)
            }
        } catch (error) {
            console.error(error)
        } finally {
            setIsComparing(false)
        }
    }

    if (comparison) {
        return (
            <div className="max-w-4xl mx-auto py-12 space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <button
                    onClick={() => { setComparison(null); setSelectedUser(null); }}
                    className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors font-bold text-sm"
                >
                    <ArrowLeft size={16} /> Back to Search
                </button>

                <div className="bg-card/40 border border-border rounded-3xl p-12 backdrop-blur-xl space-y-12 text-center relative overflow-hidden shadow-2xl">
                    {/* Background Glow */}
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-64 bg-primary/20 blur-[100px] pointer-events-none" />

                    <div className="space-y-6 relative">
                        <div className="flex items-center justify-center gap-8 md:gap-16">
                            <div className="relative group">
                                <div className="size-24 rounded-full border-4 border-primary/20 p-1 group-hover:border-primary/50 transition-all">
                                    <div className="size-full bg-muted rounded-full flex items-center justify-center font-bold text-2xl bg-gradient-to-br from-primary to-accent text-white">
                                        Me
                                    </div>
                                </div>
                            </div>

                            <div className="flex flex-col items-center">
                                <div className="text-4xl md:text-6xl font-black text-primary font-kawaii mb-1 drop-shadow-lg">
                                    {Math.round(comparison.compatibility)}%
                                </div>
                                <Badge variant="primary">Match Rate</Badge>
                            </div>

                            <div className="relative group">
                                <div className="size-24 rounded-full border-4 border-primary/20 p-1 group-hover:border-primary/50 transition-all">
                                    {selectedUser.avatar ? (
                                        <Image src={selectedUser.avatar} alt={selectedUser.username} width={96} height={96} className="rounded-full" />
                                    ) : (
                                        <div className="size-full bg-muted rounded-full flex items-center justify-center font-bold text-2xl text-foreground/40">
                                            {selectedUser.username[0].toUpperCase()}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        <div className="max-w-md mx-auto">
                            <h2 className="text-2xl font-kawaii mb-2">
                                {comparison.compatibility > 80 ? "Anime Soulmates! ✨" : comparison.compatibility > 50 ? "Same Vibes! 🤝" : "Different Tastes! 🌊"}
                            </h2>
                            <p className="text-muted-foreground text-sm font-medium">
                                You have {comparison.commonCount} anime in common. Here's how your tastes align.
                            </p>
                        </div>
                    </div>

                    {/* Common Anime List */}
                    <div className="space-y-4 text-left">
                        <h3 className="text-sm font-bold uppercase tracking-widest text-primary flex items-center gap-2">
                            <Info size={16} /> Shared Vault Items
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {comparison.commonAnimes.map((anime: any) => (
                                <div key={anime.id} className="flex items-center gap-3 p-3 rounded-xl bg-background/50 border border-border/50">
                                    <div className="size-10 relative rounded-md overflow-hidden bg-muted">
                                        <Image src={anime.imageUrl} alt={anime.title} fill className="object-cover" />
                                    </div>
                                    <span className="text-sm font-bold truncate">{anime.title}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className="max-w-4xl mx-auto py-12 space-y-12">
            <div className="text-center space-y-4 animate-in fade-in slide-in-from-top-4 duration-500">
                <h1 className="text-5xl font-kawaii text-[var(--foreground)] tracking-tight">
                    Taste <span className="text-[var(--primary)]">Sync</span>
                </h1>
                <p className="text-[var(--foreground)]/60 font-medium font-ui flex items-center justify-center gap-2">
                    <Users size={18} />
                    Compare your vault with other members to find your anime soulmate.
                </p>
            </div>

            <div className="bg-[var(--card)]/40 border border-[var(--border)] rounded-3xl p-8 backdrop-blur-xl space-y-8 shadow-2xl relative overflow-hidden">
                <div className="space-y-4 relative">
                    <h2 className="text-xl font-kawaii text-[var(--foreground)]">Find a Friend</h2>
                    <div className="flex gap-4">
                        <div className="relative flex-1 group">
                            <input
                                type="text"
                                placeholder="Search by username..."
                                value={query}
                                onChange={(e) => setQuery(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                                className="w-full bg-[var(--background)]/60 border border-[var(--border)] rounded-2xl px-6 py-4 outline-none focus:ring-2 ring-[var(--primary)] text-lg transition-all"
                            />
                            {isLoading && (
                                <Loader2 className="absolute right-4 top-1/2 -translate-y-1/2 animate-spin text-[var(--primary)]" />
                            )}
                        </div>
                        <Button onClick={handleSearch} className="px-8 shadow-lg">Search</Button>
                    </div>
                </div>

                <div className="space-y-4 relative">
                    {results.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {results.map((user) => (
                                <div key={user.id} className="flex items-center justify-between p-4 rounded-2xl bg-[var(--background)]/40 border border-[var(--border)] hover:border-[var(--primary)] transition-all hover:scale-[1.02] hover:shadow-xl group">
                                    <div className="flex items-center gap-4">
                                        <div className="size-12 rounded-full bg-[var(--muted)] overflow-hidden border-2 border-border group-hover:border-primary/50 transition-colors">
                                            {user.avatar ? (
                                                <Image src={user.avatar} alt={user.username} width={48} height={48} className="size-full object-cover" />
                                            ) : (
                                                <div className="size-full flex items-center justify-center font-bold text-lg uppercase bg-muted text-muted-foreground/50">
                                                    {user.username[0]}
                                                </div>
                                            )}
                                        </div>
                                        <div>
                                            <div className="font-bold text-[var(--foreground)]">{user.displayName || user.username}</div>
                                            <div className="text-sm opacity-40">@{user.username}</div>
                                        </div>
                                    </div>
                                    <Button
                                        size="sm"
                                        variant="ghost"
                                        onClick={() => handleCompare(user)}
                                        disabled={isComparing && selectedUser?.id === user.id}
                                        className="group-hover:text-[var(--primary)]"
                                    >
                                        {isComparing && selectedUser?.id === user.id ? <Loader2 size={16} className="animate-spin" /> : "Compare →"}
                                    </Button>
                                </div>
                            ))}
                        </div>
                    ) : query && !isLoading ? (
                        <div className="text-center py-12 opacity-30 italic font-medium flex flex-col items-center gap-4">
                            <Zap className="size-12" />
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

