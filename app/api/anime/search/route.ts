import { NextRequest, NextResponse } from 'next/server'
import { AniListRequestError, fetchAniListAnimeSearch } from '@/lib/anilist'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const q = (searchParams.get('q') || '').trim()
  const page = Number(searchParams.get('page') || '1')
  const perPage = Number(searchParams.get('perPage') || '12')

  if (q.length < 2) {
    return NextResponse.json(
      {
        state: 'error',
        error: 'Query must contain at least 2 characters.',
      },
      { status: 400 }
    )
  }

  try {
    const data = await fetchAniListAnimeSearch({
      search: q,
      page: Number.isFinite(page) ? page : 1,
      perPage: Number.isFinite(perPage) ? Math.min(Math.max(perPage, 1), 50) : 12,
    })

    return NextResponse.json({
      state: 'success',
      source: 'anilist',
      data,
    })
  } catch (error) {
    if (error instanceof AniListRequestError) {
      if (error.httpStatus === 429 || error.graphQlStatus === 429) {
        return NextResponse.json(
          {
            state: 'rate_limited',
            error: 'AniList rate limit reached. Retry later.',
            retryAfter: error.retryAfterSeconds,
            rateLimitReset: error.rateLimitReset,
          },
          { status: 429 }
        )
      }

      return NextResponse.json(
        {
          state: 'error',
          error: error.message,
        },
        { status: error.httpStatus >= 400 ? error.httpStatus : 500 }
      )
    }

    return NextResponse.json(
      {
        state: 'error',
        error: 'Unexpected backend error while searching AniList.',
      },
      { status: 500 }
    )
  }
}
