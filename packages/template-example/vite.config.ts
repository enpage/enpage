import { defineConfig } from "vite";
import { minify } from "html-minifier";
import tailwindcss from "tailwindcss";
import tailwindcssNesting from "tailwindcss/nesting";
import postcssImport from "postcss-import";
import autoprefixer from "autoprefixer";
import cssnano from "cssnano";

const htmlPlugin = () => {
  return {
    name: "minify-html",
    order: "pre",
    transformIndexHtml(html) {
      html = html.replace(
        "</head>",
        `<script type="module" src="./internal/autoload-components"></script>
        </head>`,
      );

      html = minify(html, {
        removeComments: true,
        collapseWhitespace: true,
        ignoreCustomComments: [],
        minifyJS: true,
      }) as string;

      return html;
    },
  };
};

export default defineConfig({
  plugins: [htmlPlugin()],
  css: {
    postcss: {
      plugins: [postcssImport(), tailwindcssNesting(), tailwindcss(), autoprefixer()],
    },
  },
  resolve: {
    preserveSymlinks: true,
  },
  optimizeDeps: {
    // include: ["@enpage/sdk", "@enpage/style-system"],
    include: ["@enpage/sdk", "@enpage/sdk/components"],
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
