import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import prisma from '@/lib/prisma'
import { AniListRequestError, fetchAniListViewerMediaList, getAniListTokenState } from '@/lib/anilist'

export async function GET() {
  const session = await auth()

  if (!session?.user?.id) {
    return NextResponse.json({ state: 'auth_required', error: 'Unauthorized' }, { status: 401 })
  }

  const localList = await prisma.userList.findMany({
    where: { userId: session.user.id },
    include: {
      anime: true,
    },
    orderBy: {
      updatedAt: 'desc',
    },
  })

  const tokenState = await getAniListTokenState(session.user.id)

  if (tokenState.status !== 'ready' || !tokenState.accessToken) {
    return NextResponse.json({
      state: 'auth_required',
      source: 'local',
      requiresAniListLogin: true,
      data: {
        list: localList,
      },
    })
  }

  try {
    const entries = await fetchAniListViewerMediaList(tokenState.accessToken)

    return NextResponse.json({
      state: 'success',
      source: 'anilist',
      data: {
        entries,
        localList,
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
            data: {
              list: localList,
            },
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
            data: {
              list: localList,
            },
          },
          { status: 401 }
        )
      }
    }

    return NextResponse.json({
      state: 'partial',
      source: 'local',
      data: {
        list: localList,
      },
    })
  }
}
