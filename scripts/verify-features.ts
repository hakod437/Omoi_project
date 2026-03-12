import "dotenv/config"
import { getTopAnime, getSeasonalAnime } from "../lib/jikan"
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

        // 2. Verify Dashboard data plumbing
        console.log("\n--- Dashboard Actions ---")
        const userId = "verify-user-id"

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

        const [listCount, ratingCount, activityCount] = await Promise.all([
            prisma.userList.count({ where: { userId } }),
            prisma.rating.count({ where: { userId } }),
            prisma.activity.count({ where: { userId } })
        ])

        console.log("✅ User-scoped queries: Success")
        console.log("Stats Data:", JSON.stringify({ listCount, ratingCount, activityCount }, null, 2))

        console.log("\n✨ Verification Complete!")
    } catch (err) {
        console.error("❌ Verification Error:", err)
    } finally {
        await prisma.$disconnect()
    }
}

runVerification()
