import "dotenv/config"
import { getTopAnime, getSeasonalAnime } from "../lib/jikan"
import { getUserStatsAction } from "../actions/user.actions"
import prisma from "../lib/prisma"

async function runVerification() {
    console.log("🚀 Starting Feature Verification...")
    console.log("DB URL:", process.env.DATABASE_URL ? "Exists (hidden for safety)" : "MISSING")

    try {
        // 1. Verify Jikan
        console.log("\n--- Jikan API ---")
        const top = await getTopAnime()
        console.log(`✅ Top Anime: ${top.length} items found. First: ${top[0]?.title}`)

        const seasonal = await getSeasonalAnime()
        console.log(`✅ Seasonal Anime: ${seasonal.length} items found. First: ${seasonal[0]?.title}`)

        // 2. Verify Dashboard Logic
        console.log("\n--- Dashboard Actions ---")
        const userId = "temp-user-id"

        // Ensure user exists
        await prisma.user.upsert({
            where: { id: userId },
            update: {},
            create: {
                id: userId,
                email: "test@example.com",
                username: "testuser",
                displayName: "Test User"
            }
        })

        const stats = await getUserStatsAction(userId)
        if (stats.success) {
            console.log("✅ getUserStatsAction: Success")
            console.log("Stats Data:", JSON.stringify(stats.data, null, 2))
        } else {
            console.error("❌ getUserStatsAction: Failed", stats.error)
        }

        console.log("\n✨ Verification Complete!")
    } catch (err) {
        console.error("❌ Verification Error:", err)
    } finally {
        await prisma.$disconnect()
    }
}

runVerification()
