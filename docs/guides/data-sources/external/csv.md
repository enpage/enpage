# CSV Source

Use the `csv` data source to fetch data from a CSV file.

## Usage

### Add it to your `enpage.config.js` file

```javascript
import { defineDataSources } from "@enpage/sdk/datasources";

export const datasources = defineDataSources({
  // Define a data source named "myfeed" using the "rss" provider
  myfeed: {
    name: "Products",
    provider: "csv"
  }
  //...
});
```

## Schema

:::tip Note
The schema displayed below is for reference only. It does not need to be included in your project.
:::

<<< @../../packages/sdk/src/shared/datasources/rss/schema.ts
