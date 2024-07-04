# CSS

Tailwind CSS is recommended for styling, and bundled by default. You can customize the tailwind theme by editing the `tailwind.config.js` file, and you can use [Tailwind functions and directives](https://tailwindcss.com/docs/functions-and-directives) in your css files.

If you don't want to use Tailwind CSS, you can simply remove the `tailwind.config.js` and it will be automatically disabled.

## Adding CSS files to your template

To add custom CSS to your template, you can create a new CSS file in the `assets` directory of your template. Here is an example of how you can add one or more CSS files to your template:

```plaintext
my-template/
  ├── assets/
  │   └── css/
  │       └── styles.css
  ├── enpage.config.js
  ├── index.html
  └── src/
```

In this example, we have created a `css` directory inside the `assets` directory and placed a CSS file called `styles.css` inside it.

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
Make sure to use relatives paths when referencing CSS files in your HTML. In the previous example, the CSS file is located in the `assets/css` directory, so the path will be `assets/css/styles.css` or even `./assets/css/styles.css`. **Do not** use absolute paths like `/assets/css/styles.css`.
:::


## General styling guidelines

When styling your template, there are a few things to keep in mind to ensure that your template looks good and works well on all devices:

### Responsive design

Make sure that your template is responsive and looks good on all devices, including desktops, tablets, and mobile phones. You can use Tailwind CSS utilities like `sm:`, `md:`, `lg:`, and `xl:` to create responsive designs.

### Accessibility

Ensure that your template is accessible to all users, including those with disabilities. Use semantic HTML elements, provide alt text for images, and make sure that your template is navigable using a keyboard.

### Customization

The Enpage Editor allows users to customize the template by changing colors, fonts, and other styles.

By default, all the following properties are customizable by the site owner:
- Colors (background, text, links, etc.)
- Fonts (font-family, font-size, font-weight, etc.)
- Opacity (opacity)
- Transform (transform, rotate, scale, etc.)
- Animation (animation, transition, etc.)
- Direction (text-align, flex-direction, etc.)
- Borders (border-radius, border-width, border-color, etc.)
- Shadows (box-shadow)

The following properties are only customizable by the site owner if you enable it in your template through data attributes:

- Spacing (padding, margin, etc.)
- Sizes (width, height, etc.)


You can enable those specific cutomizations by adding the following data attributes to your HTML elements:
- `data-allow-custom-spacing`
- `data-allow-custom-sizes`


::: warning Avoid using !important
Avoid using `!important` in your CSS styles. Instead, use more specific selectors or refactor your CSS to avoid conflicts. It's important to keep the CSS specificity low to allow users to customize the template easily.
:::
