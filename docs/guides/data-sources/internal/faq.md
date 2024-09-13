# FAQ Data Source

This built-in data source allows you to create a list of frequently asked questions.

## Provider name

Use the provider name `enpage-faq` to create a list of generic links.


## Usage

### Add it to your `enpage.config.js` file

```javascript
import { defineDataSources } from "@enpage/sdk/datasources";

export const datasources = defineDataSources({
  myfaq: {
    name: "Frequently Asked Questions",
    provider: "enpage-faq",
    sampleData: [
      { question: "What is Enpage?", answer: "Enpage is a platform that allows you to create dynamic websites and web applications using templates and data sources." },
      { question: "How do I get started with Enpage?", answer: "To get started with Enpage, sign up for an account on the Enpage website and follow the instructions to create your first project." },
      { question: "Can I use my own custom templates with Enpage?", answer: "Yes, you can create your own custom templates using HTML, CSS, and JavaScript and use them with Enpage." },
    ]
  }
});
```

### Or add it to your template using the Enpage CLI

This will automatically add the data source to your `enpage.config.json` file.

::: code-group

```bash [Using npm]
npm run add-datasource enpage-faq myfaq
```

```bash [Using yarn]
yarn add-datasource enpage-faq myfaq
```

```bash [Using pnpm]
pnpm add-datasource enpage-faq myfaq
```
:::


## Schema

:::tip Note
The schema displayed below is just for reference. You don't need to include it in your project.
:::

```typescript
<!--@include: ../../../../packages/sdk/src/shared/datasources/internal/faq/schema.ts -->
```
