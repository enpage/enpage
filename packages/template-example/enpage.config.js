// @ts-check
import { defineDataSources, ds } from "@enpage/sdk/datasources";
import { defineAttributes, attr } from "@enpage/sdk/attributes";
import { defineManifest } from "@enpage/sdk/manifest";

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
    provider: "http-json",
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
  videos: {
    provider: "youtube-feed",
    name: "My Videos",
  },
});

// define your attributes
export const attributes = defineAttributes({
  // title: attr.text("Title", {}),
  mainButtonUrl: attr.url("Main Button URL", "https://facebook.com"),
  testBoolTrue: attr.boolean("Test Bool True", true),
  customerId: attr.text("Customer ID"),
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
