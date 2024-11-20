// @ts-check
import { defineDataSources, ds } from "@enpage/sdk/datasources";
import { defineAttributes, attr } from "@enpage/sdk/attributes";
import { defineManifest } from "@enpage/sdk/manifest";
import { defineBricks, createRow } from "@enpage/sdk/bricks";
import { definePages } from "@enpage/sdk/page";

// define your datasources
export const datasources = defineDataSources({
  links: {
    name: "Links",
    schema: ds.Array(
      ds.Object({
        title: ds.String(),
        url: ds.String({ format: "uri", pattern: "^https?://" }),
        icon: ds.Optional(ds.String()),
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
    schema: ds.Array(
      ds.Object({
        id: ds.Number(),
        userId: ds.Number(),
        title: ds.String(),
        completed: ds.Boolean(),
      }),
    ),
  },
  posts: {
    name: "Posts",
    provider: "facebook-posts",
    options: {
      limit: 5,
      nextRefreshDelay: 60 * 60 * 1000,
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

// define your attributes
export const attributes = defineAttributes({
  mainButtonUrl: attr.url("Main Button URL", "https://facebook.com"),
  testBoolTrue: attr.boolean("Test Bool True", true),
  customerId: attr.string("Customer ID"),
  testUrl: attr.url("Test URL", "https://enpage.co"),
});

// // template information
// export const info = {
//   name: "Example Template",
//   description: "Description of the template",
//   author: "John Doe",
//   homepage: "https://enpage.co",
// };

// various settings
export const manifest = defineManifest({
  author: "John Doe",
  name: "Example Template",
  description: "Description of the template",
  homepage: "https://enpage.co",
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
          minW: 7,
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
          y: 4,
          w: "full",
          h: 3,
        },
        desktop: {
          x: "third",
          y: 4,
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
          y: 4,
          w: "third",
          h: 3,
        },
      },
    },
  ]),
]);

export const pages = definePages([
  {
    label: "Home",
    path: "/",
    bricks: homePageBricks,
  },
]);
