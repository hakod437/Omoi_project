'use client'

import React from 'react'
import { BookOpen } from 'lucide-react'

interface SynopsisCardProps {
  synopsis: string
}

export const SynopsisCard = ({ synopsis }: SynopsisCardProps) => {
  return (
    <div className="rounded-2xl border p-6 space-y-4" style={{
      backgroundColor: 'var(--card)',
      borderColor: 'var(--primary)'
    }}>
      <div className="flex items-center gap-3">
        <BookOpen style={{ color: 'var(--primary)' }} size={24} />
        <h2 className="text-2xl font-kawaii" style={{ color: 'var(--primary)' }}>SYNOPSIS</h2>
      </div>
      <p className="text-lg leading-relaxed font-body" style={{ color: 'var(--foreground)', opacity: 0.9 }}>
        {synopsis}
      </p>
    </div>
  )
}
