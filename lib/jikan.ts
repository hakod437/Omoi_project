const JIKAN_BASE_URL = "https://api.jikan.moe/v4"

async function fetchJsonWithTimeout(url: string, init?: RequestInit & { timeoutMs?: number }) {
    const timeoutMs = init?.timeoutMs ?? 8000
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), timeoutMs)

    try {
        const res = await fetch(url, {
            ...init,
            signal: controller.signal,
            headers: {
                ...(init?.headers || {}),
            },
        })
        return res
    } finally {
        clearTimeout(timeoutId)
    }
}

async function fetchJsonWithRetry(url: string, init?: RequestInit & { timeoutMs?: number }, retries = 2) {
    let lastError: unknown = null
    for (let attempt = 0; attempt <= retries; attempt++) {
        try {
            const res = await fetchJsonWithTimeout(url, init)
            return res
        } catch (err) {
            lastError = err
            if (attempt === retries) break
            const delayMs = 250 * Math.pow(2, attempt)
            await new Promise((r) => setTimeout(r, delayMs))
        }
    }
    throw lastError
}

export async function searchAnime(query: string, limit = 20) {
    const params = new URLSearchParams({
        q: query,
        limit: limit.toString(),
        sfw: "true",
    })

    const res = await fetchJsonWithRetry(`${JIKAN_BASE_URL}/anime?${params}`)
    if (!res.ok) throw new Error("Failed to fetch anime from Jikan")

    const data = await res.json()
    return data.data
}

export async function getAnimeById(id: number) {
    const res = await fetchJsonWithRetry(`${JIKAN_BASE_URL}/anime/${id}`)
    if (!res.ok) throw new Error(`Failed to fetch anime ${id} from Jikan`)

    const data = await res.json()
    return data.data
}

export async function getTopAnime() {
    const res = await fetchJsonWithRetry(`${JIKAN_BASE_URL}/top/anime`)
    if (!res.ok) throw new Error("Failed to fetch top anime from Jikan")

    const data = await res.json()
    return data.data
}

export async function getSeasonalAnime() {
    const res = await fetchJsonWithRetry(`${JIKAN_BASE_URL}/seasons/now`)
    if (!res.ok) throw new Error("Failed to fetch seasonal anime from Jikan")

    const data = await res.json()
    return data.data
}
