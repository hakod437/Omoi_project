/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./app/**/*.{js,ts,jsx,tsx,mdx}",
        "./components/**/*.{js,ts,jsx,tsx,mdx}",
    ],
  theme: {
    extend: {
      // ── Fonts ──────────────────────────────────────────────
     fontFamily: {
  title: ["var(--font-hachi)", "cursive"],
  ui:    ["var(--font-nunito)", "sans-serif"],
  sans:  ["var(--font-dm)", "sans-serif"],
},

      // ── Couleurs mappées sur les variables CSS des thèmes ──
      colors: {
        background: 'var(--background)',
        foreground: 'var(--foreground)',
        card:       'var(--card)',
        primary:    'var(--primary)',
        accent:     'var(--accent)',
        muted:      'var(--muted)',
        'muted-fg': 'var(--muted-fg)',
        border:     'var(--border)',
        'tag-bg':   'var(--tag-bg)',
        'tag-fg':   'var(--tag-fg)',
      },

      // ── Border radius ──────────────────────────────────────
      borderRadius: {
        theme: 'var(--radius)',
      },

      // ── Box shadow (glow effects) ──────────────────────────
      boxShadow: {
        glow:        'var(--glow)',
        'glow-accent': 'var(--glow-accent)',
      },

      // ── Animation aurora ───────────────────────────────────
      keyframes: {
        'aurora-float': {
          '0%, 100%': { transform: 'translate(0, 0) scale(1)' },
          '33%':       { transform: 'translate(30px, -40px) scale(1.05)' },
          '66%':       { transform: 'translate(-20px, 20px) scale(0.97)' },
        },
        'blob-pulse': {
          '0%, 100%': { opacity: '1', transform: 'scale(1)' },
          '50%':       { opacity: '0.5', transform: 'scale(0.8)' },
        },
        'fade-up': {
          from: { opacity: '0', transform: 'translateY(20px)' },
          to:   { opacity: '1', transform: 'translateY(0)' },
        },
        shimmer: {
          from: { transform: 'translateX(-100%) skewX(-15deg)' },
          to:   { transform: 'translateX(200%) skewX(-15deg)' },
        },
      },
      animation: {
        'aurora-float':  'aurora-float 12s ease-in-out infinite',
        'blob-pulse':    'blob-pulse 2s ease infinite',
        'fade-up':       'fade-up 0.6s ease both',
        shimmer:         'shimmer 0.4s ease',
      },
    },
  },
  plugins: [],
}