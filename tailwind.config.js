/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        serif: ['Cormorant Garamond', 'Georgia', 'serif'],
        sans: ['DM Sans', 'system-ui', 'sans-serif'],
        mono: ['DM Mono', 'monospace'],
      },
      colors: {
        bloom: {
          bg: '#FAFAF7',
          text: '#2C2420',
          accent: '#C4A882',
          muted: '#9C8C7C',
          border: '#E8DDD4',
          soft: '#F5EDE4',
        },
        noir: {
          bg: '#0A0A0A',
          text: '#F0EBE0',
          accent: '#C9A84C',
          muted: '#7A7468',
          border: '#1E1E1E',
          soft: '#141414',
        },
        minimal: {
          bg: '#FFFFFF',
          text: '#1A1A1A',
          accent: '#4A4A4A',
          muted: '#888888',
          border: '#E5E5E5',
          soft: '#F7F7F7',
        },
      },
      animation: {
        'fade-up': 'fadeUp 0.7s ease forwards',
        'fade-in': 'fadeIn 0.5s ease forwards',
      },
      keyframes: {
        fadeUp: {
          from: { opacity: '0', transform: 'translateY(24px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        fadeIn: {
          from: { opacity: '0' },
          to: { opacity: '1' },
        },
      },
    },
  },
  plugins: [],
}
