'use client'

import React, { useState } from 'react'
import { Users, Zap, Loader2, Heart, ArrowLeft } from 'lucide-react'
import { Button } from '@/components/atoms/Base'
import { searchUsersAction, compareUsersAction } from '@/actions/social.actions'
import Image from 'next/image'
import { useSession } from 'next-auth/react'
import { motion } from 'framer-motion'

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
                setResults(res.data || [])
            }
        } catch (error) {
            console.error(error)
        } finally {
            setIsLoading(false)
        }
    }

    const { data: session } = useSession()

    const handleCompare = async (user: any) => {
        if (!session?.user?.id) {
            return
        }

        setIsComparing(true)
        setSelectedUser(user)
        try {
            const res = await compareUsersAction(user.id)
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
            <div className="max-w-5xl mx-auto py-12 px-6 space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <button
                    onClick={() => { setComparison(null); setSelectedUser(null); }}
                    className="flex items-center gap-2 text-white/40 hover:text-[var(--primary)] transition-all font-black text-[10px] uppercase tracking-[0.2em]"
                >
                    <ArrowLeft size={16} /> Retour à la recherche
                </button>

                <div className="bg-[#0A0A0B]/60 border border-white/5 rounded-[2.5rem] p-12 backdrop-blur-2xl space-y-12 relative overflow-hidden shadow-[0_0_80px_rgba(0,0,0,0.5)]">
                    {/* Background Decorative Blobs */}
                    <div className="absolute -top-20 -right-20 size-64 bg-[var(--primary)]/10 blur-[100px] pointer-events-none" />
                    <div className="absolute -bottom-20 -left-20 size-64 bg-[var(--accent)]/10 blur-[100px] pointer-events-none" />

                    <div className="relative flex flex-col items-center gap-8">
                        <div className="flex items-center justify-center gap-6 md:gap-24">
                            {/* User Me */}
                            <div className="flex flex-col items-center gap-4">
                                <div className="size-28 rounded-[2rem] border border-white/10 p-1.5 bg-white/5 rotate-[-6deg] group hover:rotate-0 transition-transform duration-500">
                                    <div className="size-full bg-gradient-to-br from-[var(--primary)] to-[var(--accent)] rounded-[1.5rem] flex items-center justify-center font-black text-2xl text-white shadow-[var(--glow)]">
                                        VOUS
                                    </div>
                                </div>
                                <span className="text-[10px] font-black uppercase tracking-widest text-white/40">Moi</span>
                            </div>

                            {/* Middle compatibility Circle */}
                            <div className="relative size-40 md:size-56 flex items-center justify-center">
                                <svg className="size-full -rotate-90">
                                    <circle
                                        cx="50%" cy="50%" r="48%"
                                        stroke="rgba(255,255,255,0.03)"
                                        strokeWidth="8"
                                        fill="none"
                                    />
                                    <circle
                                        cx="50%" cy="50%" r="48%"
                                        stroke="var(--primary)"
                                        strokeWidth="8"
                                        fill="none"
                                        strokeDasharray="301.59"
                                        strokeDashoffset={301.59 * (1 - comparison.compatibility / 100)}
                                        strokeLinecap="round"
                                        className="transition-all duration-1000 ease-out"
                                    />
                                </svg>
                                <div className="absolute flex flex-col items-center transform scale-90 md:scale-100">
                                    <span className="text-5xl md:text-7xl font-black text-white font-kawaii drop-shadow-[0_0_20px_rgba(var(--primary-rgb),0.5)]">
                                        {Math.round(comparison.compatibility)}<span className="text-2xl">%</span>
                                    </span>
                                    <span className="text-[10px] font-black text-[var(--primary)] uppercase tracking-[0.3em] mt-2">Affinité</span>
                                </div>
                            </div>

                            {/* Target User */}
                            <div className="flex flex-col items-center gap-4">
                                <div className="size-28 rounded-[2rem] border border-white/10 p-1.5 bg-white/5 rotate-[6deg] group hover:rotate-0 transition-transform duration-500">
                                    {selectedUser.avatar ? (
                                        <Image src={selectedUser.avatar} alt={selectedUser.username} width={112} height={112} className="size-full rounded-[1.5rem] object-cover" />
                                    ) : (
                                        <div className="size-full bg-white/5 rounded-[1.5rem] flex items-center justify-center font-black text-2xl text-white/20">
                                            {selectedUser.username[0].toUpperCase()}
                                        </div>
                                    )}
                                </div>
                                <span className="text-[10px] font-black uppercase tracking-widest text-white/40">@{selectedUser.username}</span>
                            </div>
                        </div>

                        <div className="text-center max-w-xl">
                            <h2 className="text-3xl font-kawaii text-white mb-3">
                                {comparison.compatibility > 80 ? "Âmes Sœurs d'Anime ! ✨" : comparison.compatibility > 50 ? "Même Vibe ! 🤝" : "Goûts Divergents ! 🌊"}
                            </h2>
                            <p className="text-white/40 text-xs font-bold uppercase tracking-widest leading-relaxed">
                                Vous partagez <span className="text-white">{comparison.commonCount}</span> animes dans vos coffres respectifs.
                            </p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                        {/* Genre matching */}
                        <div className="space-y-6">
                            <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-[var(--primary)] flex items-center gap-2">
                                <Zap size={14} /> Alignement des genres
                            </h3>
                            <div className="space-y-4">
                                {comparison.commonGenres?.map((genre: any) => (
                                    <div key={genre.name} className="space-y-2">
                                        <div className="flex justify-between text-[11px] font-black uppercase tracking-widest text-white/60">
                                            <span>{genre.name}</span>
                                            <span className="text-white">{genre.alignment > 5 ? 'Excellent' : 'Match'}</span>
                                        </div>
                                        <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                                            <motion.div
                                                initial={{ width: 0 }}
                                                animate={{ width: `${Math.min(100, (genre.alignment / 10) * 100)}%` }}
                                                className="h-full bg-gradient-to-r from-[var(--primary)] to-[var(--accent)]"
                                            />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Common Items */}
                        <div className="space-y-6">
                            <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-[var(--accent)] flex items-center gap-2">
                                <Heart size={14} /> Animes en commun
                            </h3>
                            <div className="grid grid-cols-2 gap-3">
                                {comparison.commonAnimes.slice(0, 4).map((anime: any) => (
                                    <div key={anime.id} className="flex items-center gap-3 p-3 rounded-2xl bg-white/5 border border-white/5 overflow-hidden group hover:border-white/10 transition-all">
                                        <div className="size-10 relative shrink-0 rounded-lg overflow-hidden border border-white/10">
                                            <Image src={anime.imageUrl} alt={anime.title} fill className="object-cover group-hover:scale-110 transition-transform" />
                                        </div>
                                        <span className="text-[10px] font-black uppercase tracking-tight text-white/70 truncate">{anime.title}</span>
                                    </div>
                                ))}
                            </div>
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
