/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./public/index.html",
  ],
  theme: {
    extend: {
      colors: {
        dark: {
          900: '#0a0b11',
          800: '#0F121B',
          700: '#141828',
          600: '#1b1e2d',
          500: '#232A40',
          400: '#2d3548',
          300: '#4F5566',
        },
        accent: {
          DEFAULT: '#B4F22E',
          hover: '#a5dc2f',
          dark: '#8bc424',
        },
        danger: '#FF2F2F',
        warning: '#FFDE2F',
        success: '#0bb80b',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
      boxShadow: {
        'card': '0 4px 20px rgba(0, 0, 0, 0.25)',
        'card-hover': '0 8px 30px rgba(0, 0, 0, 0.35)',
        'glow-green': '0 0 20px rgba(180, 242, 46, 0.15)',
        'glow-red': '0 0 20px rgba(255, 47, 47, 0.15)',
      },
      animation: {
        'pulse-slow': 'pulse 3s ease-in-out infinite',
        'fade-in': 'fadeIn 0.3s ease-out',
        'slide-up': 'slideUp 0.4s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [],
}

