# Images

In this guide, you will learn how to add images to your Enpage template.

## Adding images to your template

To add images to your Enpage template, you need to place them in the `assets` directory of your template. The `assets` directory is where you store all the static files, such as images, CSS, and fonts, that are used in your template.

Here is an example of how you can add an image to your template:

```plaintext
my-template/
  ├── assets/
  │   └── img/
  │       └── my-image.jpg
  ├── enpage.config.js
  ├── index.html
  └── src/
```

In this example, we have created an `img` directory inside the `assets` directory and placed an image file called `my-image.jpg` inside it.

To use the image in your template, you can reference it in your HTML file like this:

::: code-group
```html [index.html]
<!-- Reference images using relative paths -->
<img src="./assets/images/my-image.jpg" alt="My Image">
```

:::
