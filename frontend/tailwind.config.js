/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          50: "#eef4ff",
          100: "#d9e6ff",
          500: "#3457d5",
          600: "#2a46b3",
          700: "#213890",
        },
      },
    },
  },
  plugins: [],
};
