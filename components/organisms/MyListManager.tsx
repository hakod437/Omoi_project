'use client'

import React, { useMemo, useState, useTransition } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { ListChecks, Loader2, Search, CheckCircle2, Clock3 } from 'lucide-react'
import { updateListStatusAction } from '@/actions/list.actions'
import { ListStatus } from '@prisma/client'

type ListItem = {
  id: string
  animeId: string
  status: ListStatus
  progress: number
  anime: {
    id: string
    title: string
    imageUrl: string | null
    year: number | null
    genres: string
  }
  rating?: {
    globalTier: string
  } | null
}

const STATUS_ORDER: ListStatus[] = ['WATCHING', 'PLANNING', 'COMPLETED', 'ON_HOLD', 'DROPPED']

const STATUS_LABELS: Record<ListStatus, string> = {
  WATCHING: 'Watching',
  COMPLETED: 'Completed',
  ON_HOLD: 'On Hold',
  DROPPED: 'Dropped',
  PLANNING: 'Planning',
}

export function MyListManager({ items }: { items: ListItem[] }) {
  const [query, setQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState<'ALL' | ListStatus>('ALL')
  const [activeAnimeId, setActiveAnimeId] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()

  const filtered = useMemo(() => {
    const normalized = query.trim().toLowerCase()

    return items
      .filter((item) => {
        if (statusFilter !== 'ALL' && item.status !== statusFilter) {
          return false
        }

        if (!normalized) {
          return true
        }

        return item.anime.title.toLowerCase().includes(normalized)
      })
      .sort((a, b) => {
        const statusDelta = STATUS_ORDER.indexOf(a.status) - STATUS_ORDER.indexOf(b.status)
        if (statusDelta !== 0) {
          return statusDelta
        }
        return a.anime.title.localeCompare(b.anime.title)
      })
  }, [items, query, statusFilter])

  const onStatusChange = (animeId: string, status: ListStatus) => {
    setActiveAnimeId(animeId)

    startTransition(async () => {
      await updateListStatusAction(animeId, status)
      setActiveAnimeId(null)
    })
  }

  return (
    <section className="space-y-6">
      <div className="rounded-3xl border border-white/10 bg-white/5 p-5 backdrop-blur-xl">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div className="relative flex-1 max-w-xl">
            <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-white/40" />
            <input
              className="h-11 w-full rounded-2xl border border-white/10 bg-black/20 pl-10 pr-4 text-sm text-white outline-none transition-colors focus:border-[var(--primary)]/50"
              placeholder="Search in your vault"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => setStatusFilter('ALL')}
              className={`rounded-full px-3 py-1.5 text-[11px] font-black uppercase tracking-widest transition ${statusFilter === 'ALL' ? 'bg-[var(--primary)]/20 text-[var(--primary)]' : 'bg-white/5 text-white/50 hover:text-white'}`}
            >
              All
            </button>
            {STATUS_ORDER.map((status) => (
              <button
                key={status}
                onClick={() => setStatusFilter(status)}
                className={`rounded-full px-3 py-1.5 text-[11px] font-black uppercase tracking-widest transition ${statusFilter === status ? 'bg-[var(--primary)]/20 text-[var(--primary)]' : 'bg-white/5 text-white/50 hover:text-white'}`}
              >
                {STATUS_LABELS[status]}
              </button>
            ))}
          </div>
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="rounded-3xl border border-white/10 bg-white/5 p-12 text-center backdrop-blur-xl">
          <ListChecks className="mx-auto mb-4 size-10 text-white/30" />
          <p className="text-sm font-bold uppercase tracking-widest text-white/40">No anime found for this filter</p>
          <Link href="/explorer" className="mt-4 inline-block text-sm font-bold text-[var(--primary)] hover:underline">
            Explore catalog
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {filtered.map((item) => {
            const isUpdating = isPending && activeAnimeId === item.animeId

            return (
              <article
                key={item.id}
                className="group flex flex-col gap-4 rounded-3xl border border-white/10 bg-white/5 p-4 backdrop-blur-xl transition hover:border-[var(--primary)]/30"
              >
                <div className="flex items-start gap-4">
                  <div className="relative h-20 w-14 shrink-0 overflow-hidden rounded-xl border border-white/10 bg-black/20">
                    {item.anime.imageUrl ? (
                      <Image src={item.anime.imageUrl} alt={item.anime.title} fill className="object-cover" />
                    ) : null}
                  </div>

                  <div className="min-w-0 flex-1">
                    <Link href={`/anime/${item.anime.id}`} className="line-clamp-1 text-lg font-black text-white group-hover:text-[var(--primary)]">
                      {item.anime.title}
                    </Link>
                    <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-white/50">
                      <span>{item.anime.year ?? 'Unknown year'}</span>
                      <span>•</span>
                      <span className="line-clamp-1">{item.anime.genres || 'No genre'}</span>
                    </div>
                    <div className="mt-3 flex items-center gap-2 text-[11px] font-black uppercase tracking-wider">
                      <span className="rounded-full bg-white/10 px-2.5 py-1 text-white/80">{STATUS_LABELS[item.status]}</span>
                      {item.rating?.globalTier ? (
                        <span className="rounded-full bg-[var(--primary)]/15 px-2.5 py-1 text-[var(--primary)]">Tier {item.rating.globalTier}</span>
                      ) : (
                        <span className="rounded-full bg-white/10 px-2.5 py-1 text-white/60">Not rated</span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                  <div className="flex items-center gap-2 text-xs text-white/50">
                    {item.status === 'COMPLETED' ? <CheckCircle2 size={14} /> : <Clock3 size={14} />}
                    <span>Progress: {item.progress}%</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <select
                      value={item.status}
                      disabled={isUpdating}
                      onChange={(e) => onStatusChange(item.animeId, e.target.value as ListStatus)}
                      className="h-9 rounded-xl border border-white/10 bg-black/30 px-3 text-xs font-bold uppercase tracking-widest text-white outline-none"
                    >
                      {STATUS_ORDER.map((status) => (
                        <option key={status} value={status}>
                          {STATUS_LABELS[status]}
                        </option>
                      ))}
                    </select>

                    {isUpdating ? <Loader2 className="size-4 animate-spin text-[var(--primary)]" /> : null}
                  </div>
                </div>
              </article>
            )
          })}
        </div>
      )}
    </section>
  )
}
