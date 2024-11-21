# Links Data Source

This built-in data source allows you to create a list of links that can be used in your templates.

## Usage


### Add it to your `enpage.config.js` file

```javascript
import { defineDataSources } from "@enpage/sdk/datasources";

export const datasources = defineDataSources({
  // Define a data source named "mylinks" using the "links" provider
  mylinks: {
    // Label of the data source that will be displayed in the Upstart Editor
    name: "Links",
    // use the built-in "links" provider
    provider: "links",
    // Sample data that will be used during development
    // or when the template is first loaded in the Upstart Editor
    sampleData: [
      { title: "Enpage", url: "https://enpage.co" },
      { title: "Google", url: "https://google.com" },
      { title: "Example", url: "https://example.com", icon: "home" },
    ]
  }
});
```

## Schema

:::tip Note
The schema displayed below is for reference only. It does not need to be included in your project.
:::


```typescript
<!--@include: ../../../../packages/sdk/src/shared/datasources/internal/links/schema.ts -->
```
