import prisma from '@/lib/prisma'

const ANILIST_GRAPHQL_ENDPOINT = 'https://graphql.anilist.co'

type AniListGraphQLError = {
  message: string
  status?: number
  validation?: Record<string, string[]>
}

type AniListGraphQLResponse<T> = {
  data: T | null
  errors?: AniListGraphQLError[]
}

type RequestOptions = {
  query: string
  variables?: Record<string, unknown>
  accessToken?: string
  timeoutMs?: number
}

type AniListErrorMeta = {
  httpStatus: number
  graphQlStatus?: number
  retryAfterSeconds?: number
  rateLimitReset?: number
}

export class AniListRequestError extends Error {
  httpStatus: number
  graphQlStatus?: number
  retryAfterSeconds?: number
  rateLimitReset?: number

  constructor(message: string, meta: AniListErrorMeta) {
    super(message)
    this.name = 'AniListRequestError'
    this.httpStatus = meta.httpStatus
    this.graphQlStatus = meta.graphQlStatus
    this.retryAfterSeconds = meta.retryAfterSeconds
    this.rateLimitReset = meta.rateLimitReset
  }
}

const parseNumberHeader = (value: string | null): number | undefined => {
  if (!value) {
    return undefined
  }

  const parsed = Number(value)
  return Number.isFinite(parsed) ? parsed : undefined
}

export async function anilistRequest<T>({
  query,
  variables,
  accessToken,
  timeoutMs = 10_000,
}: RequestOptions): Promise<T> {
  const controller = new AbortController()
  const timeout = setTimeout(() => controller.abort(), timeoutMs)

  try {
    const response = await fetch(ANILIST_GRAPHQL_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
      },
      body: JSON.stringify({
        query,
        variables: variables ?? {},
      }),
      signal: controller.signal,
    })

    const retryAfterSeconds = parseNumberHeader(response.headers.get('Retry-After'))
    const rateLimitReset = parseNumberHeader(response.headers.get('X-RateLimit-Reset'))

    const payload = (await response.json()) as AniListGraphQLResponse<T>
    const firstError = payload.errors?.[0]

    if (!response.ok || firstError || !payload.data) {
      const graphQlStatus = firstError?.status
      const status = graphQlStatus ?? response.status
      const message = firstError?.message || `AniList request failed with status ${status}`

      throw new AniListRequestError(message, {
        httpStatus: response.status,
        graphQlStatus,
        retryAfterSeconds,
        rateLimitReset,
      })
    }

    return payload.data
  } catch (error) {
    if (error instanceof AniListRequestError) {
      throw error
    }

    if (error instanceof Error && error.name === 'AbortError') {
      throw new AniListRequestError('AniList request timeout', { httpStatus: 504 })
    }

    throw new AniListRequestError('AniList request failed', { httpStatus: 500 })
  } finally {
    clearTimeout(timeout)
  }
}

type AniListAccount = {
  access_token: string | null
  expires_at: number | null
}

export async function getAniListTokenState(userId: string): Promise<{
  status: 'ready' | 'auth_required' | 'expired'
  accessToken: string | null
}> {
  const account = await prisma.account.findFirst({
    where: {
      userId,
      provider: 'anilist',
    },
    select: {
      access_token: true,
      expires_at: true,
    },
  })

  return mapAccountToTokenState(account)
}

function mapAccountToTokenState(account: AniListAccount | null): {
  status: 'ready' | 'auth_required' | 'expired'
  accessToken: string | null
} {
  if (!account?.access_token) {
    return { status: 'auth_required', accessToken: null }
  }

  if (account.expires_at) {
    const nowInSeconds = Math.floor(Date.now() / 1000)
    if (account.expires_at <= nowInSeconds) {
      return { status: 'expired', accessToken: null }
    }
  }

  return { status: 'ready', accessToken: account.access_token }
}

export type AniListViewer = {
  id: number
  name: string
  avatar?: {
    large?: string | null
    medium?: string | null
  } | null
}

export async function fetchAniListViewer(accessToken: string): Promise<AniListViewer> {
  const query = `
    query ViewerProfile {
      Viewer {
        id
        name
        avatar {
          large
          medium
        }
      }
    }
  `

  const data = await anilistRequest<{ Viewer: AniListViewer }>({
    query,
    accessToken,
  })

  return data.Viewer
}

export type AniListSearchMedia = {
  id: number
  title: {
    romaji?: string | null
    english?: string | null
    native?: string | null
  }
  coverImage?: {
    large?: string | null
    medium?: string | null
  } | null
  genres?: string[] | null
  averageScore?: number | null
  seasonYear?: number | null
  episodes?: number | null
  format?: string | null
}

export async function fetchAniListAnimeSearch(params: {
  search: string
  page?: number
  perPage?: number
}): Promise<{
  pageInfo: { currentPage: number; hasNextPage: boolean; perPage: number }
  media: AniListSearchMedia[]
}> {
  const query = `
    query SearchAnime($page: Int, $perPage: Int, $search: String) {
      Page(page: $page, perPage: $perPage) {
        pageInfo {
          currentPage
          hasNextPage
          perPage
        }
        media(search: $search, type: ANIME, sort: POPULARITY_DESC) {
          id
          title {
            romaji
            english
            native
          }
          coverImage {
            large
            medium
          }
          genres
          averageScore
          seasonYear
          episodes
          format
        }
      }
    }
  `

  const data = await anilistRequest<{
    Page: {
      pageInfo: { currentPage: number; hasNextPage: boolean; perPage: number }
      media: AniListSearchMedia[]
    }
  }>({
    query,
    variables: {
      page: params.page ?? 1,
      perPage: params.perPage ?? 10,
      search: params.search,
    },
  })

  return {
    pageInfo: data.Page.pageInfo,
    media: data.Page.media,
  }
}

type AniListMediaListEntry = {
  id: number
  status: string
  progress: number
  score: number
  media: {
    id: number
    title: {
      romaji?: string | null
      english?: string | null
      native?: string | null
    }
    coverImage?: {
      large?: string | null
      medium?: string | null
    } | null
    genres?: string[] | null
    seasonYear?: number | null
    episodes?: number | null
    format?: string | null
  }
}

export async function fetchAniListViewerMediaList(accessToken: string): Promise<AniListMediaListEntry[]> {
  const viewer = await fetchAniListViewer(accessToken)

  const query = `
    query ViewerAnimeList($page: Int, $perPage: Int, $userId: Int) {
      Page(page: $page, perPage: $perPage) {
        pageInfo {
          currentPage
          hasNextPage
        }
        mediaList(userId: $userId, type: ANIME, sort: UPDATED_TIME_DESC) {
          id
          status
          progress
          score(format: POINT_100)
          media {
            id
            title {
              romaji
              english
              native
            }
            coverImage {
              large
              medium
            }
            genres
            seasonYear
            episodes
            format
          }
        }
      }
    }
  `

  const result: AniListMediaListEntry[] = []
  let page = 1
  let hasNextPage = true

  while (hasNextPage) {
    const data = await anilistRequest<{
      Page: {
        pageInfo: { currentPage: number; hasNextPage: boolean }
        mediaList: AniListMediaListEntry[]
      }
    }>({
      query,
      accessToken,
      variables: {
        userId: viewer.id,
        page,
        perPage: 50,
      },
    })

    result.push(...data.Page.mediaList)
    hasNextPage = data.Page.pageInfo.hasNextPage
    page += 1
  }

  return result
}
