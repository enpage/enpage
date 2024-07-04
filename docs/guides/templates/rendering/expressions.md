# Expressions

Liquid expressions can be used to output dynamic content in your templates. They are enclosed in double curly braces `{{ }}` and can contain variables, filters, and operators.

## Variables

Variables are used to output dynamic content in your templates. They can be defined in the template or passed from the data sources and attributes.

::: warning Important
Variables must be enclosed in double curly braces <code v-pre>{{  }}</code>. They are case-sensitive. Their parent HTML element must have the `data-liquid` attribute for the expression to be evaluated.
:::


```liquid
<span data-liquid>{{ variable }}</span>
```

### Available Variables

- Data Sources variables can be accessed using the `data` object.
- Attributes variables can be accessed using the `attributes` object.


### Example

::: code-group
```liquid [index.html]
<!DOCTYPE html>
<html>
  <body>
    <h1 data-liquid>Hello, my name is {{ attributes.firstName }}</h1>
    <p data-liquid>
      Checkout my latest video: {{ data.videos[0].title }}
    </p>
  </body>
</html>
```
:::
