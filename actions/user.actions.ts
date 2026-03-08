"use server"

import prisma from "@/lib/prisma"
import { ServiceResponse } from "@/types/service"

export async function getUserStatsAction(userId: string): Promise<ServiceResponse<any>> {
    try {
        const [userList, ratings, activities] = await Promise.all([
            prisma.userList.findMany({
                where: { userId },
                include: {
                    anime: {
                        include: {
                            ratings: {
                                where: { userId }
                            }
                        }
                    }
                }
            }),
            prisma.rating.findMany({
                where: { userId }
            }),
            prisma.activity.findMany({
                where: { userId },
                orderBy: { createdAt: 'desc' },
                take: 5
            })
        ])

        const totalAnimes = userList.length

        // Tier Rows Construction
        const tiers: any = {
            S: { title: 'Tier S — Légendaire 🏆', subtitle: 'Les chefs-d’œuvre absolus', animes: [] },
            A: { title: 'Tier A — Excellent 🔥', subtitle: 'Des animes qui déchirent vraiment', animes: [] },
            B: { title: 'Tier B — Bien 👍', subtitle: 'Bons animes, pas mémorables', animes: [] },
            C: { title: 'Tier C — Moyen 😐', subtitle: 'Décevants ou sans intérêt', animes: [] },
            D: { title: 'Tier D — Nul 💀', subtitle: 'À éviter absolument', animes: [] },
        }

        userList.forEach(item => {
            const rating = item.anime.ratings[0]
            if (rating) {
                const tier = rating.globalTier
                if (tiers[tier]) {
                    tiers[tier].animes.push({
                        id: item.anime.id,
                        title: item.anime.title,
                        imageUrl: item.anime.imageUrl,
                        dots: [rating.animTier, rating.scenTier, rating.musicTier]
                    })
                }
            }
        })

        const tierRows = Object.keys(tiers).map(key => ({
            tier: key,
            ...tiers[key],
            count: tiers[key].animes.length,
            expanded: tiers[key].animes.length > 0
        }))

        // Stats calculation
        const tierCounts = ratings.reduce((acc: any, curr) => {
            acc[curr.globalTier] = (acc[curr.globalTier] || 0) + 1
            return acc
        }, {} as Record<string, number>)

        const totalRatings = ratings.length
        let avgAnimation = 0, avgScenario = 0, avgMusic = 0

        if (totalRatings > 0) {
            const tierToScore = (t: string) => t === 'S' ? 10 : t === 'A' ? 8 : t === 'B' ? 6 : t === 'C' ? 4 : 2
            avgAnimation = ratings.reduce((sum, r) => sum + tierToScore(r.animTier), 0) / totalRatings
            avgScenario = ratings.reduce((sum, r) => sum + tierToScore(r.scenTier), 0) / totalRatings
            avgMusic = ratings.reduce((sum, r) => sum + tierToScore(r.musicTier), 0) / totalRatings
        }

        return {
            success: true,
            data: {
                totalAnimes,
                tierSCount: tierCounts['S'] || 0,
                avgAnimation: parseFloat(avgAnimation.toFixed(1)),
                avgScenario: parseFloat(avgScenario.toFixed(1)),
                avgMusic: parseFloat(avgMusic.toFixed(1)),
                tierRows,
                activities
            }
        }
    } catch (error) {
        console.error("Failed to fetch user stats:", error)
        return { success: false, error: "Failed to fetch user stats" }
    }
}
