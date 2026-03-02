const JIKAN_BASE_URL = "https://api.jikan.moe/v4"

export async function searchAnime(query: string, limit = 20) {
    const params = new URLSearchParams({
        q: query,
        limit: limit.toString(),
        sfw: "true",
    })

    const res = await fetch(`${JIKAN_BASE_URL}/anime?${params}`)
    if (!res.ok) throw new Error("Failed to fetch anime from Jikan")

    const data = await res.json()
    return data.data
}

export async function getAnimeById(id: number) {
    const res = await fetch(`${JIKAN_BASE_URL}/anime/${id}`)
    if (!res.ok) throw new Error(`Failed to fetch anime ${id} from Jikan`)

    const data = await res.json()
    return data.data
}

export async function getTopAnime() {
    const res = await fetch(`${JIKAN_BASE_URL}/top/anime`)
    if (!res.ok) throw new Error("Failed to fetch top anime from Jikan")

    const data = await res.json()
    return data.data
}
