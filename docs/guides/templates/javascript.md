# Using Javascript / Typescript

In Enpage, you can use JavaScript (and/or Typescript) to add interactivity to your templates.

## Adding JavaScript files

1. Put your JavaScript/Typescript files in the `src/` directory of your template.

```plaintext
my-template/
  ├── assets/
  ├── enpage.config.js
  ├── index.html
  ├── src/
  |   ├── my-typescript-file.ts
  │   └── script.js

```

2. Simply reference your files in the `<head>` of your `index.html` file.

```html
<!-- Reference JavaScript files in the <head> -->
<head>
  <!-- It is advised to use javascript modules now that it is
       supported in all modern browsers -->
  <script type="module" src="src/script.js"></script>
  <script type="module" src="src/my-typescript-file.ts"></script>
</head>
```

## Using The Enpage JavaScript API

Enpage provides a JavaScript API that you can use to interact with the Enpage platform. You can use the API to get data from the platform, send data to the platform, and more. To learn more about the Enpage JavaScript API, check out the [API reference](/js-api/).
