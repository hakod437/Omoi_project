'use client'

import React from 'react'
import { Info } from 'lucide-react'

export interface AnimeInformationCardProps {
  studio?: string
  diffusion?: string
  genre?: string
  episodes?: string
  statut?: string
  source?: string
}

const InfoItem = ({ label, value }: { label: string; value: string }) => {
  return (
    <div className="space-y-1">
      <div className="text-xs font-bold uppercase tracking-widest font-ui" style={{ color: 'var(--foreground)', opacity: 0.5 }}>
        {label}
      </div>
      <div className="font-ui font-semibold" style={{ color: 'var(--foreground)', opacity: 0.85 }}>
        {value}
      </div>
    </div>
  )
}

export const AnimeInformationCard = ({
  studio,
  diffusion,
  genre,
  episodes,
  statut,
  source
}: AnimeInformationCardProps) => {
  return (
    <div
      className="rounded-2xl border p-6 space-y-4"
      style={{
        backgroundColor: 'var(--card)',
        borderColor: 'var(--primary)'
      }}
    >
      <div className="flex items-center gap-3">
        <Info style={{ color: 'var(--primary)' }} size={20} />
        <h3 className="text-xl font-kawaii" style={{ color: 'var(--primary)' }}>
          INFORMATIONS
        </h3>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        {studio ? <InfoItem label="Studio" value={studio} /> : null}
        {episodes ? <InfoItem label="Épisodes" value={episodes} /> : null}
        {diffusion ? <InfoItem label="Diffusion" value={diffusion} /> : null}
        {statut ? <InfoItem label="Statut" value={statut} /> : null}
        {genre ? <InfoItem label="Genre" value={genre} /> : null}
        {source ? <InfoItem label="Source" value={source} /> : null}
      </div>
    </div>
  )
}
