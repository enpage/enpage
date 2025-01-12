// @ts-check
import { Type } from "@sinclair/typebox";
import { defineDataSources } from "@upstart.gg/sdk/datasources";
import { defineAttributes, attr } from "@upstart.gg/sdk/attributes";
import { defineBricks, createRow } from "@upstart.gg/sdk/bricks";
import { defineConfig } from "@upstart.gg/sdk/page";

// define your datasources
const datasources = defineDataSources({
  links: {
    provider: "internal-links",
    name: "Links",
    schema: Type.Array(
      Type.Object({
        title: Type.String(),
        url: Type.String({ format: "uri", pattern: "^https?://" }),
        icon: Type.Optional(Type.String()),
      }),
    ),
    sampleData: [
      { title: "Enpage", url: "https://enpage.co" },
      { title: "Github", url: "https://github.com/enpage/enpage" },
      { title: "Developers docs", url: "https://developers.enpage.co" },
    ],
  },
  tasks: {
    name: "Tasks",
    provider: "json",
    options: {
      url: "https://jsonplaceholder.typicode.com/todos?userId=1",
    },
    schema: Type.Array(
      Type.Object({
        id: Type.Number(),
        userId: Type.Number(),
        title: Type.String(),
        description: Type.Optional(Type.String()),
        completed: Type.Boolean(),
      }),
    ),
  },
  posts: {
    name: "Posts",
    provider: "facebook-posts",
    options: {
      limit: 5,
      refreshInterval: 60 * 60 * 1000,
    },
  },
  videos: {
    provider: "youtube-list",
    options: {
      channelId: "UCJbPGzawDH1njbqV-D5HqKw",
      maxResults: 10,
    },
    description: "List of videos from a Youtube playlist",
    name: "My Videos",
  },
});

const homePageBricks = defineBricks([
  ...createRow([
    {
      type: "image",
      props: {
        src: "https://cdn.upstart.gg/internal/logo/upstart.svg",
        // className: "max-h-24",
      },
      position: {
        mobile: {
          x: 0,
          w: "full",
          h: 3,
        },
        desktop: {
          x: 0,
          w: "full",
          h: 3,
        },
      },
    },
  ]),
  ...createRow([
    {
      type: "text",
      props: {
        content: "Build your launch page",
        justify: "text-center font-humanist",
      },
      // take the whole width on all devices
      position: {
        mobile: {
          x: 0,
          w: "full",
          h: 4,
        },
        desktop: {
          x: 0,
          y: 4,
          w: "full",
          h: 4,
        },
      },
    },
  ]),
  ...createRow([
    {
      type: "text",
      props: {
        content:
          "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus ornare justo lectus, vel placerat arcu vulputate scelerisque. Donec eget eros pellentesque, facilisis massa id, aliquam nisl. Suspendisse auctor ipsum vitae volutpat cursus. Donec vehicula urna felis, feugiat iaculis metus luctus varius. Nam sed pretium nulla.",
        justify: "text-center",
        format: "html",
      },
      position: {
        mobile: {
          x: 0,
          w: "full",
          h: 8,
        },
        desktop: {
          x: 0,
          w: "full",
          h: 3,
        },
      },
    },
  ]),
  ...createRow([
    {
      type: "text",
      props: { content: "Something" },
      position: {
        mobile: {
          x: "third",
          w: "full",
          h: 3,
        },
        desktop: {
          x: "third",
          w: "third",
          h: 3,
        },
      },
    },
    {
      type: "text",
      props: { content: "Else" },
      position: {
        mobile: {
          x: "twoThird",
          w: "full",
          h: 3,
        },
        desktop: {
          x: "twoThird",
          w: "third",
          h: 3,
        },
      },
    },
  ]),
]);

const themes = [
  {
    id: "aurora",
    name: "Aurora",
    description: "Vibrant gradients with ethereal color transitions",
    tags: ["gradient", "vibrant", "modern", "creative", "dynamic", "artistic", "bold"],

    colors: {
      primary: "#7c3aed", // Purple
      secondary: "#2dd4bf", // Teal
      // Cyan
      accent: "#ec4899", // Pink
      neutral: "#4b5563", // Grey
    },
    typography: {
      base: 16,
      heading: "neo-grotesque",
      body: "geometric-humanist",
    },
    customFonts: [
      {
        name: "Cabinet Grotesk!",
        src: "https://fonts.googleapis.com/css2?family=Cabinet+Grotesk:wght@700&display=swap",
        weight: "700",
        display: "swap",
      },
    ],
  },
];

// define your attributes
const siteAttributes = defineAttributes({
  mainButtonUrl: attr.url("Main Button URL", "https://facebook.com", { $id: "mainButtonUrl" }),
  testBoolTrue: attr.boolean("Test Bool True", true),
  customerId: attr.string("Customer ID"),
  testUrl: attr.url("Test URL", "https://enpage.co"),
});

export default defineConfig({
  attributes: siteAttributes,
  pages: [
    {
      label: "Home",
      path: "/",
      bricks: homePageBricks,
      tags: ["nav"],
    },
    {
      label: "About",
      path: "/about",
      bricks: homePageBricks,
      tags: ["nav"],
    },
  ],
  themes,
  datasources,
  manifest: {
    author: "John Doe",
    name: "Example Template",
    description: "Description of the template",
    homepage: "https://enpage.co",
  },
});
