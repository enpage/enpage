# `generic-links` Internal Data Source

This data source allows you to create a list of links that can be used in your templates.

## Schema

The schema of the `generic-links` data source is an array of objects with the following properties:

- `title` (string): The title of the link.
- `url` (string): The URL of the link.
- `icon` (string, optional): The icon of the link. Can be one of the Enpage built-in icons or an url to a custom icon (svg).


## Usage

```javascript
import { defineDataSources } from "@enpage/sdk/datasources";

export const datasources = defineDataSources({
  links: {
    name: "Links",
    provider: "generic-links",
    sampleData: [
      { title: "Enpage", url: "https://enpage.co" },
      { title: "Google", url: "https://google.com" },
      { title: "Example", url: "https://example.com", icon: "home" },
    ]
  }
});
```
