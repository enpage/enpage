// @ts-nocheck
/**
 * Make sure to keep the enpage-preset below and the content array.:
 */
export default {
  presets: [require("@enpage/style-system/tailwind-preset")],
  content: [
    "./src/**/*.{js,ts}",
    "./*.{js,ts}",
    "./index.html",
    "node_modules/@enpage/sdk/src/**/*.{js,ts}",
    "node_modules/@enpage/style-system/src/**/*.{js,ts}",
  ],
  theme: {
    // you can extend the theme here
    extend: {},
  },
};
