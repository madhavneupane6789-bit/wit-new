/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['"Manrope"', 'ui-sans-serif', 'system-ui'],
      },
      colors: {
        primary: '#8B5CF6',
        secondary: '#14B8A6',
        'dark-start': '#1a202c',
        'dark-end': '#2d3748',
        'light-glass': 'rgba(255, 255, 255, 0.1)',
        'dark-glass': 'rgba(0, 0, 0, 0.2)',
        midnight: '#0f172a', // keeping for compatibility, can be removed later
        mist: '#f8fafc', // keeping for compatibility, can be removed later
        accent: '#3b82f6', // keeping for compatibility, can be removed later
      },
      boxShadow: {
        glow: '0 0 20px rgba(139, 92, 246, 0.3)',
      },
    },
  },
  plugins: [],
};
