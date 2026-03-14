import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import prisma from '@/lib/prisma'
import { AniListRequestError, fetchAniListViewer, getAniListTokenState } from '@/lib/anilist'

export async function GET() {
  const session = await auth()

  if (!session?.user?.id) {
    return NextResponse.json({ state: 'auth_required', error: 'Unauthorized' }, { status: 401 })
  }

  const localUser = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: {
      id: true,
      username: true,
      displayName: true,
      email: true,
      createdAt: true,
    },
  })

  const tokenState = await getAniListTokenState(session.user.id)

  if (tokenState.status !== 'ready' || !tokenState.accessToken) {
    return NextResponse.json({
      state: 'auth_required',
      source: 'local',
      requiresAniListLogin: true,
      data: {
        localUser,
      },
    })
  }

  try {
    const viewer = await fetchAniListViewer(tokenState.accessToken)

    return NextResponse.json({
      state: 'success',
      source: 'anilist',
      data: {
        localUser,
        viewer,
      },
    })
  } catch (error) {
    if (error instanceof AniListRequestError) {
      if (error.httpStatus === 429 || error.graphQlStatus === 429) {
        return NextResponse.json(
          {
            state: 'rate_limited',
            source: 'local',
            retryAfter: error.retryAfterSeconds,
            rateLimitReset: error.rateLimitReset,
            data: { localUser },
          },
          { status: 429 }
        )
      }

      if (error.httpStatus === 401 || error.httpStatus === 403) {
        return NextResponse.json(
          {
            state: 'auth_required',
            source: 'local',
            requiresAniListLogin: true,
            data: { localUser },
          },
          { status: 401 }
        )
      }
    }

    return NextResponse.json(
      {
        state: 'partial',
        source: 'local',
        data: { localUser },
      },
      { status: 200 }
    )
  }
}
