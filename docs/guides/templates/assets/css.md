# CSS

Tailwind CSS is recommended for styling, and bundled by default. You can customize the tailwind theme by editing the `tailwind.config.js` file.

If you don't want to use Tailwind CSS, you can simply remove the `tailwind.config.js` and it will be automatically disabled.

## Adding custom CSS

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

```html
<!-- Reference CSS files in the head -->
<head>
  <link rel="stylesheet" href="assets/css/styles.css">
</head>
```

::: warning Use relative paths
Make sure to use relatives paths when referencing CSS files in your HTML. In the previous example, the CSS file is located in the `assets/css` directory, so the path will be `assets/css/styles.css` or even `./assets/css/styles.css`.

But **do not** use absolute paths like `/assets/css/styles.css`.
:::
