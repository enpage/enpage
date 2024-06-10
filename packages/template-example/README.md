# Enpage template how-to

> This is a simple template example to help you get started with Enpage templates.

## Template Structure

The 2 main files are:

- `index.html` - Your template HTML file
- `src/index.js` - JS file loaded by the template

## Assets management (images, css)

- Images should be placed in the `public/assets` folder
- CSS files may be placed anywhere and linked in the HTML file
- Tailwind is included by default with some usefull plugins (forms, typography, scrollbars, animate, transform3d). 
You can customize it in the `tailwind.config.js` file if needed.

## `enpage.config.js` configuration file

> **Note**
> this file is optional. If you don't need any datasources, you can remove it.


The `enpage.config.js` file is used to declare variuous template settings like `datasources`, etc.


### Datasource(s)

> **Datasources are used to provide dynamic data to the template**. Often, datasources are used to provide a list of items (videos, images, etc) that will be displayed in the template. Enpage provides you with a set of **built-in datasources** (like Youtube, Instagram, etc) and allows you to create **custom datasources**.

```javascript
// enpage.config.js

import { defineDataSources, z } from "@enpage/sdk/datasources";

// define you datasources likes this
export const datasources = defineDataSources({
    /**
     * Enpage built-in datasource (`youtube-feed`) representing a list of videos from Youtube
     */
    // "myVideos" is the unique datasource key that will be used in the template
    myVideos: {                     
        // The datasource name displayed in the editor
        name: "My Videos",      
        // The provider name (see docs for all available providers)    
        provider: "youtube-feed"
    },
    /**
     * Custom datasource representing a list of links
     */
    // "links" is the unique datasource key that will be used in the template
    links: {
        name: "Links",          
        // The schema of the datasource. Here, an array of objects with a title and a url.
        // It is used to validate the data and create the editor UI. Schema are declared using zod (https://zod.dev/).
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
            { title: "GitHub", url: "https://enpage.io/github" },
        ],
    }
});

```