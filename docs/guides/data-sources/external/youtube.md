# Youtube Data Source

The Youtube data source allows you to fetch information about a Youtube video or playlist.

## Youtube Video Data Source

Used to display a single video from Youtube.

::: code-group

```javascript [enpage.config.js]
import { defineDataSources } from "@enpage/sdk/datasources";

// Define an external data source that will be used
// in the template as a list of videos
export const datasources = defineDataSources({
  mainVideo: {
    // Label of the data source that will be displayed in the Upstart Editor
    name: "Homepage Video",
    // use the built-in youtube-video provider
    provider: "youtube-video"
  }
});
```

:::

## Youtube Playlist Data Source

Used to display a list of videos from a Youtube playlist.

::: code-group

```javascript [enpage.config.js]
import { defineDataSources } from "@enpage/sdk/datasources";

// Define an external data source that will be used
// in the template as a list of videos
export const datasources = defineDataSources({
  videos: {
    // Label of the data source that will be displayed in the Upstart Editor
    name: "My Videos",
    // use the built-in youtube-playlist provider
    provider: "youtube-playlist"
  }
});
```
:::


