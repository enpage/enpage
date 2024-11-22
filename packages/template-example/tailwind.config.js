/**
 * Make sure to keep the enpage-preset below and the content array.
 */
import enpagePreset from "@upstart.gg/style-system/tailwind-preset";
export default {
  /* Keep this block as is */
  presets: [enpagePreset],
  content: [
    "./src/**/*.{js,ts}",
    "./*.{js,ts}",
    "./index.html",
    "node_modules/@upstart.gg/sdk/src/**/*.{js,ts}",
    "node_modules/@upstart.gg/style-system/src/**/*.{js,ts}",
  ],
  /* End of block */

  // Customize your theme here
  theme: {
    extend: {},
  },
};
