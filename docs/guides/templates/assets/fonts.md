# Fonts

You can use all fonts available on Google Fonts in your Enpage template.
To use a specific font, declare it in your configuration file `enpage.config.js`.

Here is an example of how to add a font to your template:

::: code-group

```javascript [enpage.config.js]
import { useFonts } from "@enpage/sdk/fonts";

useFonts([
  {
    family: 'Roboto',
    variants: ['400', '700'],
  },
  {
    family: 'Open Sans',
    variants: ['400', '700'],
  },
]);
```

:::

When using Tailwind, reference the font in your `tailwind.config.js` file:

::: code-group

```javascript [tailwind.config.js]
export default {
  theme: {
    extend: {
      fontFamily: {
        'heading': ['Roboto', 'sans-serif'],
      },
    },
  },
};
```

```html [index.html]
<!-- Use the generated tailwind class in your HTML file -->
<h1 class="font-heading">
  My Heading
</h1>
```

:::
