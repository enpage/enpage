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
