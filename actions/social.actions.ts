'use server'

import prisma from "@/lib/prisma"

export async function getActivityFeedAction(limit = 20) {
    try {
        const activities = await prisma.activity.findMany({
            take: limit,
            orderBy: { createdAt: 'desc' },
            include: {
                user: {
                    select: {
                        username: true,
                        avatar: true,
                        displayName: true
                    }
                }
            }
        })
        return { success: true, data: activities }
    } catch (error) {
        console.error("Fetch activity error:", error)
        return { success: false, error: "Failed to fetch activities" }
    }
}

export async function searchUsersAction(query: string) {
    try {
        const users = await prisma.user.findMany({
            where: {
                OR: [
                    { username: { contains: query, mode: 'insensitive' } },
                    { displayName: { contains: query, mode: 'insensitive' } }
                ]
            },
            select: {
                id: true,
                username: true,
                displayName: true,
                avatar: true
            },
            take: 10
        })
        return { success: true, data: users }
    } catch (error) {
        console.error("Search users error:", error)
        return { success: false, error: "Failed to search users" }
    }
}

export async function compareUsersAction(userAId: string, userBId: string) {
    try {
        // 1. Get both users' lists
        const [listA, listB] = await Promise.all([
            prisma.userList.findMany({
                where: { userId: userAId },
                include: { anime: true }
            }),
            prisma.userList.findMany({
                where: { userId: userBId },
                include: { anime: true }
            })
        ])

        // 2. Find common anime
        const animeIdsA = new Set(listA.map((l: any) => l.animeId))
        const commonList = listB.filter((l: any) => animeIdsA.has(l.animeId))

        // 3. Simple compatibility calculation
        const [ratingsA, ratingsB] = await Promise.all([
            prisma.rating.findMany({ where: { userId: userAId } }),
            prisma.rating.findMany({ where: { userId: userBId } })
        ])

        const ratingMapA = new Map<string, number>(ratingsA.map((r: any) => [r.animeId, r.globalScore]))
        const ratingMapB = new Map<string, number>(ratingsB.map((r: any) => [r.animeId, r.globalScore]))

        let scoreDiffSum = 0
        let ratedCommonCount = 0

        commonList.forEach((item: any) => {
            const scoreA = ratingMapA.get(item.animeId)
            const scoreB = ratingMapB.get(item.animeId)
            if (typeof scoreA === 'number' && typeof scoreB === 'number') {
                scoreDiffSum += Math.abs(scoreA - scoreB)
                ratedCommonCount++
            }
        })

        // Compatibility scale 0-100 (diff 0 = 100, diff 40+ = 0)
        const avgDiff = ratedCommonCount > 0 ? scoreDiffSum / ratedCommonCount : 20
        const compatibility = Math.max(0, 100 - (avgDiff * 2.5))

        return {
            success: true,
            data: {
                compatibility,
                commonCount: commonList.length,
                commonAnimes: commonList.map((l: any) => l.anime)
            }
        }

    } catch (error) {
        console.error("Comparison error:", error)
        return { success: false, error: "Failed to compare users" }
    }
}
