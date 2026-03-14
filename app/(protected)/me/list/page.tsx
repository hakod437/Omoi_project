import React from 'react'
import { auth } from '@/lib/auth'
import { redirect } from 'next/navigation'
import prisma from '@/lib/prisma'
import { MyListManager } from '@/components/organisms/MyListManager'
import { Layers3 } from 'lucide-react'

export default async function MyListPage() {
  const session = await auth()

  if (!session?.user?.id) {
    redirect('/login')
  }

  const [items, ratings] = await Promise.all([
    prisma.userList.findMany({
      where: { userId: session.user.id },
      include: { anime: true },
      orderBy: { updatedAt: 'desc' },
    }),
    prisma.rating.findMany({
      where: { userId: session.user.id },
      select: { animeId: true, globalTier: true },
    }),
  ])

  const ratingsMap = new Map(ratings.map((rating) => [rating.animeId, rating]))

  const enrichedItems = items.map((item) => ({
    ...item,
    rating: ratingsMap.get(item.animeId) || null,
  }))

  return (
    <div className="mx-auto max-w-6xl space-y-8 py-10">
      <header className="rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur-xl">
        <div className="flex items-center gap-3 text-[var(--primary)]">
          <Layers3 size={20} />
          <p className="text-[10px] font-black uppercase tracking-[0.2em]">Flow E - Mutation User List</p>
        </div>
        <h1 className="mt-3 text-4xl font-kawaii text-white">My List</h1>
        <p className="mt-2 text-sm text-white/60">
          Manage statuses, keep your vault fresh, and update your anime journey in real time.
        </p>
      </header>

      <MyListManager items={enrichedItems} />
    </div>
  )
}
