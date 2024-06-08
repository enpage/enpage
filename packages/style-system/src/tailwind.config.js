import forms from "@tailwindcss/forms";
import scrollbars from "tailwind-scrollbar";
import typography from "@tailwindcss/typography";
import animate from "tailwindcss-animate";
import transform3d from "tailwindcss-3d";

/** @type {import('tailwindcss').Config} */
export default {
  theme: {
    extend: {
      colors: {
        enpage: {
          50: "#f2f4fb",
          100: "#e7ecf8",
          200: "#d3daf2",
          300: "#b8c2e9",
          400: "#9ba3de",
          500: "#8186d3",
          600: "#7270c6",
          700: "#5b57ab",
          800: "#4b498a",
          900: "#40406f",
          950: "#262541",
        },
      },
    },
  },
  plugins: [forms, typography, scrollbars, animate, transform3d],
};
