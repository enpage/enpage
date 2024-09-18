# Internals

## Rending environments

We can distinguish 3 rendering environments:

- **Template dev environment**: This is the rending mode for template developers/designers. In this environment, the template is rendered client-side.

- **Editor environment**: This is the rendering mode for the Enpage editor. In this environment, the template is rendered client-side.

- **Production environment**: This is the environment where a website is built. In this environment, the template is rendered server-side, generating static HTML.

### Environements differences

Table of differences between the 3 environments:

| Feature       | Template dev | Editor      | Production  |
| ------------- | ------------ | ----------- | ----------- |
| **Rendering** | Client-side  | Client-side | Server-side |
| **Data**      | Mocked       | Real        | Real        |
| **API**       | Mocked       | Real        | Real        |


## Editor state

The HTML document itself is the source of truth for the editor state.
Liquid tags are used to define loops, conditions, and other logic in the HTML document.

## Server-side rendering

### Flow

The SSR flow is composed of 3 main steps:

1. Incoming Request
2. Page Config handler: retrieves the page configuration including context (attributes and data sources)
  - In dev mode, the page configuration is loaded from the virtual file `virtual:enpage-page-config.json`
  - In local-preview mode, the page configuration is loaded from cache or from enpage.config.js (the local-preview is a node environment)
  - In production mode, the page configuration is fetched from the API
3. Render handler: renders the HTML document using the page configuration
  - In dev mode, renderer is loaded from the virtual `virtual:vite-entry-server` file
  - In production/local-preview mode, the renderer is loaded from the real vite-entry-server file
  - The render function returns the HTML document and the state. Those are then merged and returned to the client.

## Vite

### Flow

The `vite-config.ts` is the equivalent of the `vite.config.js` file in a Vite project. It only load the enpage plugin.

### Vite plugins:

- enpage meta: loads all enpage plugins
- enpage: main plugin defining the vite config
- enpage:virtual-files: plugin to handle virtual files. Hooks used: `resolveId`, `load`. It returns the content of the virtual files:
  - `virtual:enpage-template:index.html`: the main index.html template file
  - `virtual:vite-entry-server`: the entry server file
  - `virtual:enpage-page-config.json`: returns  a virtual json file containing the GenericPageConfig.
- enpage:context: plugin to handle the PageContext. In dev mode, it generates a fake context. In non-ssr build mode, it fetches the context from the server. Hooks used: `config`. It adds the
`enpageContext` property (of type `PageContext`) to the vite config.
- enpage:render: plugin to handle the rendering of the main index.html file. It uses the transformIndexHtml hook to render the HTML document using the page context. Hooks used: `transformIndexHtml`, `configureServer`.
- enpage:base-url (dev only): plugin to handle the base URL of the website. It uses the transformIndexHtml hook to inject the base URL in the HTML document. Hooks used: `transformIndexHtml`, `configureServer`.
- enpage:manifest: plugin to handle the manifest file. It uses the `generateBundle` hook to generate the enpage.manifest.json file.

## Rendering flow

### Client-side rendering (during template development and in the editor environments)


#### Preserving template information

The main challenge is to keep original HTML document intact to preserve loops,conditions, bindings, and variables informations in the HTML document. This is done by adding custom attributes to the elements.

#### Processing flow:

- The entire HTML document is parsed using DOM and `<template>` tags are extracted.
- For each template tag, an ID is generated and the parent element of the template is set with the attribute `ep-template-id`.
- Then elements with the following attributes are processed:
  - `ep-text={{ expression }}` and `ep-text-editable`: The expression is evaluated and the result is set as the textContent of the element.
  The difference between `ep-var` and `ep-text-editable` is that `ep-var` is used for variables bound directly to the template datasources or attributes, while `ep-text-editable` is used for text that can be edited by the user.
  - `ep-bind:<attr>="{{ expression }}"`: The expression is evaluated and the result is set as the value of the attribute `<attr>`.
  - `ep-show="{{ expression }}"`: The expression is evaluated and the element is shown or hidden based on the result.



#### Loops

Loops are defined within `<template>` tags. When processed, `<template>` elements are left as-is and the content is duplicated for each item in the loop.

####
