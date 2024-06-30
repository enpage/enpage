# Javascript

In Enpage, you can use JavaScript to add interactivity to your templates. You can use JavaScript to create animations, handle user interactions, and more.

## Adding JavaScript files

To add JavaScript files to your template, you can create a new JavaScript file in the `src` directory of your template. Here is an example of how you can add one or more JavaScript files to your template:

```plaintext
my-template/
  ├── assets/
  ├── enpage.config.js
  ├── index.html
  ├── src/
  │   └── script.js
```

In this example, we have created a `src` directory inside the root directory of the template and placed a JavaScript file called `script.js` inside it.

To include the JavaScript file in your template, you can reference it in your HTML file like this:

```html
<!-- Reference JavaScript files in the <head> -->
<head>
  <!-- It is advised to use javascript modules now that it is
       supported in all modern browsers -->
  <script type="module" src="src/script.js"></script>
</head>
```

::: warning Use relative paths
Make sure to use relatives paths when referencing JavaScript files in your HTML. In the previous example, the JavaScript file is located in the `src` directory, so the path will be `src/script.js` or even `./src/script.js`.
:::


## Using The Enpage JavaScript API

Enpage provides a JavaScript API that you can use to interact with the Enpage platform. You can use the API to get data from the platform, send data to the platform, and more. To learn more about the Enpage JavaScript API, check out the [API reference](/enpage-api).
