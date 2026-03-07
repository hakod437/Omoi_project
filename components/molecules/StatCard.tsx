import React from 'react'

export function StatCard({ icon, value }: { icon: React.ReactNode; value: string }) {
  return (
    <div className="rounded-2xl border border-[var(--border)] bg-[var(--card)]/40 p-4 backdrop-blur-xl transition-colors hover:bg-[var(--card)]/60">
      <div className="flex flex-col items-center gap-3">
        <div className="text-[var(--primary)]">{icon}</div>
        <span className="font-ui text-xs font-bold tracking-widest text-[var(--foreground)]/80 text-center">{value}</span>
      </div>
    </div>
  )
}
