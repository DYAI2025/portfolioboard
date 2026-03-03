/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./App.tsx",
    "./index.tsx",
    "./constants.tsx",
    "./components/**/*.{ts,tsx}",
    "./utils/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
      boxShadow: {
        'glow-blue': '0 0 20px -5px rgba(59, 130, 246, 0.5)',
        'glow-purple': '0 0 20px -5px rgba(139, 92, 246, 0.5)',
        'inner-light': 'inset 0 1px 0 0 rgba(255, 255, 255, 0.1)',
      },
      colors: {
        surface: '#121212',
        'surface-highlight': '#1E1E1E',
      },
      keyframes: {
        'equalizer': {
          '0%, 100%': { height: '20%' },
          '50%': { height: '100%' },
        },
        'wave': {
          '0%, 100%': { height: '20%' },
          '50%': { height: '80%' },
        },
        'spectrum': {
          '0%, 100%': { height: '15%' },
          '33%': { height: '90%' },
          '66%': { height: '50%' },
        }
      },
      animation: {
        'eq-1': 'equalizer 0.8s ease-in-out infinite',
        'eq-2': 'equalizer 1.1s ease-in-out infinite',
        'eq-3': 'equalizer 0.9s ease-in-out infinite',
        'eq-4': 'equalizer 1.2s ease-in-out infinite',
        'wave-slow': 'wave 1s ease-in-out infinite',
        'spec-1': 'spectrum 0.5s ease-in-out infinite',
        'spec-2': 'spectrum 0.7s ease-in-out infinite',
        'spec-3': 'spectrum 0.6s ease-in-out infinite',
        'spec-4': 'spectrum 0.8s ease-in-out infinite',
      }
    }
  },
  plugins: [],
}
