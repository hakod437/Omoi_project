import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import type { Tier } from '@/types/anime'
import { Badge } from '../atoms/Base'
import { TierDot } from '../atoms/Tier'
import { Plus, Check, Loader2 } from 'lucide-react'
import { addAnimeToListAction } from '@/actions/list.actions'
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
    const [isPending, setIsPending] = React.useState(false)
    const [isAdded, setIsAdded] = React.useState(false)

    const handleAdd = async (e: React.MouseEvent) => {
        e.preventDefault()
        e.stopPropagation()
        setIsPending(true)

        try {
            // userId would normally come from session
            const userId = "temp-user-id"
            const result = await addAnimeToListAction(userId, {
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
        <div className="relative group/card overflow-visible">
            <QuickAddButton id={id} title={title} imageUrl={imageUrl} genres={genres} />
            <Link href={`/anime/${id}`} className="group block">
                <div className="relative aspect-[2/3] w-full overflow-hidden rounded-2xl bg-[var(--card)] shadow-xl transition-all group-hover:scale-[1.02] group-hover:shadow-2xl">
                    <Image
                        src={imageUrl}
                        alt={title}
                        fill
                        className="object-cover transition-transform group-hover:scale-110"
                    />

                    {/* Overlays */}
                    <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-[var(--background)] via-[var(--background)]/80 to-transparent p-4">
                        <h3 className="line-clamp-2 text-lg font-bold text-[var(--foreground)] font-ui">
                            {title}
                        </h3>

                        <div className="mt-2 flex flex-wrap gap-1">
                            {genres.slice(0, 2).map((g) => (
                                <Badge key={g} variant="primary" className="bg-[var(--primary)]/10">
                                    {g}
                                </Badge>
                            ))}
                        </div>

                        {/* Tier Dots */}
                        <div className="mt-3 flex items-center justify-between border-t border-[var(--border)] pt-2">
                            <div className="flex gap-1.5">
                                {avgAnimTier && <TierDot tier={avgAnimTier} size="sm" />}
                                {avgScenTier && <TierDot tier={avgScenTier} size="sm" />}
                                {avgMusicTier && <TierDot tier={avgMusicTier} size="sm" />}
                            </div>

                            {globalTier && (
                                <span className="font-kawaii text-2xl font-bold text-[var(--accent)] drop-shadow-md">
                                    {globalTier}
                                </span>
                            )}
                        </div>
                    </div>
                </div>
            </Link>
        </div>
    )
}

