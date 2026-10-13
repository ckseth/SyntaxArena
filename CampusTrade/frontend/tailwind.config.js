/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        seashell: '#eee2df',
        powderPetal: '#eed7c5',
        rosyTaupe: '#c89f9c',
        burntPeach: '#c97c5d',
        terracottaClay: '#b36a5e',
        primary: {
          light: '#c89f9c', // rosy-taupe
          DEFAULT: '#c97c5d', // burnt-peach
          dark: '#b36a5e', // terracotta-clay
        },
        success: '#10b981', 
        error: '#ef4444', 
      },
      fontFamily: {
        sans: ['Inter', 'Poppins', 'system-ui', '-apple-system', 'sans-serif'],
      },
      borderRadius: {
        '3xl': '1.5rem',
        '4xl': '2rem',
        '5xl': '3rem',
      },
      boxShadow: {
        'premium': '0 10px 40px -10px rgba(201, 124, 93, 0.2)',
        'glass': '0 8px 32px rgba(201, 124, 93, 0.08)',
        'glow': '0 0 20px rgba(201, 124, 93, 0.2), 0 0 60px rgba(179, 106, 94, 0.08)',
        'neon': '0 0 40px rgba(201, 124, 93, 0.3)',
      },
      backdropBlur: {
        '3xl': '64px',
      },
      animation: {
        'float': 'float 3s ease-in-out infinite',
        'pulse-slow': 'pulse 3s ease-in-out infinite',
        'gradient': 'gradient-shift 4s ease infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        'gradient-shift': {
          '0%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
          '100%': { backgroundPosition: '0% 50%' },
        },
      },
    },
  },
  plugins: [],
}
