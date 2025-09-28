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
        'aurora': {
          '0%': { transform: 'scale(1) translateY(0) rotate(0deg)' },
          '50%': { transform: 'scale(1.1) translateY(-20px) rotate(8deg)' },
          '100%': { transform: 'scale(1) translateY(0) rotate(0deg)' },
        },
        'aurora2': {
          '0%': { transform: 'scale(1) translateX(0) rotate(0deg)' },
          '50%': { transform: 'scale(1.08) translateX(30px) rotate(-6deg)' },
          '100%': { transform: 'scale(1) translateX(0) rotate(0deg)' },
        },
      },
      animation: {
        'page-enter': 'page-enter 0.38s cubic-bezier(0.4,0,0.2,1) forwards',
        'aurora': 'aurora 8s ease-in-out infinite',
        'aurora2': 'aurora2 10s ease-in-out infinite',
      },
    },
  },
  plugins: [
    function({ addUtilities }) {
      addUtilities({
        '.scrollbar-hide': {
          /* IE and Edge */
          '-ms-overflow-style': 'none',
          /* Firefox */
          'scrollbar-width': 'none',
          /* Safari and Chrome */
          '&::-webkit-scrollbar': {
            display: 'none'
          }
        }
      })
    }
  ],
} 