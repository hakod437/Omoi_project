"use server"

import { requireAdminUser } from "@/lib/require-admin"
import { recalculateAllAnimeScores } from "@/lib/recalculate-anime-scores"
import { ServiceResponse } from "@/types/service"

export async function recalculateAllAnimeScoresAction(): Promise<ServiceResponse<any>> {
    try {
        await requireAdminUser()
        const data = await recalculateAllAnimeScores()

        return { success: true, data }
    } catch (error) {
        console.error("Failed to recalculate scores:", error)
        return {
            success: false,
            error: error instanceof Error && (error.message === "Unauthorized" || error.message === "Forbidden")
                ? error.message
                : "Failed to recalculate scores"
        }
    }
}
