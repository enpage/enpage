import { defineConfig } from "vite";
import { minify } from "html-minifier";

const htmlPlugin = () => {
  return {
    name: "minify-html",
    transformIndexHtml(html) {
      return minify(html, {
        removeComments: true,
        collapseWhitespace: true,
        ignoreCustomComments: [],
        minifyJS: true,
      }) as string;
    },
  };
};

export default defineConfig({
  plugins: [htmlPlugin()],
  resolve: {
    preserveSymlinks: true,
  },
  optimizeDeps: {
    include: ["@enpage/sdk", "@enpage/style-system"],
  },
  build: {
    rollupOptions: {
      external: ["zod"],
      output: {
        esModule: true,
        globals: {
          zod: "Zod",
        },
      },
    },
  },
});
