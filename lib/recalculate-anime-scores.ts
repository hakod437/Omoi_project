import prisma from "@/lib/prisma"
import { Tier } from "@prisma/client"

function tierToScore(tier: Tier) {
    const map: Record<Tier, number> = {
        S: 10,
        A: 8,
        B: 6,
        C: 4,
        D: 2,
    }

    return map[tier]
}

export async function recalculateAllAnimeScores() {
    const animes = await prisma.anime.findMany({
        include: {
            ratings: true,
        },
    })

    let updatedCount = 0

    for (const anime of animes) {
        if (anime.ratings.length === 0) {
            continue
        }

        const total = anime.ratings.length
        const avgAnim = anime.ratings.reduce((sum, rating) => sum + tierToScore(rating.animTier), 0) / total
        const avgScen = anime.ratings.reduce((sum, rating) => sum + tierToScore(rating.scenTier), 0) / total
        const avgMusic = anime.ratings.reduce((sum, rating) => sum + tierToScore(rating.musicTier), 0) / total
        const avgGlobal = anime.ratings.reduce((sum, rating) => sum + rating.globalScore, 0) / total

        await prisma.anime.update({
            where: { id: anime.id },
            data: {
                avgAnimTier: avgAnim,
                avgScenTier: avgScen,
                avgMusicTier: avgMusic,
                avgGlobal,
                totalRatings: total,
            },
        })

        updatedCount++
    }

    return { updatedCount }
}