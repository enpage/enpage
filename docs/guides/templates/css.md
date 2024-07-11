# Styling your template

Enpage's styling system is designed to offer maximum flexibility to template designers while providing intuitive customization options for site owners within the Enpage Web Editor.


## Use Tailwind CSS (or not!)

Tailwind CSS is recommended for styling, and bundled by default. You can customize the tailwind theme by editing the `tailwind.config.js` file, and you can use [Tailwind functions and directives](https://tailwindcss.com/docs/functions-and-directives) in your css files.
Then simply use tailwind utilities in your HTML files to style your template.

::: code-group
```html [index.html]
<!-- Use Tailwind CSS utilities to style your template -->
<div class="bg-gray-100 text-gray-800 p-4">
  <h1 class="text-2xl font-bold">Hello, world!</h1>
  <p class="mt-2">This
    <a href="#" class="text-blue-500 hover:underline">is a link</a>
  </p>
</div>
```
:::

::: tip Disable Tailwind CSS
**If you prefer not to use Tailwind CSS**, you can simply remove the `tailwind.config.js` and it will be automatically disabled.
:::

## Using CSS files to your template

You can also use external CSS files to style your template. Simply put your CSS files in the `assets` directory:

```plaintext
my-template/
  ├── assets/
  │   └── css/
  │       └── styles.css
  ├── enpage.config.js
  ├── index.html
  └── src/
```

To include the CSS file in your template, you can reference it in your HTML file like this:

::: code-group
```html [index.html]
<!-- Reference CSS files in your template -->
<head>
  <link rel="stylesheet" href="assets/css/styles.css">
</head>
```
:::

::: warning Use relative paths
Make sure to use relatives paths when referencing CSS files in your HTML.
:::



## Customization

The Enpage Editor allows users to customize the template by changing colors, fonts, and other styles.

By default, all the following properties are customizable by the site owner:
- **Colors** (background, text, links, etc.)
- **Fonts** (font-family, font-size, font-weight, etc.)
- **Opacity** (opacity)
- **Transform** (transform, rotate, scale, etc.)
- **Animation** (animation, transition, etc.)
- **Direction** (text-align, flex-direction, etc.)
- **Borders** (border-radius, border-width, border-color, etc.)
- **Shadows** (box-shadow)


:::tip Specific properties
The following properties are customizable by the site owner only if you enable it in your template through data attributes:

- **Spacing** (padding, margin, etc.)
- **Sizes** (width, height, etc.)


You can enable those specific cutomizations by adding the following data attributes to your HTML elements:
- `ep-allow-custom-spacing`
- `ep-allow-custom-sizes`
:::

### Pseudo components

:::tip Why Pseudo components?
We call "pseudo components" elements that share the same styles across multiple elements. Not to be
confused with real components like in React, pseudo components are useful for creating consistent styles and reducing duplication in your template, while allowing site owners to customize the styles of all elements at once.
They share only styles, not behavior.
:::

We recommend using pseudo components for reusable elements like cards, buttons, or sections.

Simply use the `ep-component` attribute to define a pseudo component.

::: code-group
```html [index.html]
<!-- A pseudo component -->
<div ep-component="card">I'm a card</div>
<div ep-component="card">I'm a second card</div>
[...]
<div ep-component="card">I'm a third card</div>
```

```css [styles.css]
/* Styles for the card component */
[ep-component="card"] {
  background-color: white;
  border: 1px solid #e2e8f0;
  border-radius: 4px;
  margin-bottom: 1rem;
  /* Use Tailwind CSS utilities */
  @apply shadow-md p-6;
}
```
:::

When encountering a pseudo component in the Enpage Editor, the site owner will be able to customize the styles of all elements with the same `ep-component` attribute at once.

## General styling guidelines

When styling your template, there are a few things to keep in mind to ensure that your template looks good and works well on all devices:

### Responsive design

Make sure that your template is responsive and looks good on all devices, including desktops, tablets, and mobile phones. You can use Tailwind CSS utilities like `sm:`, `md:`, `lg:`, and `xl:` to create responsive designs.

### Accessibility

Ensure that your template is accessible to all users, including those with disabilities. Use semantic HTML elements, provide alt text for images, and make sure that your template is navigable using a keyboard.

### Avoid using !important

Avoid using `!important` in your CSS. Instead, use more specific selectors or refactor your CSS to avoid conflicts. It's important to keep the CSS specificity low to allow users to customize the template easily.
