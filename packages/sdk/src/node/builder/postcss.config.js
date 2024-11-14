export default {
  plugins: {
    "postcss-import": {},
    "postcss-preset-env": {},
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
