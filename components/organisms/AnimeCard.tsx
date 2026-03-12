'use client'

import React from 'react'
import { motion } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'
import type { Tier } from '@/types/anime'
import { Badge } from '../atoms/Base'
import { TierDot } from '../atoms/Tier'
import { Plus, Check, Loader2 } from 'lucide-react'
import { addAnimeToListAction } from '@/actions/list.actions'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs))
}

interface AnimeCardProps {
    id: string
    title: string
    imageUrl: string
    genres: string[]
    globalTier?: Tier
    avgAnimTier?: Tier
    avgScenTier?: Tier
    avgMusicTier?: Tier
}

const QuickAddButton = ({ id, title, imageUrl, genres }: { id: string, title: string, imageUrl: string, genres: string[] }) => {
    const { data: session } = useSession()
    const router = useRouter()
    const [isPending, setIsPending] = React.useState(false)
    const [isAdded, setIsAdded] = React.useState(false)

    const handleAdd = async (e: React.MouseEvent) => {
        e.preventDefault()
        e.stopPropagation()

        if (!session?.user?.id) {
            router.push('/login')
            return
        }

        setIsPending(true)

        try {
            const result = await addAnimeToListAction({
                malId: parseInt(id),
                title,
                imageUrl,
                genres: genres.join(', '),
            })
            if (result.success) setIsAdded(true)
        } catch (err) {
            console.error(err)
        } finally {
            setIsPending(false)
        }
    }

    return (
        <button
            onClick={handleAdd}
            disabled={isAdded || isPending}
            className={cn(
                "absolute top-3 right-3 size-10 rounded-full flex items-center justify-center transition-all z-10 shadow-lg active:scale-90",
                isAdded
                    ? "bg-green-500 text-white cursor-default"
                    : "bg-white/10 backdrop-blur-md text-white hover:bg-primary hover:scale-110"
            )}
        >
            {isPending ? (
                <Loader2 className="size-5 animate-spin" />
            ) : isAdded ? (
                <Check className="size-5 text-white" />
            ) : (
                <Plus className="size-5" />
            )}
        </button>
    )
}

export const AnimeCard = ({
    id,
    title,
    imageUrl,
    genres,
    globalTier,
    avgAnimTier,
    avgScenTier,
    avgMusicTier
}: AnimeCardProps) => {
    return (
        <motion.div
            whileHover={{ y: -8 }}
            className="relative group/card overflow-visible"
        >
            <QuickAddButton id={id} title={title} imageUrl={imageUrl} genres={genres} />
            <Link href={`/anime/${id}`} className="group block">
                <div className="relative aspect-[2/3] w-full overflow-hidden rounded-[2rem] bg-white/5 border border-white/10 shadow-2xl transition-all group-hover:border-[var(--primary)]/30 group-hover:shadow-[var(--glass-shadow)]">
                    <Image
                        src={imageUrl}
                        alt={title}
                        fill
                        className="object-cover transition-transform duration-700 group-hover:scale-110"
                    />

                    {/* Pro Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0B] via-[#0A0A0B]/60 to-transparent opacity-80" />

                    <div className="absolute inset-x-0 bottom-0 p-5 space-y-3">
                        <h3 className="line-clamp-2 text-xl font-black text-white font-kawaii leading-tight">
                            {title}
                        </h3>

                        <div className="flex flex-wrap gap-1.5">
                            {genres.slice(0, 2).map((g) => (
                                <Badge key={g} variant="primary" className="bg-white/10 border-white/10 text-[10px] uppercase font-black tracking-widest px-2.5">
                                    {g}
                                </Badge>
                            ))}
                        </div>

                        {/* Tier Dots & Global Score */}
                        <div className="flex items-center justify-between pt-1 border-t border-white/5">
                            <div className="flex gap-2">
                                {avgAnimTier && <TierDot tier={avgAnimTier} size="sm" />}
                                {avgScenTier && <TierDot tier={avgScenTier} size="sm" />}
                                {avgMusicTier && <TierDot tier={avgMusicTier} size="sm" />}
                            </div>

                            {globalTier && (
                                <div className="flex items-center gap-1.5">
                                    <span className="text-[10px] font-black text-white/30 tracking-tighter uppercase">Global</span>
                                    <span className="font-kawaii text-2xl font-black text-transparent bg-clip-text" style={{ backgroundImage: `var(--tier-${globalTier.toLowerCase()})` }}>
                                        {globalTier}
                                    </span>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </Link>
        </motion.div>
    )
}

