'use client'

import React, { useState, useEffect } from 'react'
import { Button } from '@/components/atoms/Base'
import { TierSelector } from '@/components/molecules/TierSelector'
import type { Tier } from '@/types/anime'
import { calculateGlobalScore, getTierFromScore } from '@/lib/scoring'
import { submitRatingAction } from '@/actions/rating.actions'
import { useRouter } from 'next/navigation'
import { Tier as PrismaTier } from '@prisma/client'

interface ReviewFormProps {
  animeId: string
  userId?: string
  onSubmit?: (data: ReviewFormData) => void
}

interface ReviewFormData {
  animationTier: Tier | null
  scenarioTier: Tier | null
  musicTier: Tier | null
  review: string
}

export const ReviewForm = ({ animeId, userId, onSubmit }: ReviewFormProps) => {
  const [animationTier, setAnimationTier] = useState<Tier | null>(null)
  const [scenarioTier, setScenarioTier] = useState<Tier | null>(null)
  const [musicTier, setMusicTier] = useState<Tier | null>(null)
  const [review, setReview] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [globalScore, setGlobalScore] = useState<number | null>(null)
  const router = useRouter()

  const isComplete = animationTier && scenarioTier && musicTier

  useEffect(() => {
    if (animationTier && scenarioTier && musicTier) {
      setGlobalScore(calculateGlobalScore(animationTier, scenarioTier, musicTier))
      return
    }

    setGlobalScore(null)
  }, [animationTier, scenarioTier, musicTier])

  const handleSubmit = async () => {
    if (!isComplete || !globalScore) return
    if (!userId) {
      alert('Veuillez vous connecter pour noter cet anime.')
      router.push('/login')
      return
    }

    setIsSubmitting(true)
    try {
      const formData: ReviewFormData = {
        animationTier: animationTier!,
        scenarioTier: scenarioTier!,
        musicTier: musicTier!,
        review
      }
      
      await onSubmit?.(formData)

      const result = await submitRatingAction({
        animeId,
        animTier: animationTier as PrismaTier,
        scenTier: scenarioTier as PrismaTier,
        musicTier: musicTier as PrismaTier,
        globalScore,
        globalTier: getTierFromScore(globalScore) as PrismaTier,
        review
      })

      if (!result.success) {
        throw new Error(result.error || 'Failed to submit rating')
      }
      
      // Reset form
      setAnimationTier(null)
      setScenarioTier(null)
      setMusicTier(null)
      setReview('')
      setGlobalScore(null)
      alert('Avis enregistré. Le dashboard a été mis à jour.')
      router.refresh()
    } catch (error) {
      console.error('Error submitting review:', error)
      alert("Impossible d'enregistrer votre avis.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="rounded-2xl border p-6 space-y-6" style={{
      backgroundColor: 'var(--card)',
      borderColor: 'var(--primary)'
    }}>
      <h3 className="text-xl font-kawaii" style={{ color: 'var(--primary)' }}>Donne ton avis</h3>

      <div className="rounded-2xl border p-5 text-center" style={{
        backgroundColor: 'var(--background)',
        borderColor: 'var(--primary)'
      }}>
        <div className="text-xs uppercase tracking-widest font-ui font-bold" style={{ color: 'var(--foreground)', opacity: 0.7 }}>
          Score global calculé
        </div>
        <div className="mt-2 text-4xl font-kawaii font-bold" style={{ color: 'var(--primary)' }}>
          {globalScore === null ? '—' : `Tier ${getTierFromScore(globalScore)}`}
        </div>
      </div>
      
      {/* Tier selectors */}
      <div className="space-y-4">
        <TierSelector
          title="🎬 Animation - Score Spécial"
          value={animationTier}
          onChange={setAnimationTier}
        />
        <TierSelector
          title="📖 Histoire & Scénario"
          value={scenarioTier}
          onChange={setScenarioTier}
        />
        <TierSelector
          title="🎵 Musique & OST"
          value={musicTier}
          onChange={setMusicTier}
        />
      </div>

      {/* Review textarea */}
      <div className="space-y-2">
        <h4 className="text-sm font-bold uppercase tracking-widest font-ui" style={{ color: 'var(--primary)' }}>
          Ton Avis (Optionnel)
        </h4>
        <textarea
          value={review}
          onChange={(e) => setReview(e.target.value)}
          className="w-full min-h-[120px] rounded-xl p-4 text-sm font-body outline-none transition-all border"
          style={{
            backgroundColor: 'var(--background)',
            borderColor: 'var(--primary)',
            color: 'var(--foreground)'
          }}
          placeholder="Partage tes impressions sur l'anime... Ce qui t'a marqué, déçu, surpris..."
          maxLength={2000}
        />
      </div>

      {/* Submit button */}
      <Button
        className="w-full py-4 text-lg flex items-center justify-center gap-2 font-ui border-0"
        style={{
          backgroundColor: 'var(--primary)',
          color: 'white'
        }}
        disabled={!isComplete || isSubmitting}
        onClick={handleSubmit}
      >
        {isSubmitting ? 'Publication...' : 'Publier mon avis +'}
      </Button>
    </div>
  )
}
