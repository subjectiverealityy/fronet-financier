/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        // Brand
        brand: {
          DEFAULT: '#03c9a6',
          dim: 'rgba(3, 201, 166, 0.12)',
          border: 'rgba(3, 201, 166, 0.25)',
        },
        // Surfaces
        surface: {
          base: '#0a0a0a',
          1: '#0e0e0e',
          2: '#111111',
          3: '#1a1a1a',
        },
        // Borders
        border: {
          DEFAULT: 'rgba(255, 255, 255, 0.12)',
          strong: 'rgba(255, 255, 255, 0.20)',
        },
        // Text
        text: {
          primary: '#ffffff',
          secondary: 'rgba(255, 255, 255, 0.75)',
          tertiary: 'rgba(255, 255, 255, 0.65)',
        },
        // Semantic
        danger: '#ff5a5a',
        warning: '#f5a623',
        info: '#3d8eff',
      },
      fontFamily: {
        sans: ['Manrope', 'system-ui', 'sans-serif'],
        mono: ['DM Mono', 'monospace'],
      },
      borderRadius: {
        card: '12px',
        pill: '9999px',
        phone: '32px',
      },
      animation: {
        'fade-up': 'fadeUp 0.3s ease forwards',
        'fade-in': 'fadeIn 0.2s ease forwards',
      },
      keyframes: {
        fadeUp: {
          '0%': { opacity: '0', transform: 'translateY(8px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
      },
    },
  },
  plugins: [],
}
