import typography from '@tailwindcss/typography'

export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      colors: {
        bg: {
          base:     '#080b11',
          surface:  '#0e1420',
          elevated: '#141b2d',
          card:     '#111827',
        },
        border: {
          DEFAULT: '#1e2a3a',
          glow:    '#3b82f6',
        },
        accent: {
          blue:   '#3b82f6',
          purple: '#8b5cf6',
          cyan:   '#06b6d4',
          green:  '#10b981',
          orange: '#f59e0b',
          red:    '#ef4444',
        },
      },
      animation: {
        'fade-in-up': 'fadeInUp 0.5s ease forwards',
        'fade-in':    'fadeIn 0.4s ease forwards',
        'pulse-glow': 'pulseGlow 2s ease-in-out infinite',
        'spin-slow':  'spin 2s linear infinite',
        'shimmer':    'shimmer 2s linear infinite',
      },
      keyframes: {
        fadeInUp: {
          from: { opacity: '0', transform: 'translateY(20px)' },
          to:   { opacity: '1', transform: 'translateY(0)' },
        },
        fadeIn: {
          from: { opacity: '0' },
          to:   { opacity: '1' },
        },
        pulseGlow: {
          '0%, 100%': { boxShadow: '0 0 0 0 rgba(59, 130, 246, 0.4)' },
          '50%':      { boxShadow: '0 0 0 8px rgba(59, 130, 246, 0)' },
        },
        shimmer: {
          '0%':   { backgroundPosition: '-200% center' },
          '100%': { backgroundPosition:  '200% center' },
        },
      },
    },
  },
  plugins: [typography],
}
