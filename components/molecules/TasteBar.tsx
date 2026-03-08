import React from 'react'

export const TasteBar = ({ label, value }: { label: string; value: number }) => {
  return (
    <div className="taste-item">
      <div className="taste-label">
        <span>{label}</span>
        <span>{value}%</span>
      </div>
      <div className="taste-bar">
        <div className="taste-fill" style={{ width: `${value}%` }} />
      </div>
    </div>
  )
}
