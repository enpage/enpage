export const addTemplateDeps = () => {
  return {
    name: "enpage-add-template-deps",
    transformIndexHtml: {
      order: "pre" as const,
      handler: (html: string) => {
        return html.replace(
          "</head>",
          `<script>
          window.addEventListener("vite:preloadError", (event) => {
            window.location.reload();
          });
          </script>
          <script type="module">import "@enpage/sdk/components";</script>
          </head>`,
        );
      },
    },
  };
};
