'use server'

import prisma from "@/lib/prisma"
import { requireUserId } from "@/lib/require-user"
import { Tier, ActivityType } from "@prisma/client"
import { revalidatePath } from "next/cache"

type RatingInput = {
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
        const userId = await requireUserId()

        // 1. S'assurer que l'anime est dans la userList de l'utilisateur
        await prisma.userList.upsert({
            where: {
                userId_animeId: {
                    userId,
                    animeId: data.animeId
                }
            },
            update: {
                status: 'WATCHING' // Met à jour le statut si déjà présent
            },
            create: {
                userId,
                animeId: data.animeId,
                status: 'WATCHING' // Statut par défaut quand on note
            }
        })
        // 2. Submit rating
        const rating = await prisma.rating.upsert({
            where: {
                userId_animeId: {
                    userId,
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
                userId,
                animeId: data.animeId,
                animTier: data.animTier,
                scenTier: data.scenTier,
                musicTier: data.musicTier,
                globalScore: data.globalScore,
                globalTier: data.globalTier,
            }
        })
        // 3. Create review if content provided
        if (data.review) {
            await prisma.review.upsert({
                where: { ratingId: rating.id },
                update: { content: data.review },
                create: {
                    content: data.review,
                    userId,
                    animeId: data.animeId,
                    ratingId: rating.id
                }
            })
        }

        // 4. Log activity
        await prisma.activity.create({
            data: {
                userId,
                type: ActivityType.RATING_POST,
                animeId: data.animeId,
                content: `Rated this anime ${data.globalTier}`
            }
        })
        // 5. Revalidation des pages
        revalidatePath('/dashboard')
        revalidatePath('/')

        return { success: true, data: rating }
    } catch (error) {
        console.error("[🎯 RATING] ❌ Rating submission error:", error)
        return { success: false, error: "Failed to submit rating" }
    }
}
