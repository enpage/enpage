# FAQ Data Source

This built-in data source allows you to create a list of frequently asked questions.

## Usage

### Add it to your `enpage.config.js` file

```javascript
import { defineDataSources } from "@enpage/sdk/datasources";

export const datasources = defineDataSources({
  // Define a data source named "myfaq" using the "faq" provider
  myfaq: {
    name: "Frequently Asked Questions",
    provider: "faq",
    sampleData: [
      { question: "What is Enpage?", answer: "Enpage is a platform that allows you to create dynamic websites and web applications using templates and data sources." },
      { question: "How do I get started with Enpage?", answer: "To get started with Enpage, sign up for an account on the Enpage website and follow the instructions to create your first project." },
      { question: "Can I use my own custom templates with Enpage?", answer: "Yes, you can create your own custom templates using HTML, CSS, and JavaScript and use them with Enpage." },
    ]
  }
});
```

## Schema

:::tip Note
The schema displayed below is for reference only. It does not need to be included in your project.
:::

```typescript
<!--@include: ../../../../packages/sdk/src/shared/datasources/internal/faq/schema.ts -->
```
