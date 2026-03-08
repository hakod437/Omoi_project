"use server"

import prisma from "@/lib/prisma"
import { ServiceResponse } from "@/types/service"
import { calculateGlobalScore } from "@/lib/scoring"
import { Tier } from "@prisma/client"

export async function recalculateAllAnimeScoresAction(): Promise<ServiceResponse<any>> {
    try {
        const animes = await prisma.anime.findMany({
            include: {
                ratings: true
            }
        })

        let updatedCount = 0

        for (const anime of animes) {
            if (anime.ratings.length === 0) continue

            const total = anime.ratings.length

            // Average scores per category (using 2, 4, 6, 8, 10 for tiers)
            const tierToScore = (t: Tier) => {
                const map: Record<Tier, number> = { S: 10, A: 8, B: 6, C: 4, D: 2 }
                return map[t]
            }

            const avgAnim = anime.ratings.reduce((sum, r) => sum + tierToScore(r.animTier), 0) / total
            const avgScen = anime.ratings.reduce((sum, r) => sum + tierToScore(r.scenTier), 0) / total
            const avgMusic = anime.ratings.reduce((sum, r) => sum + tierToScore(r.musicTier), 0) / total

            // Global score calculation
            const totalGlobal = anime.ratings.reduce((sum, r) => sum + r.globalScore, 0) / total

            await prisma.anime.update({
                where: { id: anime.id },
                data: {
                    avgAnimTier: avgAnim,
                    avgScenTier: avgScen,
                    avgMusicTier: avgMusic,
                    avgGlobal: totalGlobal,
                    totalRatings: total
                }
            })
            updatedCount++
        }

        return { success: true, data: { updatedCount } }
    } catch (error) {
        console.error("Failed to recalculate scores:", error)
        return { success: false, error: "Failed to recalculate scores" }
    }
}
