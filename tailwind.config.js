/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{vue,js,ts}',
    './components/**/*.{vue,js,ts}',
    './app.vue',
  ],
  theme: {
    extend: {},
  },
  plugins: [require('daisyui')],
}
