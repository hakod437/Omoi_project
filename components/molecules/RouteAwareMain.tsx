'use client'

import React from 'react'
import { usePathname } from 'next/navigation'

export function RouteAwareMain({ children }: { children: React.ReactNode }) {
  const pathname = usePathname() || '/'

  const isFullBleed = pathname === '/' || pathname === '/dashboard' || pathname.startsWith('/anime/')

  return (
    <main
      className={
        isFullBleed
          ? 'relative z-10'
          : 'relative z-10 mx-auto max-w-7xl pt-8 px-4 sm:px-6 lg:px-8'
      }
    >
      {children}
    </main>
  )
}
