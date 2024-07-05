# Loops

`for` loops allow you to iterate over a list of items and render them in your template.

## Syntax

`for` loops can appear in two forms:
- Inside the HTML attribute `data-for`
- Inside `<template>` tags

Both syntaxes are valid and can be used interchangeably.

### Usage inside the `data-for` attribute

The `data-for` attribute can be used to loop through a list of items and render them.

::: warning Important
- Datasources are directly accessible in the template using the `data` object.
- All children of an element using the `data-for` attribute are evaluated by Liquid. There is **no need** to use the `data-template` attribute inside the children.
:::



::: code-group
```liquid [index.html]
<!DOCTYPE html>
<html>
  <body>
    <ul>
      <!--
      Loop through the list of links an repeat the <li> element
      -->
      <li class="flex items-center gap-3" data-for="link in data.links">
        <a class="flex-1 p-2.5" href="{{ link.url }}">{{ link.title }}</a>
      </li>
    <ul>
</body>
</html>
```


### Usage inside `<template>` tags

You can also loop through your Data Sources using the `{% for %}` tag.

::: warning Important
- The `{% for %}` tag **must** be enclosed in a `<template>` tag.
- Datasources are directly accessible in the template using the `data` object.
- Inside `<template>` tags, all Liquid expressions are evaluated. There is **no need** to use the `data-template` attribute inside any children.
:::


::: code-group
```liquid [index.html]
<!DOCTYPE html>
<html>
  <body>
    <!--
     Loop through the list of links
     /!\ IMPORTANT: The for loop must be enclosed in a <template> tag!
     -->
    <template>
      {% for link in data.links %}
        <li class="flex items-center gap-3">
          <a class="flex-1 p-2.5" href="{{ link.url }}">{{ link.title }}</a>
        </li>
      {% endfor %}
    <template>
</body>
</html>
```

```javascript [enpage.config.js]
import z from "zod";
import { defineDataSources } from "@enpage/sdk/datasources";

// Define an internal data source that will be used
// in the template as a list of links
export const datasources = defineDataSources({
  links: {
    // Label of the data source that will be displayed in the Enpage Editor
    name: "Links",
    // Schema of the data source (using zod)
    schema: z.array(
      z.object({
        title: z.string(),
        url: z.string().url(),
        icon: z.string().optional(),
      }),
    ),
    // Sample data that will be used during development
    // or when first loaded in the Enpage Editor
    sampleData: [
      { title: "Enpage", url: "https://enpage.co" },
      { title: "Google", url: "https://google.com" },
      { title: "Benj", url: "https://google.com" }
    ]
  }
});
```
:::
