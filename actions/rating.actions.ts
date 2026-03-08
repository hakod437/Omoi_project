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
        // 1. Submit rating
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

        // 2. Create review if content provided
        if (data.review) {
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
        }

        // 3. Log activity
        await prisma.activity.create({
            data: {
                userId: data.userId,
                type: ActivityType.RATING_POST,
                animeId: data.animeId,
                content: `Rated this anime ${data.globalTier}`
            }
        })

        // 4. (Optional) Update Anime averages - Simplified for now
        // Usually handled by a background worker or middleware to avoid blocking

        revalidatePath('/')
        return { success: true, data: rating }
    } catch (error) {
        console.error("Rating submission error:", error)
        return { success: false, error: "Failed to submit rating" }
    }
}

