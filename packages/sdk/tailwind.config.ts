export default {
  presets: [require("@enpage/style-system/tailwind-preset")],
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "node_modules/@enpage/style-system/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {},
  },
};
