import { defineConfig } from "vitest/config";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
  // @ts-ignore
  plugins: [tsconfigPaths()],

  test: {
    // setupFiles: ["./vitest.setup.ts"],
    setupFiles: [new URL("./vitest.setup.ts", import.meta.url).pathname],
    // ...
  },
});
