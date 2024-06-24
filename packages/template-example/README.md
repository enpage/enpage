# Enpage template instructions

This is a simple Enpage template example for you to customize and create your own templates.

## Template Structure


```plaintext
├── assets                  # Images, CSS, etc
├── enpage.config.js        # Enpage configuration file
├── index.html              # Template HTML file
├── postcss.config.js       # PostCSS configuration file
├── src                     # Javascript files
└── tailwind.config.js      # Tailwind configuration file
```

### Assets management (images, css)

- Images & CSS files should be placed in the `assets/` folder and referenced using relative path in your `index.html` file (e.g. `./assets/my-file.css`).
- Javascript files should be placed in the `src/` folder and rreferenced using relative path in your `index.html` file  (e.g. `./src/my-file.js`).
- Tailwind is included by default with some usefull plugins (forms, typography, scrollbars, animate, transform3d). You can customize the default tailwind theme in the `tailwind.config.js` file if needed. If you wish to disable Tailwind, you can remove it from the `index.html` file.
- PostCSS is included by default with some plugins (autoprefixer, tailwindcss, cssnano). You can customize the PostCSS configuration in the `postcss.config.js` file if needed.

### `enpage.config.js` configuration file

The `enpage.config.js` file is used to declare various Enpage settings and declare `datasources` and `attributes` of your template.


### Datasource(s)

Think of *datasources* as a way to provide **dynamic data** to your template.

There are two types of datasources:
- **Built-in datasources**: These are provided by Enpage and are ready to use. For example, if you want to display a list of videos from Youtube, you can use the `youtube-feed` datasource. If you want to display a list of links, you can create a custom datasource so the user will be able to provide a list of links in the editor.
- **Custom datasources**: You can create your own datasources to provide dynamic data to your template. This is useful when you want to provide a specific type of data to your template that is not covered by the built-in datasources.



```javascript
// enpage.config.js

import { defineDataSources, z } from "@enpage/sdk/datasources";

// Defining datasources for your template
export const datasources = defineDataSources({
    /**
     * Custom datasource representing a list of links
     */
    // "links" is the unique datasource key that will be used in the template
    links: {
        name: "Links",
        // The schema of the datasource. It is used to validate the data and create the editor UI.
        // Schema are declared using zod (https://zod.dev/).
        // Here, we have an array of objects with a title (string), a url (string) and an optional icon (string).
        schema: z.array(
            z.object({
                title: z.string(),
                url: z.string(),
                icon: z.string().optional(),
            }),
        ),
        // Sample data to be used when loading the template for the first time
        sampleData: [
            { title: "Enpage", url: "https://enpage.io" },
            { title: "GitHub", url: "https://github.com" },
        ],
    }
    /**
     * Enpage built-in datasource (`youtube-feed`) representing a list of videos from Youtube
     */
    // "myVideos" is the unique datasource key that will be used in the template
    myVideos: {
        // The datasource name displayed in the editor
        name: "My Videos",
        // The provider name (see docs for all available providers)
        provider: "youtube-feed"
        // Note that there is no need to define a schema for built-in datasources
        // as they are already defined by Enpage.
        // sampleData is also not needed as they are already provided by default.
    },

});

```

### Attributes

Attributes are used to provide **static data** to your template. They are useful when you want to provide a set of *options*
to the user that will affect the appearance or behavior of the template.

```javascript

// enpage.config.js


```

## Developing your template

To start developing your template, you can run the following command:

```bash
npm start
```

This will start the development server and open your template in your browser. You can start working on your template right away and have a live preview in your browser.

Then, you can start customizing your template by editing the `index.html` file, adding images & CSS in the `assets/` folder, and Javascript in the `src/` folder.


