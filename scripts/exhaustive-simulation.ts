import prisma from "../lib/prisma"
import { registerWithPhoneAction } from "../actions/auth.actions"
import { addAnimeToListAction } from "../actions/list.actions"
import { ListStatus } from "@prisma/client"
import { recalculateAllAnimeScoresAction } from "../actions/admin.actions"

async function runExhaustiveSimulation() {
    console.log("🚀 Starting Exhaustive Backend Simulation...")

    // 1. Cleanup old simulation data if any (optional, but good for reproducibility)
    await prisma.rating.deleteMany({ where: { user: { username: { startsWith: 'sim_' } } } })
    await prisma.userList.deleteMany({ where: { user: { username: { startsWith: 'sim_' } } } })
    await prisma.activity.deleteMany({ where: { user: { username: { startsWith: 'sim_' } } } })
    await prisma.user.deleteMany({ where: { username: { startsWith: 'sim_' } } })

    const users = [
        { username: 'sim_otaku', displayName: 'Sim Otaku', phone: '0000000001', pass: 'simpass' },
        { username: 'sim_weeb', displayName: 'Sim Weeb', phone: '0000000002', pass: 'simpass' },
        { username: 'sim_casual', displayName: 'Sim Casual', phone: '0000000003', pass: 'simpass' }
    ]

    const usersInDb: string[] = []

    console.log("📝 Registering simulated users...")
    for (const u of users) {
        const formData = new FormData()
        formData.append('username', u.username)
        formData.append('displayName', u.displayName)
        formData.append('phoneNumber', u.phone)
        formData.append('password', u.pass)

        const res = await registerWithPhoneAction(formData)
        if (res.success) {
            console.log(`✅ Registered ${u.username}`)
            usersInDb.push(res.data.id)
        } else {
            console.error(`❌ Failed to register ${u.username}:`, res.error)
        }
    }

    const testAnime = {
        malId: 1, // Cowboy Bebop
        title: "Cowboy Bebop",
        genres: "Action, Sci-Fi",
        imageUrl: "https://cdn.myanimelist.net/images/anime/4/19644.jpg"
    }

    console.log("📊 Simulating list additions and ratings...")
    for (const userId of usersInDb) {
        // Add to list
        await addAnimeToListAction(userId, testAnime)

        // Add rating (simulated)
        const score = Math.floor(Math.random() * 3) + 7 // 7, 8, 9
        const tier = score >= 9 ? 'S' : score >= 8 ? 'A' : 'B'

        await prisma.rating.create({
            data: {
                userId,
                animeId: (await prisma.anime.findUnique({ where: { malId: 1 } }))!.id,
                animTier: tier as any,
                scenTier: tier as any,
                musicTier: tier as any,
                globalScore: score,
                globalTier: tier as any
            }
        })
    }

    console.log("🔄 Recalculating all anime scores...")
    const recRes = await recalculateAllAnimeScoresAction()
    console.log("Admin Recalculation Result:", recRes.success ? 'Success' : 'Failed')

    console.log("🧐 Verifying data consistency...")
    const anime = await prisma.anime.findUnique({
        where: { malId: 1 },
        include: { ratings: true }
    })

    if (anime) {
        console.log(`Anime: ${anime.title}`)
        console.log(`Ratings Count: ${anime.ratings.length}`)
        console.log(`Global Average: ${anime.avgGlobal}`)
    }

    console.log("🏁 Simulation Complete.")
}

runExhaustiveSimulation()
    .catch(err => {
        console.error("Simulation failed:", err)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })
