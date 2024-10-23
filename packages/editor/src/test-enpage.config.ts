// @ts-check
import { defineDataSources, ds } from "@enpage/sdk/datasources";
import { defineAttributes, attr } from "@enpage/sdk/attributes";
import { defineManifest } from "@enpage/sdk/manifest";
import { defineContainers } from "@enpage/sdk/bricks";

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
  sidebarPosition: attr.enum("Sidebar Position", "left", {
    options: ["left", "right"],
  }),
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

export const containers = defineContainers([
  {
    type: "container",
    bricks: [
      {
        type: "image",
        props: {
          src: "https://cdn.enpage.co/enpage.svg",
          className: "max-h-24",
        },
      },
    ],
  },
  {
    type: "container",
    bricks: [
      {
        type: "hero",
        props: {
          content: "Build your launch page",
          justify: "text-center font-humanist",
        },
        wrapper: { baseClasses: "primary-5", customClasses: "tertiary-5" },
      },
    ],
  },
  {
    type: "container",
    bricks: [
      {
        type: "text",
        props: {
          content:
            "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus ornare justo lectus, vel placerat arcu vulputate scelerisque. Donec eget eros pellentesque, facilisis massa id, aliquam nisl. Suspendisse auctor ipsum vitae volutpat cursus. Donec vehicula urna felis, feugiat iaculis metus luctus varius. Nam sed pretium nulla.",
          justify: "text-center",
          format: "html",
        },
        wrapper: { customClasses: "secondary-2" },
      },
    ],
  },
  {
    type: "container",
    bricks: [
      {
        type: "text-with-title",
        props: { title: "My title", content: "Hey there!" },
        wrapper: { customClasses: "brick-light-primary" },
        position: {
          colStart: 1,
          colEnd: 5,
        },
      },
      { type: "text", props: { content: "Something" }, wrapper: { customClasses: "brick-primary" } },
    ],
  },
  {
    type: "container",
    bricks: [
      {
        type: "text",
        props: {
          content: "First",
        },
        wrapper: {
          customClasses: "primary-1",
        },
        position: {
          colStart: 1,
          colEnd: 2,
        },
      },
      {
        type: "text",
        props: { content: "Second" },
        position: {
          colStart: 2,
          colEnd: 3,
        },
        wrapper: {
          customClasses: "primary-2",
        },
      },
      {
        type: "text",
        props: { content: "Third" },
        position: {
          colStart: 3,
          colEnd: 4,
        },
        wrapper: {
          customClasses: "primary-3",
        },
      },
      {
        type: "text",
        props: { content: "Third" },
        position: {
          colStart: 4,
          colEnd: 5,
        },
        wrapper: {
          customClasses: "primary-4",
        },
      },
      {
        type: "text",
        props: { content: "4th" },
        position: {
          colStart: 5,
          colEnd: 6,
        },
        wrapper: {
          customClasses: "primary-5",
        },
      },
      {
        type: "text",
        props: { content: "5th" },
        position: {
          colStart: 6,
          colEnd: 7,
        },
        wrapper: {
          customClasses: "primary-6",
        },
      },
      {
        type: "text",
        props: { content: "6th" },
        position: {
          colStart: 7,
          colEnd: 8,
        },
        wrapper: {
          customClasses: "primary-7",
        },
      },
      {
        type: "text",
        props: { content: "7th" },
        position: {
          colStart: 8,
          colEnd: 9,
        },
        wrapper: {
          customClasses: "primary-8",
        },
      },
      {
        type: "text",
        props: { content: "8th" },
        position: {
          colStart: 9,
          colEnd: 10,
        },
        wrapper: {
          customClasses: "primary-9",
        },
      },
    ],
  },
  // {
  //   type: "container",
  //   variant: "1-1-1",
  //   bricks: [
  //     {
  //       type: "text",
  //       props: { content: "Sample here" },
  //       wrapper: { customClasses: "brick-light-red" },
  //     },
  //     { type: "text", props: { content: "Hello World" }, wrapper: { customClasses: "brick-normal-red" } },
  //     { type: "text", props: { content: "Blabla" }, wrapper: { customClasses: "brick-dark-red" } },
  //   ],
  // },
  // {
  //   type: "container",
  //   variant: "1-1-1-1",
  //   bricks: [
  //     { type: "text", props: { content: "Sample here" } },
  //     { type: "text", props: { content: "Hello World" } },
  //     { type: "text", props: { content: "Blabla" } },
  //     { type: "text", props: { content: "Blabla 2" } },
  //   ],
  // },
]);
