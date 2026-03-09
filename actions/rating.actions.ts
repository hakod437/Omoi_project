'use server'

import prisma from "@/lib/prisma"
import { Tier, ActivityType } from "@prisma/client"
import { revalidatePath } from "next/cache"

type RatingInput = {
    userId: string
    animeId: string
    animTier: Tier
    scenTier: Tier
    musicTier: Tier
    globalScore: number
    globalTier: Tier
    review?: string
}

export async function submitRatingAction(data: RatingInput) {
    try {
        console.log('[🎯 RATING] 📝 Soumission de rating pour userId:', data.userId, 'animeId:', data.animeId)
        
        // 1. S'assurer que l'anime est dans la userList de l'utilisateur
        console.log('[🎯 RATING] 📋 Ajout à userList si nécessaire...')
        await prisma.userList.upsert({
            where: {
                userId_animeId: {
                    userId: data.userId,
                    animeId: data.animeId
                }
            },
            update: {
                status: 'WATCHING' // Met à jour le statut si déjà présent
            },
            create: {
                userId: data.userId,
                animeId: data.animeId,
                status: 'WATCHING' // Statut par défaut quand on note
            }
        })
        console.log('[🎯 RATING] ✅ userList mis à jour')

        // 2. Submit rating
        console.log('[🎯 RATING] ⭐ Création/Mise à jour du rating...')
        const rating = await prisma.rating.upsert({
            where: {
                userId_animeId: {
                    userId: data.userId,
                    animeId: data.animeId
                }
            },
            update: {
                animTier: data.animTier,
                scenTier: data.scenTier,
                musicTier: data.musicTier,
                globalScore: data.globalScore,
                globalTier: data.globalTier,
            },
            create: {
                userId: data.userId,
                animeId: data.animeId,
                animTier: data.animTier,
                scenTier: data.scenTier,
                musicTier: data.musicTier,
                globalScore: data.globalScore,
                globalTier: data.globalTier,
            }
        })
        console.log('[🎯 RATING] ✅ Rating enregistré:', rating.id)

        // 3. Create review if content provided
        if (data.review) {
            console.log('[🎯 RATING] 📝 Création de la review...')
            await prisma.review.upsert({
                where: { ratingId: rating.id },
                update: { content: data.review },
                create: {
                    content: data.review,
                    userId: data.userId,
                    animeId: data.animeId,
                    ratingId: rating.id
                }
            })
            console.log('[🎯 RATING] ✅ Review enregistrée')
        }

        // 4. Log activity
        console.log('[🎯 RATING] 📊 Création de lactivité...')
        await prisma.activity.create({
            data: {
                userId: data.userId,
                type: ActivityType.RATING_POST,
                animeId: data.animeId,
                content: `Rated this anime ${data.globalTier}`
            }
        })
        console.log('[🎯 RATING] ✅ Activité enregistrée')

        // 5. Revalidation des pages
        revalidatePath('/dashboard')
        revalidatePath('/')
        
        console.log('[🎯 RATING] 🎉 Rating complet terminé avec succès')
        return { success: true, data: rating }
    } catch (error) {
        console.error("[🎯 RATING] ❌ Rating submission error:", error)
        return { success: false, error: "Failed to submit rating" }
    }
}

