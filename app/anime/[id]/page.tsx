import React from 'react'
import Image from 'next/image'
import { getAnimeById } from '@/lib/jikan'
import { RatingForm } from '@/components/organisms/RatingForm'
import { Badge } from '@/components/atoms/Base'
import { Calendar, Monitor, Film, Star } from 'lucide-react'

import { AnimeService } from '@/services/anime.service'

export default async function AnimeDetail({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params
    const result = await AnimeService.getById(parseInt(id))

    if (!result.success || !result.data) return <div>{result.error || 'Anime not found'}</div>
    const anime = result.data

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 py-8">
            {/* Left Column: Info & Synopsis */}
            <div className="lg:col-span-2 space-y-8 animate-in fade-in slide-in-from-left-8 duration-700">
                <div className="relative h-[400px] w-full rounded-3xl overflow-hidden shadow-2xl">
                    <Image
                        src={anime.images.webp.large_image_url}
                        alt={anime.title}
                        fill
                        className="object-cover"
                        priority
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[var(--background)] via-transparent to-transparent" />

                    <div className="absolute bottom-8 left-8 right-8 flex flex-wrap gap-2">
                        {anime.genres.map((g: any) => (
                            <Badge key={g.name} variant="primary" className="text-sm px-3 py-1 bg-[var(--background)]/60 backdrop-blur-md">
                                {g.name}
                            </Badge>
                        ))}
                    </div>
                </div>

                <div className="space-y-4">
                    <h1 className="text-4xl md:text-5xl font-kawaii text-[var(--foreground)] tracking-tight">
                        {anime.title}
                    </h1>
                    <div className="flex flex-wrap gap-6 text-[var(--foreground)]/60 font-medium font-ui">
                        <InfoItem icon={<Film size={18} />} label={anime.studios?.[0]?.name || 'Unknown'} />
                        <InfoItem icon={<Monitor size={18} />} label={`${anime.episodes || '?'} Episodes`} />
                        <InfoItem icon={<Calendar size={18} />} label={anime.year || anime.season || 'Unknown'} />
                        <InfoItem icon={<Star className="text-yellow-400" size={18} />} label={`${anime.score || 'N/A'} MAL`} />
                    </div>
                </div>

                <div className="space-y-4">
                    <h2 className="text-2xl font-kawaii text-[var(--primary)]">Synopsis</h2>
                    <p className="text-lg leading-relaxed text-[var(--foreground)]/80 font-body">
                        {anime.synopsis || "No synopsis available."}
                    </p>
                </div>
            </div>

            {/* Right Column: Rating Panel (Sticky) */}
            <aside className="lg:sticky lg:top-24 h-fit animate-in fade-in slide-in-from-right-8 duration-700">
                <RatingForm animeId={id} />

                {/* Additional Stats / Community Info (Placeholder) */}
                <div className="mt-8 p-6 rounded-2xl border border-[var(--border)] bg-[var(--card)]/20 space-y-4">
                    <h4 className="font-ui font-bold text-sm uppercase tracking-widest text-[var(--foreground)]/40">
                        Community Stats
                    </h4>
                    <div className="grid grid-cols-2 gap-4">
                        <SmallStat label="Avg Anim" value="S" color="text-red-400" />
                        <SmallStat label="Popularity" value={`#${anime.popularity}`} color="" />
                    </div>
                </div>
            </aside>
        </div>
    )
}

function InfoItem({ icon, label }: { icon: React.ReactNode, label: string | number }) {
    return (
        <div className="flex items-center gap-2">
            {icon}
            <span>{label}</span>
        </div>
    )
}

function SmallStat({ label, value, color }: { label: string, value: string, color: string }) {
    return (
        <div>
            <div className="text-xs uppercase font-bold opacity-40">{label}</div>
            <div className={`text-xl font-kawaii ${color || 'text-[var(--foreground)]'}`}>{value}</div>
        </div>
    )
}
