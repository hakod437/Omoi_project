import React from 'react'

export const LandingHero = ({
  onCardMouseMove,
  onCardMouseLeave,
}: {
  onCardMouseMove: (e: React.MouseEvent<HTMLElement>) => void
  onCardMouseLeave: (e: React.MouseEvent<HTMLElement>) => void
}) => {
  return (
    <section className="hero">
      <div className="hero-left">
        <div className="hero-badge">
          <div className="badge-dot" />
          Beta — Rejoins la communauté
        </div>

        <h1 className="hero-title">
          Note.<br />
          Explore.<br />
          <span>Compare.</span>
        </h1>

        <p className="hero-sub">
          La plateforme ultime pour les otakus. Note chaque anime, découvre des perles cachées, et compare tes goûts avec
          tes amis — avec un scoring spécial pour l&apos;animation.
        </p>

        <div className="hero-actions">
          <button className="btn-primary" type="button">
            ✦ Commencer gratis
          </button>
          <button className="btn-secondary" type="button">
            Voir la démo →
          </button>
        </div>

        <div className="hero-stats">
          <div className="stat">
            <span className="stat-num">12K+</span>
            <span className="stat-label">Animes</span>
          </div>
          <div className="stat">
            <span className="stat-num">4.8K</span>
            <span className="stat-label">Membres</span>
          </div>
          <div className="stat">
            <span className="stat-num">98K</span>
            <span className="stat-label">Avis</span>
          </div>
        </div>
      </div>

      <div className="hero-visual">
        <div className="anime-card featured p1" onMouseMove={onCardMouseMove} onMouseLeave={onCardMouseLeave}>
          <div className="card-poster">
            <div className="poster-bg" />
            <div className="poster-overlay" />
            <div className="card-label">
              <div className="card-title">Attack on Titan: Final Season</div>
              <div className="card-genre">Action · Dark Fantasy</div>
            </div>
          </div>
          <div className="card-body">
            <div className="rating-row">
              <div className="stars">
                <span className="star">★</span>
                <span className="star">★</span>
                <span className="star">★</span>
                <span className="star">★</span>
                <span className="star">★</span>
              </div>
              <div className="score-badge">9.8</div>
            </div>
            <div className="anim-score">
              <span className="anim-label">🎬 Anim.</span>
              <div className="anim-bar">
                <div className="anim-fill" style={{ width: '97%' }} />
              </div>
              <span className="anim-score-num">9.7</span>
            </div>
          </div>
        </div>

        <div className="anime-card p2" onMouseMove={onCardMouseMove} onMouseLeave={onCardMouseLeave}>
          <div className="card-poster">
            <div className="poster-bg" />
            <div className="poster-overlay" />
            <div className="card-label">
              <div className="card-title">Demon Slayer</div>
              <div className="card-genre">Shonen</div>
            </div>
          </div>
          <div className="card-body">
            <div className="rating-row">
              <div className="stars">
                <span className="star">★</span>
                <span className="star">★</span>
                <span className="star">★</span>
                <span className="star">★</span>
                <span className="star empty">★</span>
              </div>
              <div className="score-badge">8.7</div>
            </div>
            <div className="anim-score">
              <span className="anim-label">🎬</span>
              <div className="anim-bar">
                <div className="anim-fill" style={{ width: '99%' }} />
              </div>
              <span className="anim-score-num">9.9</span>
            </div>
          </div>
        </div>

        <div className="anime-card p3" onMouseMove={onCardMouseMove} onMouseLeave={onCardMouseLeave}>
          <div className="card-poster">
            <div className="poster-bg" />
            <div className="poster-overlay" />
            <div className="card-label">
              <div className="card-title">Your Name</div>
              <div className="card-genre">Romance · Film</div>
            </div>
          </div>
          <div className="card-body">
            <div className="rating-row">
              <div className="stars">
                <span className="star">★</span>
                <span className="star">★</span>
                <span className="star">★</span>
                <span className="star">★</span>
                <span className="star">★</span>
              </div>
              <div className="score-badge">9.5</div>
            </div>
            <div className="anim-score">
              <span className="anim-label">🎬</span>
              <div className="anim-bar">
                <div className="anim-fill" style={{ width: '95%' }} />
              </div>
              <span className="anim-score-num">9.5</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
