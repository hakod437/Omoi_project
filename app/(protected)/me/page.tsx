import React from 'react'
import Link from 'next/link'
import { auth } from '@/lib/auth'
import { redirect } from 'next/navigation'
import prisma from '@/lib/prisma'
import { User2, Library, Star, Clock3, ArrowRight } from 'lucide-react'

export default async function MePage() {
  const session = await auth()

  if (!session?.user?.id) {
    redirect('/login')
  }

  const userId = session.user.id

  const [userListCount, ratingCount, recentActivity] = await Promise.all([
    prisma.userList.count({ where: { userId } }),
    prisma.rating.count({ where: { userId } }),
    prisma.activity.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      take: 5,
    }),
  ])

  return (
    <div className="mx-auto max-w-5xl space-y-8 py-10">
      <header className="rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur-xl">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[var(--primary)]">Viewer Profile</p>
            <h1 className="mt-2 text-4xl font-kawaii text-white">Me</h1>
            <p className="mt-2 text-sm text-white/60">
              Connected as <span className="font-bold text-white">{session.user.name || 'Omoi Member'}</span>
            </p>
          </div>
          <div className="inline-flex items-center gap-2 rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-xs font-bold uppercase tracking-widest text-white/70">
            <User2 size={14} className="text-[var(--primary)]" />
            Session Active
          </div>
        </div>
      </header>

      <section className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <div className="rounded-3xl border border-white/10 bg-white/5 p-5 backdrop-blur-xl">
          <div className="flex items-center gap-2 text-[var(--primary)]"><Library size={16} /><span className="text-xs font-black uppercase tracking-wider">List Entries</span></div>
          <p className="mt-3 text-3xl font-kawaii text-white">{userListCount}</p>
        </div>
        <div className="rounded-3xl border border-white/10 bg-white/5 p-5 backdrop-blur-xl">
          <div className="flex items-center gap-2 text-[var(--primary)]"><Star size={16} /><span className="text-xs font-black uppercase tracking-wider">Ratings</span></div>
          <p className="mt-3 text-3xl font-kawaii text-white">{ratingCount}</p>
        </div>
        <div className="rounded-3xl border border-white/10 bg-white/5 p-5 backdrop-blur-xl">
          <div className="flex items-center gap-2 text-[var(--primary)]"><Clock3 size={16} /><span className="text-xs font-black uppercase tracking-wider">Recent Events</span></div>
          <p className="mt-3 text-3xl font-kawaii text-white">{recentActivity.length}</p>
        </div>
      </section>

      <section className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-2xl font-kawaii text-white">Recent Activity</h2>
          <Link href="/me/list" className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-[0.2em] text-[var(--primary)] hover:underline">
            Open My List <ArrowRight size={14} />
          </Link>
        </div>

        <div className="space-y-3">
          {recentActivity.length === 0 ? (
            <p className="rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-sm text-white/50">No recent activity yet.</p>
          ) : (
            recentActivity.map((activity) => (
              <div key={activity.id} className="rounded-2xl border border-white/10 bg-black/20 px-4 py-3">
                <p className="text-sm text-white/80">{activity.content || activity.type}</p>
                <p className="mt-1 text-xs text-white/40">{new Date(activity.createdAt).toLocaleString()}</p>
              </div>
            ))
          )}
        </div>
      </section>
    </div>
  )
}
