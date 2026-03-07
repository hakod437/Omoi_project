import React from 'react'

export function Panel({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-3xl border border-[var(--border)] bg-[var(--card)]/40 p-6 backdrop-blur-xl">
      <h3 className="font-ui text-xs font-bold tracking-widest text-[var(--primary)] mb-4">{title}</h3>
      {children}
    </div>
  )
}
