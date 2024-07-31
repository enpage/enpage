// @ts-nocheck
export default {
  plugins: {
    "postcss-import": {},
    "postcss-preset-env": {},
    ...(process.env.DISABLE_TAILWIND ? {} : { tailwindcss: {} }),
    ...(process.env.NODE_ENV === "production"
      ? {
          "@fullhuman/postcss-purgecss": {
            content: ["index.html", "src/**/*.{js,ts,css,html}"],
          },
          cssnano: {},
        }
      : {}),
  },
};
