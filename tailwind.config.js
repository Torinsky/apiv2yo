/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        pokemonGreen: "#009944",
      },
      fontFamily:{
        sans:['inter, sans-serif']
      }
    },
  },
  plugins: [],
};
