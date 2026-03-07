'use client'

import React, { useMemo } from 'react'
import Link from 'next/link'

type NavItem = {
  label: string
  href: string
}

export function DevQuickNav() {
  const enabled = useMemo(() => {
    return process.env.NODE_ENV !== 'production' || process.env.NEXT_PUBLIC_DEV_QUICK_NAV === '1'
  }, [])

  const items: NavItem[] = [
    { label: 'Home', href: '/' },
    { label: 'Compare', href: '/compare' },
    { label: 'Dashboard', href: '/dashboard' },
    { label: 'Login', href: '/login' },
    { label: 'Register', href: '/register' },
    { label: 'Anime #1', href: '/anime/1' },
  ]

  if (!enabled) return null

  return (
    <div className="relative z-20 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <div className="mt-3 rounded-2xl border border-[var(--border)] bg-[var(--card)]/40 backdrop-blur-xl p-3">
        <div className="flex flex-wrap gap-2">
          {items.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="rounded-full border border-[var(--border)] bg-[var(--background)]/30 px-4 py-2 text-xs font-bold tracking-widest text-[var(--foreground)]/70 hover:text-[var(--primary)] hover:bg-[var(--muted)] transition-colors"
            >
              {item.label}
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
