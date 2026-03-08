import React from 'react'

import { AnimDetailCard } from '@/components/molecules/AnimDetailCard'

export const LandingAnimationScoreSection = () => {
  return (
    <section className="anim-section">
      <div className="section-header reveal">
        <div className="section-tag">Unique sur la plateforme</div>
        <h2 className="section-title">
          Score <span>Animation</span>
        </h2>
        <p className="anim-sub">Un système de notation spécial dédié à la qualité de l&apos;animation</p>
      </div>

      <div className="anim-feature-grid reveal">
        <AnimDetailCard
          icon="🎨"
          title="Qualité Visuelle"
          desc="Fidélité aux détails, richesse des couleurs, cohérence stylistique et travail des décors."
          score="9.2"
          bars={[
            { label: 'Couleurs', value: 92 },
            { label: 'Décors', value: 88 },
            { label: 'Style', value: 95 },
          ]}
        />
        <AnimDetailCard
          icon="💥"
          title="Fluidité & Action"
          desc="Nombre d'images par seconde, fluidité des mouvements et qualité des scènes d'action."
          score="9.7"
          bars={[
            { label: 'FPS', value: 98 },
            { label: 'Combats', value: 97 },
            { label: 'Transitions', value: 90 },
          ]}
        />
        <AnimDetailCard
          icon="🎭"
          title="Expression des persos"
          desc="Qualité des expressions faciales, du langage corporel et de l'animation des personnages."
          score="8.9"
          bars={[
            { label: 'Visages', value: 89 },
            { label: 'Postures', value: 85 },
            { label: 'Consistance', value: 91 },
          ]}
        />
        <AnimDetailCard
          icon="✨"
          title="Effets Spéciaux"
          desc="Magie, explosions, effets de lumière, particules et éléments CGI intégrés."
          score="9.5"
          bars={[
            { label: 'VFX', value: 95 },
            { label: 'Lumières', value: 93 },
            { label: 'CGI', value: 88 },
          ]}
        />

        <div className="anim-feat">
          <div>
            <div className="anim-feat-kicker">Score Animation Global</div>
            <div className="anim-feat-title">Attack on Titan: Final Season</div>
            <div className="anim-feat-score">
              9.7<span>/10</span>
            </div>
            <div className="anim-feat-meta">Studio MAPPA · Saison 4 · 2020-2023</div>
            <div className="anim-feat-tags">
              {['Top 1 Animation', 'Coup de coeur', 'Masterclass'].map((t) => (
                <span key={t} className="rc-tag">
                  {t}
                </span>
              ))}
            </div>
          </div>
          <div className="radar-placeholder">
            <div className="radar-inner">9.7</div>
          </div>
        </div>
      </div>
    </section>
  )
}
