'use client'

import React, { useEffect, useState } from 'react'

import Link from 'next/link'
import { TrendingUp } from 'lucide-react'
import { LandingHero } from '@/components/organisms/LandingHero'
import { LandingSearchSection } from '@/components/organisms/LandingSearchSection'
import { LandingComparisonSection } from '@/components/organisms/LandingComparisonSection'
import { LandingAnimationScoreSection } from '@/components/organisms/LandingAnimationScoreSection'
import { LandingFooter } from '@/components/organisms/LandingFooter'
import { ActivityFeed } from '@/components/organisms/ActivityFeed'

export const HomeTemplate = ({ user }: { user?: any }) => {
  const [activeFilter, setActiveFilter] = useState<string>('Tous')

  useEffect(() => {
    const reveals = Array.from(document.querySelectorAll<HTMLElement>('.reveal'))

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry, i) => {
          if (entry.isIntersecting) {
            window.setTimeout(() => entry.target.classList.add('visible'), i * 80)
            observer.unobserve(entry.target)
          }
        })
      },
      { threshold: 0.1 }
    )

    reveals.forEach((el) => observer.observe(el))

    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    const cursor = document.getElementById('cursor-dot')
    if (!cursor) return

    const onMove = (e: MouseEvent) => {
      cursor.style.left = `${e.clientX - 4}px`
      cursor.style.top = `${e.clientY - 4}px`
    }

    const onEnter = () => {
      cursor.style.opacity = '1'
    }

    const onLeave = () => {
      cursor.style.opacity = '0'
    }

    document.addEventListener('mousemove', onMove)
    document.addEventListener('mouseenter', onEnter)
    document.addEventListener('mouseleave', onLeave)

    return () => {
      document.removeEventListener('mousemove', onMove)
      document.removeEventListener('mouseenter', onEnter)
      document.removeEventListener('mouseleave', onLeave)
    }
  }, [])

  const onCardMouseMove = (e: React.MouseEvent<HTMLElement>) => {
    const card = e.currentTarget
    const rect = card.getBoundingClientRect()
    const x = ((e.clientX - rect.left) / rect.width - 0.5) * 8
    const y = ((e.clientY - rect.top) / rect.height - 0.5) * -8
    card.style.transform = `translateY(-5px) rotateX(${y}deg) rotateY(${x}deg)`
  }

  const onCardMouseLeave = (e: React.MouseEvent<HTMLElement>) => {
    e.currentTarget.style.transform = ''
  }

  return (
    <div className="wrapper">
      <div className="cursor-dot" id="cursor-dot" />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-3 gap-12 py-12">
        <div className="lg:col-span-2">
          {user ? (
            <div className="space-y-8 animate-in fade-in slide-in-from-left duration-700">
              <header className="space-y-2">
                <h1 className="text-4xl md:text-6xl font-kawaii text-[var(--foreground)] tracking-tighter">
                  Okaeri, <span className="text-primary italic">{user.name}</span>! 🌸
                </h1>
                <p className="text-muted-foreground text-lg font-medium">
                  Your vault is waiting. Check out what your friends are watching right now.
                </p>
              </header>
              <div className="p-8 rounded-3xl bg-card/40 border border-border backdrop-blur-xl shadow-2xl relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                  <TrendingUp size={120} />
                </div>
                <h2 className="text-xl font-bold mb-4">Quick Stats</h2>
                <div className="grid grid-cols-3 gap-4">
                  <div className="p-4 rounded-2xl bg-background/50 border border-border">
                    <div className="text-2xl font-black text-primary">12</div>
                    <div className="text-[10px] uppercase font-bold opacity-50">Watching</div>
                  </div>
                  <div className="p-4 rounded-2xl bg-background/50 border border-border">
                    <div className="text-2xl font-black text-primary">45</div>
                    <div className="text-[10px] uppercase font-bold opacity-50">Completed</div>
                  </div>
                  <div className="p-4 rounded-2xl bg-background/50 border border-border">
                    <div className="text-2xl font-black text-primary">9.2</div>
                    <div className="text-[10px] uppercase font-bold opacity-50">Avg Score</div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <LandingHero onCardMouseMove={onCardMouseMove} onCardMouseLeave={onCardMouseLeave} />
          )}
        </div>
        <div className="reveal">
          <ActivityFeed title={user ? "Friend Activity" : "Live Activities"} />
        </div>
      </div>

      {!user && (
        <>
          <LandingSearchSection
            activeFilter={activeFilter}
            onFilterChange={setActiveFilter}
            onCardMouseMove={onCardMouseMove}
            onCardMouseLeave={onCardMouseLeave}
          />
          <LandingComparisonSection />
          <LandingAnimationScoreSection />
        </>
      )}

      {user && (
        <section className="py-24 bg-card/20 border-y border-border">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between mb-12">
              <h2 className="text-4xl font-kawaii">Personal Recommendations</h2>
              <Link href="/explorer" className="text-primary font-bold hover:underline">View All →</Link>
            </div>
            {/* We could fetch real recommendations here */}
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6 opacity-50">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="aspect-[2/3] rounded-2xl bg-muted animate-pulse" />
              ))}
            </div>
          </div>
        </section>
      )}

      <LandingFooter />
    </div>
  )
}
