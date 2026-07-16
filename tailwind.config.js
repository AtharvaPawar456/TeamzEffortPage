/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./index.html', './privacy.html', './terms.html'],
  theme: {
    extend: {
      colors: {
        primary: '#2563EB',
        secondary: '#0F172A',
        accent: '#06B6D4',
        surface: '#F8FAFC',
        body: '#334155',
        success: '#22C55E',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['Poppins', 'Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        soft: '0 10px 40px -10px rgba(15, 23, 42, 0.12)',
        glow: '0 0 40px rgba(37, 99, 235, 0.25)',
      },
    },
  },
  plugins: [],
};
