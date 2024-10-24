// @ts-nocheck
export default {
  plugins: {
    "postcss-import": {},
    "postcss-preset-env": {},
    // tailwindcss: {},
    ...(process.env.NODE_ENV === "production"
      ? {
          cssnano: {},
        }
      : {}),
  },
};
