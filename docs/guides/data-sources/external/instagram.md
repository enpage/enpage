# Instagram Data Source

The Instagram data source allows you to fetch photos and videos from a public Instagram accounts or hashtags.

## Instagram Feed

### Usage

Add the `instagram-feed` data source to your `enpage.config.js` file.

```javascript
import { defineDataSources } from "@enpage/sdk/datasources";

export const datasources = defineDataSources({
  // Define a data source named "myfeed" using the "instagram-feed" provider
  myfeed: {
    name: "Instagram Feed",
    provider: "instagram-feed",
    options: {
      // Instagram username or hashtag
      username: "enpage.co",
      // Number of posts to fetch
      limit: 10
    }
  }
});
```

### Schema

:::tip Note
The schema displayed below is for reference only. It does not need to be included in your project.
:::

<<< @../../packages/sdk/src/shared/datasources/instagram/feed/schema.ts
