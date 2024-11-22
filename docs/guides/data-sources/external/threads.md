# Threads Media Data Source

Use the `threads-media` data source to fetch media from a Threads public account.


## Usage

### Add it to your `enpage.config.js` file

```javascript
import { defineDataSources } from "@upstart.gg/sdk/datasources";

export const datasources = defineDataSources({
  // Define a data source named "mymedia" using the "threads-media" provider
  mymedia: {
    // Label of the data source that will be displayed in the Upstart Editor
    name: "Threads Media",
    // use the "threads-media" provider
    provider: "threads-media",
    options: {
      // Number of media items to fetch
      limit: 10
    }
  }
});
```


## Schema

:::tip Note
The schema displayed below is for reference only. It does not need to be included in your project.
:::

<<< @../../packages/sdk/src/shared/datasources/external/threads/media/schema.ts
