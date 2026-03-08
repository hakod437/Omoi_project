import React from 'react'

const FILTERS = ['Tous', 'Action', 'Romance', 'Isekai', 'Shonen', 'Slice of Life', 'Mecha', 'Seinen', 'Films']

export const LandingSearchSection = ({
  activeFilter,
  onFilterChange,
  onCardMouseMove,
  onCardMouseLeave,
}: {
  activeFilter: string
  onFilterChange: (filter: string) => void
  onCardMouseMove: (e: React.MouseEvent<HTMLElement>) => void
  onCardMouseLeave: (e: React.MouseEvent<HTMLElement>) => void
}) => {
  return (
    <section className="section reveal">
      <div className="section-header">
        <div className="section-tag">Base de données</div>
        <h2 className="section-title">
          Trouve ton <span>Anime</span>
        </h2>
      </div>

      <div className="search-container">
        <input type="text" className="search-bar" placeholder="Rechercher un anime, un studio, un genre..." />
        <button className="search-icon" type="button" aria-label="Rechercher">
          🔍
        </button>
      </div>

      <div className="filter-chips">
        {FILTERS.map((f) => (
          <button
            key={f}
            className={`chip ${activeFilter === f ? 'active' : ''}`}
            type="button"
            onClick={() => onFilterChange(f)}
          >
            {f}
          </button>
        ))}
      </div>

      <div className="results-grid">
        <div className="result-card" onMouseMove={onCardMouseMove} onMouseLeave={onCardMouseLeave}>
          <div className="rc-poster rc-p1">
            <div className="rc-emoji">⚡</div>
            <div className="rc-score">9.2</div>
          </div>
          <div className="rc-body">
            <div className="rc-name">Fullmetal Alchemist: Brotherhood</div>
            <div className="rc-meta">
              <span className="rc-tag">Action</span>
              <span className="rc-tag">2009</span>
            </div>
          </div>
        </div>

        <div className="result-card" onMouseMove={onCardMouseMove} onMouseLeave={onCardMouseLeave}>
          <div className="rc-poster rc-p2">
            <div className="rc-emoji">🌸</div>
            <div className="rc-score">8.9</div>
          </div>
          <div className="rc-body">
            <div className="rc-name">Violet Evergarden</div>
            <div className="rc-meta">
              <span className="rc-tag">Drama</span>
              <span className="rc-tag">2018</span>
            </div>
          </div>
        </div>

        <div className="result-card" onMouseMove={onCardMouseMove} onMouseLeave={onCardMouseLeave}>
          <div className="rc-poster rc-p3">
            <div className="rc-emoji">🔮</div>
            <div className="rc-score">8.5</div>
          </div>
          <div className="rc-body">
            <div className="rc-name">Chainsaw Man</div>
            <div className="rc-meta">
              <span className="rc-tag">Action</span>
              <span className="rc-tag">2022</span>
            </div>
          </div>
        </div>

        <div className="result-card" onMouseMove={onCardMouseMove} onMouseLeave={onCardMouseLeave}>
          <div className="rc-poster rc-p4">
            <div className="rc-emoji">🌀</div>
            <div className="rc-score">9.0</div>
          </div>
          <div className="rc-body">
            <div className="rc-name">Jujutsu Kaisen</div>
            <div className="rc-meta">
              <span className="rc-tag">Shonen</span>
              <span className="rc-tag">2020</span>
            </div>
          </div>
        </div>

        <div className="result-card" onMouseMove={onCardMouseMove} onMouseLeave={onCardMouseLeave}>
          <div className="rc-poster rc-p5">
            <div className="rc-emoji">🏔</div>
            <div className="rc-score">8.3</div>
          </div>
          <div className="rc-body">
            <div className="rc-name">Made in Abyss</div>
            <div className="rc-meta">
              <span className="rc-tag">Adventure</span>
              <span className="rc-tag">2017</span>
            </div>
          </div>
        </div>

        <div className="result-card result-card-more" onMouseMove={onCardMouseMove} onMouseLeave={onCardMouseLeave}>
          <div className="result-more-inner">
            <div className="result-more-plus">＋</div>
            <div className="result-more-label">Voir tout</div>
          </div>
        </div>
      </div>
    </section>
  )
}
