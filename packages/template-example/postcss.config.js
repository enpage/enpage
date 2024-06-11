// @ts-nocheck
//-----------------------------------------------------------------------------------------------
//
// You should not need to edit this file,
//
//-----------------------------------------------------------------------------------------------
export default {
  plugins: {
    "postcss-import": {},
    "postcss-preset-env": {},
    tailwindcss: {},
    ...(process.env.NODE_ENV === "production"
      ? {
          cssnano: {},
        }
      : {}),
  },
};
