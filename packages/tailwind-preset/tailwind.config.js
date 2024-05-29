import forms from "@tailwindcss/forms";
import scrollbars from "tailwind-scrollbar";
import typography from "@tailwindcss/typography";
import animate from "tailwindcss-animate";
import transform3d from "tailwindcss-3d";

/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{js,jsx,ts,tsx}", "./public/**/*.html"],
  theme: {
    extend: {},
  },

  plugins: [forms, typography, scrollbars, animate, transform3d],
};
