import forms from "@tailwindcss/forms";
import scrollbars from "tailwind-scrollbar";
import typography from "@tailwindcss/typography";
import plugin from "tailwindcss/plugin";
import easing from "@whiterussianstudio/tailwind-easing";

/** @type {import('tailwindcss').Config} */
export default {
  theme: {
    extend: {
      colors: {
        upstart: {
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
        dark: {
          50: "#f6f6f6",
          100: "#e7e7e7",
          200: "#d1d1d1",
          300: "#b0b0b0",
          400: "#888888",
          500: "#6d6d6d",
          600: "#5d5d5d",
          700: "#4f4f4f",
          800: "#454545",
          900: "#333333",
          950: "#262626",
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
