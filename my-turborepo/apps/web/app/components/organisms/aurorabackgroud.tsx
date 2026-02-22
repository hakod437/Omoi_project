

export default function AuroraBackground() {
  return (
    <div
      aria-hidden="true"
      className="fixed inset-0 z-0 overflow-hidden pointer-events-none"
    >
      {/* Blob 1 — haut gauche */}
      <div
        className="aurora-blob aurora-blob-1 absolute rounded-full"
        style={{
          width: '600px',
          height: '600px',
          background: 'var(--blob-1)',
          top: '-100px',
          left: '-100px',
          filter: 'blur(90px)',
          opacity: 'var(--blob-opacity, 0.12)',
          animation: 'aurora-float 12s ease-in-out infinite',
          animationDelay: '0s',
          transition: 'background 0.5s ease',
        }}
      />

      {/* Blob 2 — milieu droite */}
      <div
        className="aurora-blob aurora-blob-2 absolute rounded-full"
        style={{
          width: '400px',
          height: '400px',
          background: 'var(--blob-2)',
          top: '50%',
          right: '-80px',
          filter: 'blur(90px)',
          opacity: 'var(--blob-opacity, 0.12)',
          animation: 'aurora-float 12s ease-in-out infinite',
          animationDelay: '-4s',
          transition: 'background 0.5s ease',
        }}
      />

      {/* Blob 3 — bas centre */}
      <div
        className="aurora-blob aurora-blob-3 absolute rounded-full"
        style={{
          width: '500px',
          height: '500px',
          background: 'var(--blob-3)',
          bottom: '-100px',
          left: '30%',
          filter: 'blur(90px)',
          opacity: 'var(--blob-opacity, 0.12)',
          animation: 'aurora-float 12s ease-in-out infinite',
          animationDelay: '-8s',
          transition: 'background 0.5s ease',
        }}
      />
    </div>
  )
}