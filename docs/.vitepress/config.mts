import { defineConfig } from "vitepress";

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "Enpage Developer Docs",
  description:
    "Enpage documentation for designers and developers to help them creating amazing one page websites",
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
      { text: "Quick start", link: "/getting-started" },
      { text: "Help", link: "/help" },
      { text: "Contribute", link: "/contribute" },
      { text: "Enpage.co", link: "https://enpage.co" },
    ],
    sidebar: [
      {
        text: "Introduction",
        items: [
          { text: "What is Enpage?", link: "/what-is-enpage" },
          { text: "Getting Started", link: "/getting-started" },
        ],
      },
      {
        text: "Writing a template",
        items: [
          {
            text: "Overview",
            link: "/guides/templates/",
          },
          { text: "Using Javascript / Typescript", link: "/guides/templates/javascript" },
          { text: "Styling with CSS", link: "/guides/templates/css" },
          {
            text: "Assets (images & fonts)",
            collapsed: true,
            items: [
              { text: "Images", link: "/guides/templates/assets/images" },
              { text: "Fonts", link: "/guides/templates/assets/fonts" },
            ],
          },
          { text: "Attributes", link: "/guides/templates/attributes" },
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
            text: "Internal Data Sources",
            link: "/guides/data-sources/internal/",
            collapsed: true,
            items: [
              // { text: "Blog", link: "/guides/data-sources/internal/blog" },
              // { text: "Contact information", link: "/guides/data-sources/internal/contact" },
              // { text: "Events", link: "/guides/data-sources/internal/events" },
              { text: "FAQ", link: "/guides/data-sources/internal/faq" },
              // { text: "Features", link: "/guides/data-sources/internal/features" },
              // { text: "Gallery", link: "/guides/data-sources/internal/gallery" },
              { text: "Links", link: "/guides/data-sources/internal/links" },
              // { text: "People", link: "/guides/data-sources/internal/people" },
              // { text: "Pricing plans", link: "/guides/data-sources/internal/pricing-plans" },
              // { text: " Products", link: "/guides/data-sources/internal/products" },
              // { text: "Resume", link: "/guides/data-sources/internal/resume" },
              // { text: "Roadmap", link: "/guides/data-sources/internal/roadmap" },
              // { text: "Survey", link: "/guides/data-sources/internal/survey" },
              // { text: "Testimonials", link: "/guides/data-sources/internal/testimonials" },
              // { text: "Timeline", link: "/guides/data-sources/internal/timeline" },
            ],
          },
          {
            text: "External Data Sources",
            link: "/guides/data-sources/external/",
            collapsed: true,
            items: [
              { text: "Instagram", link: "/guides/data-sources/external/instagram" },
              { text: "Mastodon", link: "/guides/data-sources/external/mastodon" },
              { text: "Threads", link: "/guides/data-sources/external/threads" },
              { text: "TikTok", link: "/guides/data-sources/external/tiktok" },
              { text: "YouTube", link: "/guides/data-sources/external/youtube" },
              { text: "RSS", link: "/guides/data-sources/external/rss" },
              { text: "HTTP-JSON", link: "/guides/data-sources/external/http-json" },
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
              { text: "Notion", link: "/guides/data-records/built-in/notion" },
              { text: "HTTP Query", link: "/guides/data-records/built-in/http-query" },
            ],
          },
        ],
      },
      {
        text: "Enpage JS API",
        items: [
          { text: "Overview", link: "/js-api/" },
          { text: "Context", link: "/js-api/context" },
          { text: "Data Records", link: "/js-api/data-records" },
          { text: "Navigation", link: "/js-api/navigation" },
        ],
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
    footer: {
      message: "Enpage SDK is released under AGPL-3.0 license",
      copyright: "Copyright © 2024-present Flippable- Made with ❤️ in Paris",
    },
  },
  head: [
    ["link", { rel: "icon", href: "/favicon.svg" }],
    ["link", { rel: "apple-touch-icon", sizes: "180x180", href: "/apple-touch-icon.png" }],
    ["link", { rel: "icon", type: "image/png", sizes: "32x32", href: "/favicon-32x32.png" }],
    ["link", { rel: "icon", type: "image/png", sizes: "16x16", href: "/favicon-16x16.png" }],
    ["link", { rel: "manifest", href: "/site.webmanifest" }],
    ["link", { rel: "mask-icon", href: "/safari-pinned-tab.svg", color: "#5bbad5" }],
    ["meta", { name: "msapplication-TileColor", content: "#2b5797" }],
    ["meta", { name: "theme-color", content: "#ffffff" }],
  ],
});
