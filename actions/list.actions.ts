'use server'

import prisma from "@/lib/prisma"
import { ListStatus, ActivityType } from "@prisma/client"
import { revalidatePath } from "next/cache"

export async function addAnimeToListAction(userId: string, animeData: {
    malId: number
    title: string
    titleEnglish?: string
    imageUrl?: string
    status?: string
    genres: string
}) {
    try {
        // 1. Ensure anime exists in our DB
        const anime = await prisma.anime.upsert({
            where: { malId: animeData.malId },
            update: {},
            create: {
                ...animeData,
            }
        })

        // 2. Add to user list
        const userList = await prisma.userList.upsert({
            where: {
                userId_animeId: {
                    userId,
                    animeId: anime.id
                }
            },
            update: {
                status: ListStatus.PLANNING // Default status
            },
            create: {
                userId,
                animeId: anime.id,
                status: ListStatus.PLANNING
            }
        })

        // 3. Create activity
        await prisma.activity.create({
            data: {
                userId,
                type: ActivityType.LIST_UPDATE,
                animeId: anime.id,
                content: `Added ${anime.title} to planning list`
            }
        })

        revalidatePath('/')
        return { success: true, data: userList }
    } catch (error) {
        console.error("Add to list error:", error)
        return { success: false, error: "Failed to add anime to list" }
    }
}

export async function updateListStatusAction(userId: string, animeId: string, status: ListStatus) {
    try {
        const updated = await prisma.userList.update({
            where: {
                userId_animeId: {
                    userId,
                    animeId
                }
            },
            data: { status }
        })

        await prisma.activity.create({
            data: {
                userId,
                type: ActivityType.STATUS_CHANGE,
                animeId,
                content: `Changed status to ${status.toLowerCase().replace('_', ' ')}`
            }
        })

        revalidatePath('/')
        return { success: true, data: updated }
    } catch (error) {
        console.error("Update status error:", error)
        return { success: false, error: "Failed to update status" }
    }
}
