/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['var(--font-geist-mono)', 'monospace'],
        mono: ['var(--font-geist-mono)', 'monospace'],
      },
      colors: {
        surface: {
          DEFAULT: 'rgb(var(--bg-primary))',
          50:  'rgb(var(--bg-secondary))',
          100: 'rgb(var(--bg-card))',
          200: 'rgb(var(--bg-surface-200))',
          300: 'rgb(var(--bg-surface-300))',
          400: 'rgb(var(--bg-surface-400))',
          500: 'rgb(var(--bg-surface-500))',
          600: '#444444',
          700: '#555555',
          800: '#777777',
          900: '#999999',
        },
        accent: {
          DEFAULT: '#22c55e',
          50:  '#052e16',
          100: '#064e27',
          200: '#0a6e35',
          300: '#16a34a',
          400: '#22c55e',
          500: '#4ade80',
          600: '#86efac',
          700: '#bbf7d0',
          800: '#dcfce7',
          900: '#f0fdf4',
        },
      },
      animation: {
        'fade-in':    'fadeIn 0.2s ease-out',
        'slide-up':   'slideUp 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
        'slide-down': 'slideDown 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
        'glow-pulse': 'glowPulse 2s ease-in-out infinite',
        'float':      'float 3s ease-in-out infinite',
        'shimmer':    'shimmer 2s linear infinite',
      },
      keyframes: {
        fadeIn: {
          from: { opacity: '0' },
          to:   { opacity: '1' },
        },
        slideUp: {
          from: { opacity: '0', transform: 'translateY(12px)' },
          to:   { opacity: '1', transform: 'translateY(0)' },
        },
        slideDown: {
          from: { opacity: '0', transform: 'translateY(-12px)' },
          to:   { opacity: '1', transform: 'translateY(0)' },
        },
        glowPulse: {
          '0%, 100%': { opacity: '0.4' },
          '50%':      { opacity: '0.8' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%':      { transform: 'translateY(-6px)' },
        },
        shimmer: {
          '0%':   { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
      },
      backgroundImage: {
        'grid-pattern': 'linear-gradient(rgba(34,197,94,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(34,197,94,0.03) 1px, transparent 1px)',
        'glow-radial':  'radial-gradient(circle at center, rgba(34,197,94,0.08) 0%, transparent 70%)',
      },
      backgroundSize: {
        'grid': '24px 24px',
      },
    },
  },
  plugins: [],
}
