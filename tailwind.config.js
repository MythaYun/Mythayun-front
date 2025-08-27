/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
  ],
  // Configuration minimale pour Tailwind v4
  // La configuration des thèmes, couleurs, et autres est maintenant dans app/globals.css avec @theme
  plugins: [],
};
