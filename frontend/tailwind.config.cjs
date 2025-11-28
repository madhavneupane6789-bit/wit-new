/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['"Manrope"', 'ui-sans-serif', 'system-ui'],
      },
      colors: {
        primary: '#38bdf8', // sky-400
        secondary: '#0ea5e9', // sky-500
        'dark-start': '#0b1220',
        'dark-end': '#0f1c2e',
        'light-glass': 'rgba(255, 255, 255, 0.1)',
        'dark-glass': 'rgba(0, 0, 0, 0.2)',
        midnight: '#0f172a', // keeping for compatibility, can be removed later
        mist: '#f8fafc', // keeping for compatibility, can be removed later
        accent: '#38bdf8', // keeping for compatibility, can be removed later
      },
      boxShadow: {
        glow: '0 0 24px rgba(56, 189, 248, 0.35)',
      },
    },
  },
  plugins: [],
};
