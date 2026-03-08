import React from 'react'

export const LandingFooter = () => {
  return (
    <>
      <footer>
        <div className="footer-brand">
          <div className="logo">AnimeVault</div>
          <p className="footer-desc">
            La plateforme communautaire pour noter, découvrir et comparer tes animes favoris. Fait avec passion par des
            otakus, pour des otakus.
          </p>
        </div>
        <div className="footer-col">
          <h4>Explorer</h4>
          <ul>
            <li>
              <a href="#">Top Animes</a>
            </li>
            <li>
              <a href="#">Nouveautés</a>
            </li>
            <li>
              <a href="#">Par genre</a>
            </li>
            <li>
              <a href="#">Studios</a>
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
              <a href="#">Comparer</a>
            </li>
            <li>
              <a href="#">Listes</a>
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
              <a href="#">CGU</a>
            </li>
            <li>
              <a href="#">Contact</a>
            </li>
          </ul>
        </div>
      </footer>
      <div className="footer-bottom">© 2025 AnimeVault — Fait avec ✦ pour la communauté anime</div>
    </>
  )
}
