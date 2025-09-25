/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx}',
    './pages/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
  ],
  // Optimisasi untuk production - menggunakan content array yang sudah ada
  theme: {
    extend: {
      colors: {
        primary: '#005A9C',
        accent: '#00C49A',
        background: '#F8F9FA',
        text: '#1A202C',
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'sans-serif'],
        inter: ['Inter', 'sans-serif'],
      },
      keyframes: {
        'page-enter': {
          '0%': { opacity: '0', transform: 'translateX(32px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
      },
      animation: {
        'page-enter': 'page-enter 0.38s cubic-bezier(0.4,0,0.2,1) forwards',
      },
    },
  },
  plugins: [],
} 