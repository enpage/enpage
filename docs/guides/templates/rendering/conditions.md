# Conditions

Conditions are used to control the rendering of a component based on the value of a field (from a Data Source or from any attribute).

## Syntax

Conditions can appear in two forms:

- Inside the HTML attribute `ep-if` for simple conditions
- Inside `<template>` tags for more complex conditions

### Usage inside the `ep-if` attribute

::: code-group

```liquid [index.html]
<!DOCTYPE html>
<html>
  <body>
    <button ep-if="attributes.showContactButton == true">Contact Us</button>
  </body>
</html>
```

:::

### Usage inside `<template>` tags

::: code-group

```liquid [simple.html]
<!DOCTYPE html>
<html>
  <body>
    <template>
      {% if attributes.showContactButton == true %}
        <button>Contact Us</button>
      {% endif %}
    <template>
  </body>
</html>
```

```liquid [complex.html]
<!DOCTYPE html>
<html>
  <body>
    <template>
      {% if attributes.showContactMode == "button" %}
        <button>Contact Us</button>
      {% elsif attributes.showContactMode == "link" %}
        <a href="mailto:{{ attributes.contactEmail }}" class="underline">Contact Us</a>
      {% else %}
        <button>Learn More</button>
      {% endif %}
    <template>
  </body>
</html>
```

### Other tags

Use the `case` tag in Liquid to make a switch-case statement.
This tag is only available within `<template>` tags. See Liquid's [documentation](https://liquidjs.com/tags/case.html) for more information.

:::
