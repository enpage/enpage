import enpagePreset from "@enpage/style-system/tailwind-preset";
export default {
  /* Keep this block as is */
  presets: [enpagePreset],
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./index.html",
    "./node_modules/@enpage/style-system/src/**/*.{js,ts}",
  ],
  /* End of block */

  // Customize your theme here
  theme: {
    extend: {
      transitionTimingFunction: {
        "in-elastic": "cubic-bezier(0.34, 1.3, 0.64, 1)",
      },
    },
  },
};
