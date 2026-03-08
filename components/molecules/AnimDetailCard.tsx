import React from 'react'

export const AnimDetailCard = ({
  icon,
  title,
  desc,
  score,
  bars,
}: {
  icon: string
  title: string
  desc: string
  score: string
  bars: Array<{ label: string; value: number }>
}) => {
  return (
    <div className="anim-detail-card">
      <div className="adc-icon">{icon}</div>
      <div className="adc-label">{title}</div>
      <div className="adc-desc">{desc}</div>
      <div className="adc-score-display">
        <div className="adc-big-score">{score}</div>
        <div className="adc-visual">
          {bars.map((b) => (
            <div key={b.label} className="mini-bar-row">
              <span className="mini-bar-label">{b.label}</span>
              <div className="mini-bar">
                <div className="mini-fill" style={{ width: `${b.value}%` }} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
