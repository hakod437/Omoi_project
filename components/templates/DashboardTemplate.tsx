import React from 'react'
import Link from 'next/link'
import { Plus, ChevronDown, ChevronUp, Film, Music2, BookText } from 'lucide-react'
import { Button } from '@/components/atoms/Base'

import { Panel } from '@/components/molecules/Panel'
import { StatCard } from '@/components/molecules/StatCard'

export interface DashboardTemplateProps {
  usernameLabel: string
  statsSubtitle: string
  addAnimeHref: string
  statsCards: Array<{ icon: React.ReactNode; value: string }>
  criteriaAverages: Array<{ name: string; value: number; color: string }>
  tastes: Array<{ name: string; value: number; color: string }>
  favoriteStudios: Array<{ name: string; count: number; color: string; maxCount: number }>
  tierRows: ReadonlyArray<{
    tier: string
    title: string
    subtitle: string
    count: number
    expanded: boolean
    animes: ReadonlyArray<{ id: string; title: string; gradient: string; dots: ReadonlyArray<string> }>
    remainingLabel: string
  }>
  activity: Array<{
    id: string
    icon: React.ReactNode
    text: React.ReactNode
    right: React.ReactNode
  }>
  lastRatings?: Array<{
    id: string
    animeId: string
    title: string
    globalTier: string
    createdAt: Date
  }>
}

export function DashboardTemplate({
  usernameLabel,
  statsSubtitle,
  addAnimeHref,
  statsCards,
  criteriaAverages,
  tastes,
  favoriteStudios,
  tierRows,
  activity,
  lastRatings
}: DashboardTemplateProps) {
  return (
    <div className="min-h-screen bg-[var(--background)]">
      <div className="w-full px-4 py-6 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between mb-8">
          <div className="flex items-center gap-3">
            <span className="inline-flex items-center gap-2 rounded-full border border-[var(--border)] bg-[var(--card)]/40 px-4 py-1.5 text-xs font-bold tracking-widest text-[var(--primary)]">
              Okaeri, {usernameLabel}! 🌸
            </span>
          </div>

          <div className="flex items-end gap-4">
            <h1 className="font-kawaii text-5xl text-[var(--foreground)] md:text-6xl">
              Mes <span className="text-[var(--primary)]">Notes</span>
            </h1>
          </div>

          <Link
            href={addAnimeHref}
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-[var(--btn-outline-border)] bg-[var(--btn-primary-bg)] px-6 py-3 font-ui text-sm font-bold text-[var(--btn-primary-text)] shadow-xl transition-colors hover:bg-[var(--btn-primary-hover)]"
          >
            <Plus size={18} />
            AJOUTER UN ANIME
          </Link>
        </div>

        <div className="mb-8">
          <p className="text-[var(--foreground)]/70 text-sm md:text-base">{statsSubtitle}</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
          {statsCards.map((card, idx) => (
            <StatCard key={idx} icon={card.icon} value={card.value} />
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <Panel title="MOYENNES PAR CRITÈRE">
            <div className="space-y-4">
              {criteriaAverages.map((criteria, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-white/80">{criteria.name}</span>
                    <span className="text-white font-bold">{criteria.value}</span>
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-2">
                    <div
                      className={`bg-gradient-to-r ${criteria.color} h-2 rounded-full transition-all duration-500`}
                      style={{ width: `${(criteria.value / 10) * 100}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </Panel>

          <Panel title="MES GOÛTS">
            <div className="space-y-4">
              {tastes.map((taste, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-white/80">{taste.name}</span>
                    <span className="text-white font-bold">{taste.value}%</span>
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-2">
                    <div
                      className={`bg-gradient-to-r ${taste.color} h-2 rounded-full transition-all duration-500`}
                      style={{ width: `${taste.value}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </Panel>

          <Panel title="STUDIOS FAVORIS">
            <div className="space-y-4">
              {favoriteStudios.map((studio, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-white/80">{studio.name}</span>
                    <span className="text-white font-bold">{studio.count} animes</span>
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-2">
                    <div
                      className={`bg-gradient-to-r ${studio.color} h-2 rounded-full transition-all duration-500`}
                      style={{ width: `${(studio.count / studio.maxCount) * 100}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </Panel>
        </div>

        <div className="rounded-3xl border border-[var(--border)] bg-[var(--card)]/40 p-6 backdrop-blur-xl mb-8">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between mb-6">
            <h2 className="font-kawaii text-4xl text-[var(--foreground)]">
              Mes <span className="text-[var(--primary)]">Tiers</span>
            </h2>
            <div className="flex flex-wrap gap-2">
              {[
                { label: 'TOUS', icon: null },
                { label: 'ANIM.', icon: <Film size={14} /> },
                { label: 'SCÉN.', icon: <BookText size={14} /> },
                { label: 'OST', icon: <Music2 size={14} /> }
              ].map((filter) => (
                <button
                  key={filter.label}
                  className={`inline-flex items-center gap-2 rounded-full border border-[var(--border)] px-4 py-2 text-xs font-bold tracking-widest transition-colors ${filter.label === 'TOUS'
                    ? 'bg-[var(--primary)]/15 text-[var(--primary)]'
                    : 'bg-[var(--card)]/40 text-[var(--foreground)]/70 hover:text-[var(--primary)]'
                    }`}
                >
                  {filter.icon ? <span className="opacity-80">{filter.icon}</span> : null}
                  {filter.label}
                </button>
              ))}
            </div>
          </div>

          {tierRows.every(row => row.count === 0) ? (
            <div className="flex flex-col items-center justify-center py-20 text-center space-y-6">
              <div className="size-24 rounded-full bg-white/5 border border-white/5 flex items-center justify-center text-white/20">
                <Film size={40} />
              </div>
              <div className="space-y-2">
                <h3 className="text-2xl font-kawaii text-white">Votre coffre est vide !</h3>
                <p className="text-white/40 text-sm max-w-xs mx-auto">Commencez par explorer ou rechercher des animes pour créer votre premier tier list.</p>
              </div>
              <Link href="/explorer">
                <Button className="bg-white/10 hover:bg-[var(--primary)] border-none text-[10px] font-black">Explorer le catalogue</Button>
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {tierRows.map((row) => (
                <div
                  key={row.tier}
                  className="rounded-2xl border border-[var(--border)] bg-[var(--background)]/20 px-4 py-4"
                >
                  <div className="flex items-center justify-between gap-6">
                    <div className="flex items-center gap-4">
                      <div className="flex size-12 items-center justify-center rounded-xl border border-[var(--border)] bg-[var(--card)]/60 font-kawaii text-2xl text-[var(--foreground)]">
                        {row.tier}
                      </div>
                      <div>
                        <div className="font-ui text-sm font-bold text-[var(--foreground)]">{row.title}</div>
                        <div className="text-xs text-[var(--foreground)]/55">{row.subtitle}</div>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 text-[var(--foreground)]/60">
                      <span className="min-w-6 text-right font-ui text-sm font-bold">{row.count}</span>
                      {row.expanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                    </div>
                  </div>

                  {row.expanded && row.animes.length > 0 ? (
                    <div className="mt-4 overflow-x-auto">
                      <div className="flex min-w-max gap-4 pr-2">
                        {row.animes.map((a) => (
                          <Link
                            key={a.id}
                            href={`/anime/${a.id}`}
                            className="group relative h-40 w-56 overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--card)]/50"
                          >
                            <div
                              className={`absolute inset-0 bg-gradient-to-br ${a.gradient} opacity-90 transition-transform group-hover:scale-[1.03]`}
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-[var(--background)]/90 via-[var(--background)]/20 to-transparent" />
                            <div className="absolute left-3 top-3 flex gap-1">
                              {a.dots.map((d, idx) => (
                                <span
                                  key={`${a.id}-${d}-${idx}`}
                                  className="inline-flex size-5 items-center justify-center rounded-full border border-[var(--border)] bg-[var(--background)]/40 text-[10px] font-bold text-[var(--foreground)]"
                                >
                                  {d}
                                </span>
                              ))}
                            </div>

                            <div className="absolute bottom-0 left-0 right-0 p-4">
                              <div className="font-ui text-sm font-bold text-[var(--foreground)]">{a.title}</div>
                            </div>
                          </Link>
                        ))}
                      </div>
                    </div>
                  ) : null}
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="mt-8 rounded-3xl border border-[var(--border)] bg-[var(--card)]/40 p-6 backdrop-blur-xl mb-8">
          <h2 className="font-kawaii text-4xl text-[var(--foreground)]">
            Activité <span className="text-[var(--primary)]">récente</span>
          </h2>

          <div className="mt-6 space-y-4">
            {activity.map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between gap-4 rounded-2xl border border-[var(--border)] bg-[var(--background)]/20 px-4 py-4"
              >
                <div className="flex items-center gap-3">
                  <div className="flex size-9 items-center justify-center rounded-xl border border-[var(--border)] bg-[var(--card)]/60">
                    {item.icon}
                  </div>
                  <div className="text-sm text-[var(--foreground)]/80">{item.text}</div>
                </div>
                <div className="shrink-0 text-right">{item.right}</div>
              </div>
            ))}
          </div>
        </div>

        {lastRatings && lastRatings.length > 0 && (
          <div className="mt-8 rounded-3xl border border-[var(--border)] bg-[var(--card)]/40 p-6 backdrop-blur-xl">
            <h2 className="font-kawaii text-4xl text-[var(--foreground)]">
              Dernières <span className="text-[var(--primary)]">notes</span>
            </h2>
            <div className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
              {lastRatings.map((rating) => (
                <Link
                  key={rating.id}
                  href={`/anime/${rating.animeId}`}
                  className="group p-4 rounded-2xl border border-white/5 bg-white/5 hover:border-[var(--primary)]/30 transition-all"
                >
                  <div className="text-[10px] font-black text-white/30 uppercase tracking-widest mb-2">
                    {new Date(rating.createdAt).toLocaleDateString()}
                  </div>
                  <div className="font-bold text-sm text-white mb-2 line-clamp-1 group-hover:text-[var(--primary)]">
                    {rating.title}
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-black text-white/40">TIER</span>
                    <span className="font-kawaii text-2xl font-black text-transparent bg-clip-text" style={{ backgroundImage: `var(--tier-${rating.globalTier.toLowerCase()})` }}>
                      {rating.globalTier}
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
