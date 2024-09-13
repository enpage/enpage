# Links Data Source

This built-in data source allows you to create a list of links that can be used in your templates.

## Provider name

Use the provider name `enpage-links` to create a list of generic links.

## Usage


### Add it to your `enpage.config.js` file

```javascript
import { defineDataSources } from "@enpage/sdk/datasources";

export const datasources = defineDataSources({
  mylinks: {
    name: "Links",
    provider: "enpage-links",
    sampleData: [
      { title: "Enpage", url: "https://enpage.co" },
      { title: "Google", url: "https://google.com" },
      { title: "Example", url: "https://example.com", icon: "home" },
    ]
  }
});
```

### Or add it to your template using the Enpage CLI

This will automatically add the data source to your `enpage.config.json` file.

::: code-group

```bash [Using npm]
npm run add-datasource enpage-links mylinks
```

```bash [Using yarn]
yarn add-datasource enpage-links mylinks
```

```bash [Using pnpm]
pnpm add-datasource enpage-links mylinks
```
:::


## Schema

:::tip Note
The schema displayed below is just for reference. You don't need to include it in your project.
:::


```typescript
<!--@include: ../../../../packages/sdk/src/shared/datasources/internal/links/schema.ts -->
```
