# CSV Data Source

Use the `csv` data source to fetch data from a CSV file.

## Usage

### Add it to your `enpage.config.js` file

```javascript
import { defineDataSources } from "@enpage/sdk/datasources";

export const datasources = defineDataSources({
  // Define a data source named "products" using the "csv" provider
  products: {
    name: "Products",
    provider: "csv"
  }
  //...
});
```

## Schema

:::tip Note
There is no predefined schema for the `csv` data source. You can define your own schema based on the JSON structure returned by the API.
:::

