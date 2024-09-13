# Mastodon Status Data Source

The Mastodon status data source allows you to fetch information about a Mastodon status updates from a public Mastodon user.


## Usage

### Add it to your `enpage.config.js` file

```javascript
import { defineDataSources } from "@enpage/sdk/datasources";

export const datasources = defineDataSources({
  // Define a data source named "mystatuses" using the "mastodon-statuses" provider
  mystatuses: {
    name: "Mastodon Statuses",
    provider: "mastodon-statuses",
    options: {
      // Mastodon instance URL
      username: "mastodon.social",
      // Number of statuses to fetch
      limit: 10
    }
  }
});
```

## Schema

:::tip Note
The schema displayed below is for reference only. It does not need to be included in your project.
:::

<<< @../../packages/sdk/src/shared/datasources/mastodon/status/schema.ts
