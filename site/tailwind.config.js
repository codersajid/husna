/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./**/*.html",
    "./assets/**/*.js"
  ],
  theme: {
    extend: {
      colors: {
        brandGreen: '#0B7D3B',
        brandOrange: '#FF7A18',
        brandNavy: '#163B5B',
        brandSlate: '#111827',
        brandGray: '#F3F4F6'
      },
      boxShadow: {
        soft: '0 10px 25px rgba(0,0,0,0.08)'
      }
    },
  },
  plugins: [],
}
