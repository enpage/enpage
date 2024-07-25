import forms from "@tailwindcss/forms";
import scrollbars from "tailwind-scrollbar";
import typography from "@tailwindcss/typography";
import transform3d from "tailwindcss-3d";
import plugin from "tailwindcss/plugin";
import easing from '@whiterussianstudio/tailwind-easing'

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
      textShadow: {
        sm: "0 1px 1px var(--tw-shadow-color)",
        md: "0 1px 2px var(--tw-shadow-color)",
        DEFAULT: "0 2px 4px var(--tw-shadow-color)",
        lg: "0 4px 8px var(--tw-shadow-color)",
        xl: "0 8px 16px var(--tw-shadow-color)",
      },
    },
  },
  plugins: [
    forms,
    typography,
    scrollbars,
    transform3d,
    easing,
    plugin(function ({ matchUtilities, theme }) {
      matchUtilities(
        {
          "text-shadow": (value) => ({
            textShadow: value,
          }),
        },
        { values: theme("textShadow") },
      );
    }),
  ],
};
