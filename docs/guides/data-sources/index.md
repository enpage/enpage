# Data Sources

Data Sources are the source of data for the templates. We can distinguish 2 types of data sources:

- **Internal**: Holds data that is managed and edited within the Enpage Editor by the site owner.
- **External**:  Holds data that comes from external sources, such as Social Media websites or APIs. They can be fetched manualy or refreshed automatically at a regular interval.

Enpage provides [built-in data sources](./built-in/) (internal & external) that you can use with minimal configuration.
You can also define your own custom data sources, which can be internal or external.

Data Sources are defined in the `enpage.config.js` file using the `defineDataSources()` function.
All data sources have a schema associated with them. The schema is used to validate the data before using it in the template.


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

In this example, we define an Internal Data Source that will be used in the template as a list of people.

:::tip
In the example below, we use the helper object `ds` to facilitate the declaration of the Data Source JSON schema.
This helper directly binds the `@sinclair/typebox` library.
See the [typebox documentation](https://github.com/sinclairzx81/typebox) for more information.
:::


::: code-group

```javascript [enpage.config.js]
import { defineDataSources, ds } from "@enpage/sdk/datasources";

// Define an internal data source that will be used
// in the template as a list of links
export const datasources = defineDataSources({
  links: {
    // Label of the data source that will be displayed in the Enpage Editor
    name: "People",
    // Schema of the data source (using zod)
    schema: ds.Array(
      ds.Object({
        firstName: ds.String(),
        lastName: ds.String(),
        rank: ds.Optional(ds.Number()),
      }),
    ),
    // Sample data that will be used during development
    // or when the template is first loaded in the Enpage Editor
    sampleData: [
      { firstName: "John", lastName: "Doe", rank: 1 },
      { firstName: "Jane", lastName: "Smith", rank: 2 },
      { firstName: "Alice", lastName: "Brown" },
    ]
  }
});
```

:::

## External Data Sources


Enpage provides a large range of built-in External Data Sources that you can use with minimal configuration (such as Youtube, Twitter, Instagram, etc.).
The complete list can be found [here](./built-in/).

### Example of External Data Sources

#### `youtube-feed` Data Source

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
    // sampleData is optional, if not provided, a default sample data will be used
  }
});
```

:::

#### `http-json` Data Source for fetching data from an API

::: code-group

```javascript [enpage.config.js]
import { defineDataSources, ds } from "@enpage/sdk/datasources";

// Define an external data source that will be used
// in the template as a list of posts
export const datasources = defineDataSources({
  posts: {
    // Label of the data source that will be displayed in the Enpage Editor
    name: "My Posts",
    provider: "http-json",
    options: {
      // URL of the API
      url: "https://api.example.com/blogs/{{ attr.blogId }}/posts",
      // HTTP headers
      headers: {
        Authorization: "Bearer {{ attr.authToken }}"
      }
    },
    // (Optional) JSON schema of the data source (here declared using Typebox)
    // When providibg a schema, Enpage will validate the data
    // before using it in the template. If the data does not match
    // the schema, an error will be displayed in the Enpage Editor.
    // This is useful to prevent errors when the API changes.
    // So it's recommended to define the schema.
    schema: ds.Array(
      ds.Object({
        title: ds.String(),
        body: ds.String(),
      }),
    ),
  },
});
```

:::

> [!TIP]
> You can reference the attributes of the template in the the `url` and `headers` properties.
This way, you can pass dynamic values to your API and have the site owner configure them in the Enpage Editor.
Use the notation <code v-pre>{{ attr.attributeName }}</code> to reference an attribute.
