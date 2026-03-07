'use client'

import React, { useState, useEffect } from 'react'
import type { Tier } from '@/types/anime'
import { TierSelector } from '../molecules/TierSelector'
import { Button } from '../atoms/Base'
import { calculateGlobalScore, getTierFromScore } from '@/lib/scoring'
import { Loader2 } from 'lucide-react'

export const RatingForm = ({ animeId }: { animeId: string }) => {
    const [animTier, setAnimTier] = useState<Tier | null>(null)
    const [scenTier, setScenTier] = useState<Tier | null>(null)
    const [musicTier, setMusicTier] = useState<Tier | null>(null)
    const [review, setReview] = useState('')
    const [globalScore, setGlobalScore] = useState<number | null>(null)
    const [isSubmitting, setIsSubmitting] = useState(false)

    useEffect(() => {
        if (animTier && scenTier && musicTier) {
            const score = calculateGlobalScore(animTier, scenTier, musicTier)
            setGlobalScore(score)
        }
    }, [animTier, scenTier, musicTier])

    const isComplete = animTier && scenTier && musicTier

    const handleSubmit = async () => {
        void animeId
        void review
        if (!isComplete) return

        setIsSubmitting(true)
        try {
            alert('Backend disabled (frontend-only mode).')
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <div className="rounded-2xl border border-[var(--border)] bg-[var(--card)]/50 p-6 backdrop-blur-sm">
            <div className="mb-6 flex items-center justify-between">
                <h3 className="font-kawaii text-xl text-[var(--foreground)]">Rate this Anime</h3>
                {globalScore !== null && (
                    <div className="text-right">
                        <div className="font-kawaii text-3xl font-bold text-[var(--primary)]">
                            {getTierFromScore(globalScore)}
                        </div>
                        <div className="text-xs uppercase opacity-50 font-bold tracking-widest">
                            Global Tier
                        </div>
                    </div>
                )}
            </div>

            <div className="space-y-6">
                <TierSelector
                    title="🎬 Animation Quality (50%)"
                    value={animTier}
                    onChange={setAnimTier}
                />
                <TierSelector
                    title="📖 Story / Scenario (30%)"
                    value={scenTier}
                    onChange={setScenTier}
                />
                <TierSelector
                    title="🎵 Music & Sound (20%)"
                    value={musicTier}
                    onChange={setMusicTier}
                />

                <div className="space-y-2">
                    <h4 className="text-sm font-bold uppercase tracking-widest text-[var(--primary)]">
                        Your Review (Optional)
                    </h4>
                    <textarea
                        value={review}
                        onChange={(e) => setReview(e.target.value)}
                        className="w-full min-h-[120px] rounded-xl bg-[var(--background)] p-4 text-sm outline-none focus:ring-2 ring-[var(--primary)] transition-all border border-transparent focus:border-transparent"
                        placeholder="What did you think of the vibes?"
                        maxLength={2000}
                    />
                </div>

                <Button
                    className="w-full py-4 text-lg flex items-center justify-center gap-2"
                    disabled={!isComplete || isSubmitting}
                    onClick={handleSubmit}
                >
                    {isSubmitting ? <Loader2 className="animate-spin" /> : null}
                    {isComplete ? (isSubmitting ? 'Saving...' : 'Submit Rating') : 'Finish all 3 categories'}
                </Button>
            </div>
        </div>
    )
}

