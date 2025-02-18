# RSS / Atom Data Source

Use the `rss` data source to fetch data from an RSS or Atom feed.

## Usage

### Add it to your `enpage.config.js` file

```javascript
import { defineDataSources } from "@upstart.gg/sdk/datasources";

export const datasources = defineDataSources({
  // Define a data source named "myfeed" using the "rss" provider
  myfeed: {
    name: "News Feed",
    provider: "rss"
  }
  //...
});
```

## Schema

:::tip Note
The schema displayed below is for reference only. It does not need to be included in your project.
:::

<<< @../../packages/sdk/src/shared/datasources/external/rss/schema.ts
