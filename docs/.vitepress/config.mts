import { defineConfig } from "vitepress";

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "Enpage Developer Docs",
  description: "Enpage documentation for designers and developers to help them creating amazing one page websites",
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    logo: {
      dark: "/enpage-dark.svg",
      light: "/enpage.svg",
      alt: "Enpage Developer Documentation",
    },
    siteTitle: false,
    nav: [
      { text: "Help", link: "/help" },
      { text: "Contribute", link: "/contribute" },
      { text: "Enpage.co", link: "https://enpage.co" },
    ],
    sidebar: [
      {
        text: "Introduction",
        items: [
          { text: "Welcome", link: "/" },
          { text: "Getting Started", link: "/intro/getting-started" },
        ],
      },
      {
        text: "Writing a template",
        items: [
          {
            text: "Overview",
            link: "/guides/templates/",
          },
          {
            text: "Assets (img, css...)",
            collapsed: true,
            items: [
              { text: "Images", link: "/guides/templates/assets/images" },
              { text: "CSS", link: "/guides/templates/assets/css" },
              { text: "Javascript", link: "/guides/templates/assets/javascript" },
              { text: "Fonts", link: "/guides/templates/assets/fonts" },
            ],
          },
          { text: "Attributes", link: "/guides/templates/attributes" },
          { text: "Data Sources", link: "/guides/templates/data-sources" },
          {
            text: "Rendering data",
            collapsed: true,
            items: [
              { text: "Templating with Liquid", link: "/guides/templates/rendering/liquid" },
              { text: "Expressions", link: "/guides/templates/rendering/expressions" },
              { text: "Loops", link: "/guides/templates/rendering/loops" },
              { text: "Conditions", link: "/guides/templates/rendering/conditions" },
            ],
          },
          { text: "Multiple Pages", link: "/guides/templates/multipages" },
          { text: "Builder Settings", link: "/guides/templates/builder-settings" },
        ],
      },
      {
        text: "Data Sources",
        items: [
          {
            text: "Overview",
            link: "/guides/data-sources/",
          },
          {
            text: "Built-in Data Sources",
            link: "/guides/data-sources/built-in/",
            collapsed: true,
            items: [
              { text: "Instagram", link: "/guides/data-sources/built-in/instagram" },
              { text: "YouTube", link: "/guides/data-sources/built-in/youtube" },
            ],
          },
        ],
      },
      {
        text: "Data Records",
        items: [
          {
            text: "Overview",
            link: "/guides/data-records/",
          },
          {
            text: "Saving Data with Forms",
            link: "/guides/data-records/forms",
          },
          {
            text: "Built-in Data Records",
            link: "/guides/data-records/built-in/",
            collapsed: true,
            items: [
              { text: "Google Sheets", link: "/guides/data-records/built-in/google-sheets" },
              { text: "Airtable", link: "/guides/data-records/built-in/airtable" },
              { text: "HTTP Query", link: "/guides/data-records/built-in/http-query" },
            ],
          },
        ],
      },
      {
        text: "Enpage Global Object",
        items: [
          { text: "Overview", link: "/enpage-global/" },
          { text: "Context", link: "/enpage-global/context" },
          { text: "Data Records", link: "/enpage-global/data-records" },
          { text: "Navigation", link: "/enpage-global/navigation" },
        ],
      },
      {
        text: "🆘 Getting Help",
        link: "/help",
      },
      {
        text: "❤️ Contribute",
        link: "/contribute",
      },
    ],
    editLink: {
      pattern: "https://github.com/enpage/enpage/edit/main/docs/:path",
    },
    socialLinks: [{ icon: "github", link: "https://github.com/enpage/enpage" }],
  },
});
