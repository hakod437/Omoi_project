'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { Star } from 'lucide-react'

export const LandingHero = ({
  onCardMouseMove,
  onCardMouseLeave,
}: {
  onCardMouseMove: (e: React.MouseEvent<HTMLElement>) => void
  onCardMouseLeave: (e: React.MouseEvent<HTMLElement>) => void
}) => {
  return (
    <section className="hero min-h-[90vh] flex items-center px-6 lg:px-20 relative">
      <div className="hero-left z-10 max-w-2xl">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="hero-badge inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-md text-[10px] font-black uppercase tracking-widest text-white/60 mb-8"
        >
          <div className="size-2 rounded-full bg-[var(--primary)] animate-pulse" />
          Omoi 2.0 — Now with Pro Scoring
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="hero-title text-6xl lg:text-8xl font-black font-kawaii leading-[0.9] tracking-tighter text-white mb-8"
        >
          Note.<br />
          Explore.<br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-[var(--primary)] to-[var(--accent)]">Compare.</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="hero-sub text-lg text-white/40 font-medium max-w-lg mb-12 leading-relaxed"
        >
          La plateforme ultime pour ta passion. Note chaque œuvre avec précision, découvre des perles cachées, et synchronise tes listes avec Omoi.
        </motion.p>

        {/* Hero actions removed as per user request */}

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="hero-stats flex gap-12 mt-16"
        >
          <div className="stat">
            <span className="stat-num text-3xl font-black text-white">12K+</span>
            <span className="stat-label text-[10px] uppercase font-bold tracking-widest text-white/30">Animes</span>
          </div>
          <div className="stat">
            <span className="stat-num text-3xl font-black text-white">4.8K</span>
            <span className="stat-label text-[10px] uppercase font-bold tracking-widest text-white/30">Membres</span>
          </div>
          <div className="stat">
            <span className="stat-num text-3xl font-black text-white">98K</span>
            <span className="stat-label text-[10px] uppercase font-bold tracking-widest text-white/30">Avis</span>
          </div>
        </motion.div>
      </div>

      <div className="hero-visual flex-1 hidden lg:grid grid-cols-2 gap-6 relative">
        {/* Decorative glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-[var(--primary)]/10 blur-[120px] rounded-full" />

        <motion.div
          initial={{ opacity: 0, scale: 0.8, rotate: -5 }}
          animate={{ opacity: 1, scale: 1, rotate: 0 }}
          transition={{ delay: 0.5, type: 'spring' }}
          className="anime-card featured col-span-2 group"
          onMouseMove={onCardMouseMove}
          onMouseLeave={onCardMouseLeave}
        >
          <div className="card-poster h-64 relative overflow-hidden">
            <div className="poster-bg absolute inset-0 bg-[url('https://images.unsplash.com/photo-1541562232579-24233630f9a2?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center group-hover:scale-110 transition-transform duration-700" />
            <div className="poster-overlay absolute inset-0 bg-gradient-to-t from-[#0A0A0B] to-transparent" />
            <div className="card-label absolute bottom-6 left-6">
              <div className="card-title text-2xl font-black text-white font-kawaii">Attack on Titan</div>
              <div className="card-genre text-[10px] uppercase font-bold tracking-widest text-white/40">Action · Dark Fantasy</div>
            </div>
          </div>
          <div className="card-body p-6 flex items-center justify-between bg-white/5 backdrop-blur-xl">
            <div className="rating-row flex gap-1">
              {[1, 2, 3, 4, 5].map(i => <Star key={i} size={14} fill="var(--primary)" color="var(--primary)" />)}
            </div>
            <div className="score-badge font-kawaii text-2xl font-black text-[var(--primary)]">9.8</div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="anime-card group"
          onMouseMove={onCardMouseMove}
          onMouseLeave={onCardMouseLeave}
        >
          <div className="card-poster h-48 relative overflow-hidden">
            <div className="poster-bg absolute inset-0 bg-[#302b63] group-hover:scale-110 transition-transform duration-700" />
            <div className="poster-overlay absolute inset-0 bg-gradient-to-t from-[#0A0A0B] to-transparent" />
          </div>
          <div className="card-body p-4 bg-white/5 backdrop-blur-xl">
            <div className="card-title text-sm font-black text-white mb-2">Demon Slayer</div>
            <div className="anim-score flex items-center gap-3">
              <div className="flex-1 h-1 bg-white/10 rounded-full overflow-hidden">
                <div className="h-full bg-[var(--primary)] w-[99%]" />
              </div>
              <span className="text-[10px] font-black text-[var(--primary)]">9.9</span>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="anime-card group"
          onMouseMove={onCardMouseMove}
          onMouseLeave={onCardMouseLeave}
        >
          <div className="card-poster h-48 relative overflow-hidden">
            <div className="poster-bg absolute inset-0 bg-[#12664f] group-hover:scale-110 transition-transform duration-700" />
            <div className="poster-overlay absolute inset-0 bg-gradient-to-t from-[#0A0A0B] to-transparent" />
          </div>
          <div className="card-body p-4 bg-white/5 backdrop-blur-xl">
            <div className="card-title text-sm font-black text-white mb-2">Your Name</div>
            <div className="anim-score flex items-center gap-3">
              <div className="flex-1 h-1 bg-white/10 rounded-full overflow-hidden">
                <div className="h-full bg-[var(--accent)] w-[95%]" />
              </div>
              <span className="text-[10px] font-black text-[var(--accent)]">9.5</span>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
