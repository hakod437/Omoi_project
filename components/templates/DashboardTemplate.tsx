import React from 'react'
import Link from 'next/link'
import { Plus, ChevronDown, ChevronUp, Film, Music2, BookText } from 'lucide-react'

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
  activity
}: DashboardTemplateProps) {
  return (
    <div className="min-h-screen bg-[var(--background)]">
      <div className="w-full px-4 py-6 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between mb-8">
          <div className="flex items-center gap-3">
            <span className="inline-flex items-center gap-2 rounded-full border border-[var(--border)] bg-[var(--card)]/40 px-4 py-1.5 text-xs font-bold tracking-widest text-[var(--primary)]">
              {usernameLabel}
            </span>
          </div>

          <div className="flex items-end gap-4">
            <h1 className="font-kawaii text-5xl text-[var(--foreground)] md:text-6xl">
              Mes <span className="text-[var(--primary)]">Notes</span>
            </h1>
          </div>

          <Link
            href={addAnimeHref}
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-[var(--border)] bg-gradient-to-r from-[var(--primary)] to-[var(--accent)] px-6 py-3 font-ui text-sm font-bold text-white shadow-xl transition-transform hover:scale-[1.02]"
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

        <div className="rounded-3xl border border-[var(--border)] bg-[var(--card)]/40 p-6 backdrop-blur-xl">
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
                  className={`inline-flex items-center gap-2 rounded-full border border-[var(--border)] px-4 py-2 text-xs font-bold tracking-widest transition-colors ${
                    filter.label === 'TOUS'
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
                            <div className="mt-2 flex items-center gap-2 text-[var(--foreground)]/60">
                              <span className="inline-flex items-center gap-1 rounded-md border border-[var(--border)] bg-[var(--background)]/30 px-2 py-0.5 text-[10px] font-bold">
                                S
                              </span>
                              <span className="inline-flex items-center gap-1 rounded-md border border-[var(--border)] bg-[var(--background)]/30 px-2 py-0.5 text-[10px] font-bold">
                                S
                              </span>
                              <span className="inline-flex items-center gap-1 rounded-md border border-[var(--border)] bg-[var(--background)]/30 px-2 py-0.5 text-[10px] font-bold">
                                S
                              </span>
                            </div>
                          </div>
                        </Link>
                      ))}

                      {row.remainingLabel ? (
                        <button
                          type="button"
                          className="flex h-40 w-56 flex-col items-center justify-center gap-2 rounded-2xl border border-dashed border-[var(--border)] bg-[var(--card)]/20 text-[var(--foreground)]/60 transition-colors hover:text-[var(--primary)]"
                        >
                          <span className="text-3xl font-bold">+</span>
                          <span className="text-xs font-bold tracking-widest">{row.remainingLabel}</span>
                        </button>
                      ) : null}
                    </div>
                  </div>
                ) : null}
              </div>
            ))}
          </div>
        </div>

        <div className="mt-8 rounded-3xl border border-[var(--border)] bg-[var(--card)]/40 p-6 backdrop-blur-xl">
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
      </div>
    </div>
  )
}
