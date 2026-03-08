import React from 'react'

export const LandingFooter = () => {
  return (
    <>
      <footer>
        <div className="footer-brand">
          <div className="logo">Omoi</div>
          <p className="footer-desc">
            La plateforme communautaire pour noter, découvrir et comparer tes œuvres favorites.
          </p>
        </div>
        <div className="footer-col">
          <h4>Explorer</h4>
          <ul>
            <li>
              <a href="#">Top Œuvres</a>
            </li>
            <li>
              <a href="#">Nouveautés</a>
            </li>
            <li>
              <a href="#">Par genre</a>
            </li>
          </ul>
        </div>
        <div className="footer-col">
          <h4>Communauté</h4>
          <ul>
            <li>
              <a href="#">Profils</a>
            </li>
            <li>
              <a href="#">Sync</a>
            </li>
            <li>
              <a href="#">Discord</a>
            </li>
          </ul>
        </div>
        <div className="footer-col">
          <h4>Infos</h4>
          <ul>
            <li>
              <a href="#">À propos</a>
            </li>
            <li>
              <a href="#">API</a>
            </li>
            <li>
              <a href="#">Contact</a>
            </li>
          </ul>
        </div>
      </footer>
      <div className="footer-bottom">© 2026 Omoi — Fait avec passion pour la communauté</div>
    </>
  )
}
