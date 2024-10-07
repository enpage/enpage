import { defineDataSources, ds } from "@enpage/sdk/datasources";
import { defineAttributes, attr } from "@enpage/sdk/attributes";
import { defineManifest } from "@enpage/sdk/manifest";
import { defineBricks } from "@enpage/sdk/bricks";

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

export const bricks = defineBricks([
  {
    type: "container",
    variant: "full",
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
    variant: "full",
    bricks: [
      {
        type: "hero",
        props: {
          content: "The best way to go to India",
          justify: "text-center",
        },
      },
    ],
  },
  {
    type: "container",
    variant: "full",
    bricks: [
      {
        type: "text",
        props: {
          content:
            "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus ornare justo lectus, vel placerat arcu vulputate scelerisque. Donec eget eros pellentesque, facilisis massa id, aliquam nisl. Suspendisse auctor ipsum vitae volutpat cursus. Donec vehicula urna felis, feugiat iaculis metus luctus varius. Nam sed pretium nulla.",
          justify: "text-center",
        },
        wrapper: { customClasses: "brick-pink" },
      },
    ],
  },
  {
    type: "container",
    variant: "2-1",
    bricks: [
      {
        type: "text-with-title",
        props: { title: "My title", content: "Hey there!" },
        wrapper: { customClasses: "brick-light-primary" },
      },
      { type: "text", props: { content: "Something" }, wrapper: { customClasses: "brick-primary" } },
    ],
  },
  {
    type: "container",
    variant: "1-2",
    bricks: [
      {
        type: "image",
        props: {
          className: "min-h-24",
        },
      },
      { type: "text", props: { content: "Joe joe" } },
    ],
  },
  {
    type: "container",
    variant: "1-1-1",
    bricks: [
      {
        type: "text",
        props: { content: "Sample here" },
        wrapper: { customClasses: "brick-light-red" },
      },
      { type: "text", props: { content: "Hello World" }, wrapper: { customClasses: "brick-normal-red" } },
      { type: "text", props: { content: "Blabla" }, wrapper: { customClasses: "brick-dark-red" } },
    ],
  },
  {
    type: "container",
    variant: "1-1-1-1",
    bricks: [
      { type: "text", props: { content: "Sample here" } },
      { type: "text", props: { content: "Hello World" } },
      { type: "text", props: { content: "Blabla" } },
      { type: "text", props: { content: "Blabla 2" } },
    ],
  },
]);
