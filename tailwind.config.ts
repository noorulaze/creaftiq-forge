/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        'forge': {
          'black':   '#0A0A0F',
          'navy':    '#0D1117',
          'surface': '#111827',
          'surface2':'#161B27',
          'border':  '#1F2937',
          'border2': '#374151',
          'blue':    '#2563EB',
          'blue-light': '#3B82F6',
          'blue-dim': '#1D4ED8',
          'white':   '#F8F9FA',
          'off-white':'#E5E7EB',
          'muted':   '#6B7280',
          'muted2':  '#9CA3AF',
          'accent':  '#60A5FA',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      fontSize: {
        '2xs': '0.625rem',
        'display-lg': ['4.5rem', { lineHeight: '1.05', letterSpacing: '-0.03em' }],
        'display':    ['3.5rem', { lineHeight: '1.08', letterSpacing: '-0.025em' }],
        'display-sm': ['2.5rem', { lineHeight: '1.1',  letterSpacing: '-0.02em' }],
        'heading':    ['1.75rem', { lineHeight: '1.2', letterSpacing: '-0.01em' }],
      },
      letterSpacing: {
        'widest2': '0.2em',
        'widest3': '0.3em',
      },
      backgroundImage: {
        'forge-gradient': 'linear-gradient(135deg, #0A0A0F 0%, #0D1117 50%, #0A0F1A 100%)',
        'blue-glow': 'radial-gradient(ellipse at center, rgba(37, 99, 235, 0.15) 0%, transparent 70%)',
        'card-gradient': 'linear-gradient(180deg, #111827 0%, #0D1117 100%)',
      },
      boxShadow: {
        'blue-glow': '0 0 40px rgba(37, 99, 235, 0.2)',
        'blue-glow-sm': '0 0 20px rgba(37, 99, 235, 0.15)',
        'surface': '0 1px 3px rgba(0,0,0,0.5), 0 1px 2px rgba(0,0,0,0.4)',
        'card': '0 4px 24px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.04)',
        'card-hover': '0 8px 40px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.06)',
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-out forwards',
        'slide-up': 'slideUp 0.5s ease-out forwards',
        'pulse-slow': 'pulse 3s ease-in-out infinite',
        'shimmer': 'shimmer 2s linear infinite',
        'glow': 'glow 3s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: {
          from: { opacity: '0' },
          to:   { opacity: '1' },
        },
        slideUp: {
          from: { opacity: '0', transform: 'translateY(20px)' },
          to:   { opacity: '1', transform: 'translateY(0)' },
        },
        shimmer: {
          '0%':   { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        glow: {
          '0%, 100%': { opacity: '0.6' },
          '50%':      { opacity: '1' },
        },
      },
    },
  },
  plugins: [],
}
