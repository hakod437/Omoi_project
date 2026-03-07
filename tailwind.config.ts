import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#00B49B',
          50: '#E6F4F1',
          100: '#D1F2EB',
          200: '#B3E5FC',
          300: '#94D3D2',
          400: '#76C1F1',
          500: '#5DADE2',
          600: '#4299E1',
          700: '#38A3CC',
          800: '#2F8CBE',
          900: '#1E75A6',
          950: '#155E75',
        },
        border: 'hsl(var(--border) / <alpha-value>)',
        input: 'hsl(var(--input) / <alpha-value>)',
        ring: 'hsl(var(--ring) / <alpha-value>)',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        card: 'hsl(var(--card))',
      },
      fontFamily: {
        kawaii: ['"Comic Sans MS"', 'cursive'],
        ui: ['Inter', 'system-ui', 'sans-serif'],
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.3s ease-out',
        'pulse-glow': 'pulse 2s cubic-bezier(0.4, 0, 0.6) infinite',
      },
      keyframes: {
        shimmer: {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(100%)' },
        },
        aurora: {
          '0%, 100%': {
            opacity: '0.3',
            transform: 'scale(1) rotate(0deg)',
          },
          '50%': {
            opacity: '0.8',
            transform: 'scale(1.1) rotate(180deg)',
          },
        },
      },
    },
  },
  plugins: [],
}

export default config
