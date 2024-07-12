# Using Javascript / Typescript

Use JavaScript (and/or Typescript) to add interactivity to your templates.

## Adding JavaScript files

1. Place JavaScript/Typescript files in the `src/` directory.

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
  <!-- Now that it is supported in all modern browsers,
       we strongly advise you to use javascript modules  -->
  <script type="module" src="src/script.js"></script>
  <script type="module" src="src/my-typescript-file.ts"></script>
</head>
```

## Using The Enpage JavaScript API

Enpage provides a JavaScript API that you can use to interact with the Enpage platform. Use the API to get data from the platform, send data to the platform, and more. To learn more about the Enpage JavaScript API, check out the [API reference](/js-api/).
