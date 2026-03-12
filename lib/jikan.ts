const JIKAN_BASE_URL = "https://api.jikan.moe/v4"

// Cache simple en mémoire pour éviter les appels répétés
const cache = new Map<string, { data: any; timestamp: number }>()
const CACHE_DURATION = 5 * 60 * 1000 // 5 minutes

async function fetchJsonWithTimeout(url: string, init?: RequestInit & { timeoutMs?: number }) {
    const timeoutMs = init?.timeoutMs ?? 5000 // Réduit à 5s
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), timeoutMs)

    try {
        const res = await fetch(url, {
            ...init,
            next: { revalidate: 600 },
            signal: controller.signal,
            headers: {
                'User-Agent': 'AnimeVault/1.0',
                ...(init?.headers || {}),
            },
        })
        return res
    } finally {
        clearTimeout(timeoutId)
    }
}

async function fetchJsonWithRetry(url: string, init?: RequestInit & { timeoutMs?: number }, retries = 1) { // Réduit retries
    let lastError: unknown = null
    for (let attempt = 0; attempt <= retries; attempt++) {
        try {
            const res = await fetchJsonWithTimeout(url, init)
            return res
        } catch (err) {
            lastError = err
            if (attempt === retries) break
            const delayMs = 1000 * Math.pow(2, attempt) // Délai plus long
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
    const cacheKey = 'top_anime'
    const cached = cache.get(cacheKey)
    
    if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
        return cached.data
    }

    try {
        const res = await fetchJsonWithRetry(`${JIKAN_BASE_URL}/top/anime`)
        if (!res.ok) throw new Error("Failed to fetch top anime from Jikan")

        const data = await res.json()
        cache.set(cacheKey, { data: data.data, timestamp: Date.now() })
        return data.data
    } catch (error) {
        console.error('[📡 JIKAN] ❌ Erreur getTopAnime:', error)
        // Retourner les données en cache si disponibles, même expirées
        if (cached) {
            return cached.data
        }
        // Fallback vide
        return []
    }
}

export async function getSeasonalAnime() {
    const cacheKey = 'seasonal_anime'
    const cached = cache.get(cacheKey)
    
    if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
        return cached.data
    }

    try {
        const res = await fetchJsonWithRetry(`${JIKAN_BASE_URL}/seasons/now`)
        if (!res.ok) throw new Error("Failed to fetch seasonal anime from Jikan")

        const data = await res.json()
        cache.set(cacheKey, { data: data.data, timestamp: Date.now() })
        return data.data
    } catch (error) {
        console.error('[📡 JIKAN] ❌ Erreur getSeasonalAnime:', error)
        // Retourner les données en cache si disponibles, même expirées
        if (cached) {
            return cached.data
        }
        // Fallback vide
        return []
    }
}
