# Data Sources

Data Sources are the source of data for the templates. We can distinguish 2 types of data sources:

- **Internal**: Holds data that is managed and edited within the Enpage Editor by the site owner.
- **External**:  Holds data that comes from external sources, such as Social Media websites or APIs. They can be fetched manualy or refreshed automatically at a regular interval.

For both types of data sources, Enpage provides you with [built-in data sources](./built-in/) that you can use without any additional configuration.

You can also define your own *custom* data sources, being internal or external.

Data Sources are defined in the `enpage.config.js` file using the `defineDataSources()` function.
You can define as many data sources as you want.


## Internal Data Sources

### Using a Built-In Internal Data Source

::: code-group

```javascript [enpage.config.js]
import { defineDataSources } from "@enpage/sdk/datasources";

// Define an internal data source that will be used
// in the template as a list of links
export const datasources = defineDataSources({
  links: {
    // Label of the data source that will be displayed in the Enpage Editor
    name: "Links",
    // use the built-in "generic-links" provider
    provider: "generic-links"
  }
});
```
:::

### Using a Custom Internal Data Source

::: code-group

```javascript [enpage.config.js]
import z from "zod";
import { defineDataSources } from "@enpage/sdk/datasources";

// Define an internal data source that will be used
// in the template as a list of links
export const datasources = defineDataSources({
  links: {
    // Label of the data source that will be displayed in the Enpage Editor
    name: "Links",
    // Schema of the data source (using zod)
    schema: z.array(
      z.object({
        title: z.string(),
        url: z.string().url(),
        icon: z.string().optional(),
      }),
    ),
    // Sample data that will be used during development
    // or when first loaded in the Enpage Editor
    sampleData: [
      { title: "Enpage", url: "https://enpage.co" },
      { title: "Google", url: "https://google.com" },
      { title: "Benj", url: "https://google.com" }
    ]
  }
});
```
:::


## External Data Sources

There are 2 types of external data sources:
- **Built-in**: These are data sources that are built-in Enpage and can be used without any additional configuration. (such as Youtube, Twitter, Instagram, etc.)
- **Custom**: These are data sources that are not built-in Enpage and require additional configuration. (such as custom APIs)


### Using a Build-In External Data Source

::: code-group

```javascript [enpage.config.js]
import { defineDataSources } from "@enpage/sdk/datasources";

// Define an external data source that will be used
// in the template as a list of videos
export const datasources = defineDataSources({
  videos: {
    // Label of the data source that will be displayed in the Enpage Editor
    name: "My Videos",
    // use the built-in youtube-feed provider
    provider: "youtube-feed"
  }
});
```
:::

### Using a Custom External Data Source

::: code-group

```javascript [enpage.config.js]
import z from "zod";
import { defineDataSources } from "@enpage/sdk/datasources";

// Define an external data source that will be used
// in the template as a list of posts
export const datasources = defineDataSources({
  posts: {
    // Label of the data source that will be displayed in the Enpage Editor
    name: "My Posts",
    // use a custom provider
    provider: {
      type: "custom",
      // URL of the API
      url: "https://api.example.com/blogs/{{ attributes.blogId }}/posts",
      // HTTP headers
      headers: {
        Authorization: "Bearer {{ attributes.authToken }}"
      },
      // (Optional) schema of the data source (using zod)
      // When providibg a schema, Enpage will validate the data
      // before using it in the template. If the data does not match
      // the schema, an error will be displayed in the Enpage Editor.
      // This is useful to prevent errors when the API changes.
      // So it's recommended to define the schema.
      schema: z.array(
        z.object({
          title: z.string(),
          body: z.string(),
        }),
      ),
    },
  },
});
```
:::


> [!TIP]
> You can reference the attributes of the template in the the `url` and `headers` properties. This way, you can pass dynamic values to your API and have the site owner configure them in the Enpage Editor.
Use the notation <code v-pre>{{ attributes.attributeName }}</code> to reference an attribute.



