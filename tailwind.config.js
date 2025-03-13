/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./app/Components/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        p1: "#613BFF",
        b50: "#EFEBFF",
        b75: "#BEAFFF",
        b200: "#7C5CFF",
        n400: "#505050",
        n500: "#B3B3B3",
        n100: "#A6A6A6",
        n0: "#151515",
        n6: "#353535",
        n40: "#DFDFDF",
        n50: "#090909",
        n70: "#424242",
        n75: "#242424",
      },
      fontFamily: {
        titleFont: ["Inter", "sans-serif"],
        regular: ["Lato", "serif"],
      },
    },
  },
  plugins: [],
};
