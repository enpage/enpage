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
      { text: "Home", link: "/" },
      { text: "Examples", link: "/markdown-examples" },
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
          { text: "Settings", link: "/guides/templates/settings" },
          { text: "Attributes", link: "/guides/templates/attributes" },
          { text: "Multiple Pages", link: "/guides/templates/multipages" },
        ],
      },
      {
        text: "Data Sources",
        items: [
          {
            text: "Overview",
            link: "/guides/data-sources",
          },
          {
            text: "Rendering data",
            collapsed: true,
            items: [
              { text: "Templating with Liquid", link: "/guides/data-sources/rendering/liquid" },
              { text: "Loops", link: "/guides/data-sources/rendering/loops" },
              { text: "Conditional renreding", link: "/guides/data-sources/rendering/conditional-rendering" },
            ],
          },
          {
            text: "Built-in Data Sources",
            link: "/guides/data-sources/builtin",
            collapsed: true,
            items: [{ text: "Instagram", link: "data-sources/builtin/instagram" }],
          },
          { text: "Custom Data Sources", link: "/guides/data-sources/custom" },
        ],
      },
      {
        text: "Data Records",
        items: [
          {
            text: "Overview",
            link: "/data-records",
          },
          {
            text: "Saving data to Enpage",
            link: "/data-records/builtin-datasources",
            collapsed: true,
            items: [
              { text: "Contentful", link: "/data-records/contentful" },
              { text: "Prismic", link: "/data-records/prismic" },
              { text: "Shopify", link: "/data-records/shopify" },
              { text: "Wordpress", link: "/data-records/wordpress" },
            ],
          },
          {
            text: "Saving data remotely",
            link: "/data-records/builtin-datasources",
            collapsed: true,
            items: [
              { text: "Contentful", link: "/data-records/contentful" },
              { text: "Prismic", link: "/data-records/prismic" },
              { text: "Shopify", link: "/data-records/shopify" },
              { text: "Wordpress", link: "/data-records/wordpress" },
            ],
          },
        ],
      },
      {
        text: "Enpage API",
        items: [
          { text: "Overview", link: "/enpage-api" },
          { text: "Navigation", link: "/enpage-api/navigation" },
          { text: "Forms", link: "/enpage-api/forms" },
          { text: "Cookies", link: "/enpage-api/cookies" },
          { text: "Analytics", link: "/enpage-api/analytics" },
        ],
      },
      {
        text: "Contribute",
        collapsed: true,
        items: [
          { text: "Overview", link: "/enpage-api" },
          { text: "Navigation", link: "/enpage-api/navigation" },
          { text: "Forms", link: "/enpage-api/forms" },
          { text: "Cookies", link: "/enpage-api/cookies" },
          { text: "Analytics", link: "/enpage-api/analytics" },
        ],
      },
    ],
    editLink: {
      pattern: "https://github.com/enpage/enpage-sdk/edit/main/docs/:path",
    },

    socialLinks: [{ icon: "github", link: "https://github.com/enpage/enpage-sdk" }],
  },
});
