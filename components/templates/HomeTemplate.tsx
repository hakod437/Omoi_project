'use client'

import React, { useEffect, useState } from 'react'

import { LandingHero } from '@/components/organisms/LandingHero'
import { LandingSearchSection } from '@/components/organisms/LandingSearchSection'
import { LandingComparisonSection } from '@/components/organisms/LandingComparisonSection'
import { LandingAnimationScoreSection } from '@/components/organisms/LandingAnimationScoreSection'
import { LandingFooter } from '@/components/organisms/LandingFooter'

export const HomeTemplate = () => {
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

      <LandingHero onCardMouseMove={onCardMouseMove} onCardMouseLeave={onCardMouseLeave} />

      <LandingSearchSection
        activeFilter={activeFilter}
        onFilterChange={setActiveFilter}
        onCardMouseMove={onCardMouseMove}
        onCardMouseLeave={onCardMouseLeave}
      />

      <LandingComparisonSection />

      <LandingAnimationScoreSection />

      <LandingFooter />
    </div>
  )
}
