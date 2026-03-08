import "dotenv/config"
import { recalculateAllAnimeScoresAction } from "../actions/admin.actions"
import prisma from "../lib/prisma"
import { Tier } from "@prisma/client"

async function testRecalculation() {
    console.log("📊 Starting Score Recalculation Testing...")

    const testAnimeId = "test-anime-id"
    const testUserId1 = "user-1"
    const testUserId2 = "user-2"

    try {
        // 0. Cleanup & Setup
        await prisma.rating.deleteMany({ where: { animeId: testAnimeId } })
        await prisma.activity.deleteMany({ where: { animeId: testAnimeId } })
        await prisma.anime.deleteMany({ where: { id: testAnimeId } })

        await prisma.user.upsert({ where: { id: testUserId1 }, update: {}, create: { id: testUserId1, email: "u1@test.com", username: "u1" } })
        await prisma.user.upsert({ where: { id: testUserId2 }, update: {}, create: { id: testUserId2, email: "u2@test.com", username: "u2" } })

        await prisma.anime.create({
            data: {
                id: testAnimeId,
                malId: 999999,
                title: "Test Anime",
                imageUrl: "https://test.com/img.jpg",
                genres: "Action"
            }
        })
        console.log("✅ Test Setup: Done")

        // 1. Add Multiple Ratings
        // User 1: S, A, B (Global 9)
        // User 2: A, B, C (Global 7)
        // Average should be: Anim (S+A)/2 = (10+8)/2 = 9, Scen (A+B)/2 = (8+6)/2 = 7, Music (B+C)/2 = (6+4)/2 = 5, Global (9+7)/2 = 8

        await prisma.rating.createMany({
            data: [
                {
                    userId: testUserId1,
                    animeId: testAnimeId,
                    animTier: 'S',
                    scenTier: 'A',
                    musicTier: 'B',
                    globalScore: 9,
                    globalTier: 'A' // Simplified for test
                },
                {
                    userId: testUserId2,
                    animeId: testAnimeId,
                    animTier: 'A',
                    scenTier: 'B',
                    musicTier: 'C',
                    globalScore: 7,
                    globalTier: 'B' // Simplified for test
                }
            ]
        })
        console.log("✅ Ratings Added")

        // 2. Run Recalculation
        const res = await recalculateAllAnimeScoresAction()
        if (res.success) {
            const updatedAnime = await prisma.anime.findUnique({ where: { id: testAnimeId } })
            console.log("✅ Recalculation Action: Success")
            console.log("Updated Stats:", {
                avgAnim: updatedAnime?.avgAnimTier,
                avgScen: updatedAnime?.avgScenTier,
                avgMusic: updatedAnime?.avgMusicTier,
                avgGlobal: updatedAnime?.avgGlobal,
                total: updatedAnime?.totalRatings
            })

            if (updatedAnime?.avgGlobal === 8 && updatedAnime?.totalRatings === 2) {
                console.log("✅ Math Verification: Success")
            } else {
                console.error("❌ Math Verification: Failed")
            }
        } else {
            console.error("❌ Recalculation Action: Failed", res.error)
        }

        console.log("\n✨ Recalculation Testing Complete!")
    } catch (error) {
        console.error("❌ Recalculation Testing Error:", error)
    } finally {
        await prisma.$disconnect()
    }
}

testRecalculation()
