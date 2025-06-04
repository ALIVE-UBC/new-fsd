/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./backend/**/templates/**/*.html", // For Django templates
    "./frontend/**/*.{js,jsx,ts,tsx}", // For your React components
  ],
  theme: {
    extend: {},
  },
  plugins: [],
};
