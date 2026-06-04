/** @type {import('tailwindcss').Config} */
const PROPERTIES = require('./src/styles/properties')
module.exports = {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: { 
    extend: PROPERTIES.THEMES,
   },
  plugins: [],
};
