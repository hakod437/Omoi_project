import React from 'react'

import { TasteBar } from '@/components/molecules/TasteBar'

export const LandingComparisonSection = () => {
  return (
    <section className="comparison-wrap">
      <div className="comparison-header reveal">
        <div className="section-tag">Feature exclusive</div>
        <h2 className="section-title">
          Compare tes <span>Goûts</span>
        </h2>
        <p className="comparison-sub">Invite un ami et découvrez votre compatibilité animé</p>
      </div>

      <div className="comparison-section reveal">
        <div className="comparison-grid">
          <div className="profile-card">
            <div className="avatar avatar-1">🦊</div>
            <div className="profile-name">Yuki_Otaku</div>
            <div className="taste-bars">
              <TasteBar label="Action" value={88} />
              <TasteBar label="Romance" value={45} />
              <TasteBar label="Isekai" value={72} />
              <TasteBar label="Seinen" value={60} />
            </div>
          </div>

          <div className="vs-circle">
            <div className="vs-badge">VS</div>
            <div className="compat-score">
              <div className="compat-num">76%</div>
              <div className="compat-label">Compat.</div>
            </div>
          </div>

          <div className="profile-card">
            <div className="avatar avatar-2">🐉</div>
            <div className="profile-name">SakuraDream</div>
            <div className="taste-bars">
              <TasteBar label="Action" value={65} />
              <TasteBar label="Romance" value={90} />
              <TasteBar label="Isekai" value={55} />
              <TasteBar label="Seinen" value={40} />
            </div>
          </div>
        </div>

        <div className="common-anime">
          <div className="common-title">Animes en commun ✦</div>
          <div className="common-list">
            {['Attack on Titan', 'Demon Slayer', 'Sword Art Online', 'Your Name', 'One Piece', '+ 12 autres'].map((t) => (
              <div key={t} className="common-item">
                {t}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
