// @ts-nocheck
//-----------------------------------------------------------------------------------------------
//
// You may want to customize the PostCSS configuration for your template here.
//
//-----------------------------------------------------------------------------------------------
export default {
  plugins: {
    "postcss-import": {},
    "postcss-preset-env": {},
    ...(!!process.env.DISABLE_TAILWIND ? {} : { tailwindcss: {} }),
    ...(process.env.NODE_ENV === "production"
      ? {
          cssnano: {},
        }
      : {}),
  },
};
