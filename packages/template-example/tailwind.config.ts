export default {
  presets: [require("@enpage/style-system/tailwind-preset")],
  content: [
    "./**/*.{js,ts}",
    "./index.html",
    // keep the following 2 lines
    "node_modules/@enpage/sdk/src/**/*.{js,ts}",
    "node_modules/@enpage/style-system/src/**/*.{js,ts}",
  ],
  theme: {
    // you can extend the theme here
    extend: {},
  },
};
