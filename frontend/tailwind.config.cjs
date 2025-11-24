/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['"Manrope"', 'ui-sans-serif', 'system-ui'],
      },
      colors: {
        midnight: '#0f172a',
        mist: '#f8fafc',
        accent: '#3b82f6',
      },
      boxShadow: {
        glow: '0 15px 60px rgba(15, 23, 42, 0.12)',
      },
    },
  },
  plugins: [],
};
