import type { Tier } from "@/types/anime"

export const TIER_VALUES: Record<Tier, number> = {
    S: 10,
    A: 8,
    B: 6,
    C: 4,
    D: 2,
}

export const WEIGHTS = {
    anim: 0.5,
    scen: 0.3,
    music: 0.2,
}

export function calculateGlobalScore(animTier: Tier, scenTier: Tier, musicTier: Tier): number {
    const animScore = TIER_VALUES[animTier]
    const scenScore = TIER_VALUES[scenTier]
    const musicScore = TIER_VALUES[musicTier]

    const globalScore =
        (animScore * WEIGHTS.anim) +
        (scenScore * WEIGHTS.scen) +
        (musicScore * WEIGHTS.music)

    return Math.round(globalScore * 10) / 10
}

export function getTierFromScore(score: number): Tier {
    if (score >= 9) return "S"
    if (score >= 7) return "A"
    if (score >= 5) return "B"
    if (score >= 3) return "C"
    return "D"
}

export function calculateCompatibility(userATiers: Tier[], userBTiers: Tier[]): number {
    if (userATiers.length === 0 || userBTiers.length === 0) return 0

    let totalDiff = 0
    const minLength = Math.min(userATiers.length, userBTiers.length)

    for (let i = 0; i < minLength; i++) {
        const scoreA = TIER_VALUES[userATiers[i]]
        const scoreB = TIER_VALUES[userBTiers[i]]
        totalDiff += Math.abs(scoreA - scoreB)
    }

    const avgDiff = totalDiff / minLength
    // Max diff is 8 (S=10 vs D=2). 
    // Compatibility: 100 - (avgDiff / 8 * 100)
    const compatibility = 100 - (avgDiff / 8 * 100)
    return Math.round(Math.max(0, compatibility))
}
