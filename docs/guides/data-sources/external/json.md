# JSON Data Source

The `json` data source can be used to fetch data from a JSON endpoint/API.

## Usage

### Add it to your `enpage.config.js` file

> [!TIP]
> You can reference the attributes of the template in the the `url` and `headers` properties.
This way, you can pass dynamic values to your API and have the site owner configure them in the Upstart Editor.
Use the notation <code v-pre>{{ attr.attributeName }}</code> to reference an attribute.

```javascript
import { defineDataSources, ds } from "@enpage/sdk/datasources";

export const datasources = defineDataSources({
  // Define a data source named "todos" using the "json" provider
  todos: {
    name: "Todo API",
    provider: "json",
    options: {
      // URL of the API
      url: "https://api.example.com/todos",
      // HTTP headers
      headers: {
        // Here you can use attributes from the template
        Authorization: "Bearer {{ attr.authToken }}"
      }
    },
    // (Optional) JSON schema of the data source (here declared using Typebox)
    schema: ds.Array(
      ds.Object({
        id: ds.Number(),
        title: ds.String(),
        completed: ds.Boolean(),
      }),
    ),
  }
});
```

## Schema

:::tip Note
There is no predefined schema for the `json` data source. You can define your own schema based on the JSON structure returned by the API.
:::


