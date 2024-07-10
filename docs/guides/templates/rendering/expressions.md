# Expressions

Liquid expressions can be used to output dynamic content in your templates. They are enclosed in double curly braces <code v-pre>{{  }}</code> and can contain variables, filters, and operators. Variables can be defined in the template or passed from the data sources and attributes.

## Usage in Text Content vs HTML attributes

You can use expressions in element's text content and HTML attributes.

### Text Content

To use expressions in text content, you need to put the `ep-bind` attribute on the element. This tells Enpage to evaluate the content of the element as a Liquid expression.

```liquid
<p ep-bind>
  {{ data.image.title }}
</a>
```

### HTML Attributes

Use the `ep-bind:<attr>` attribute to bind an attribute to a Liquid expression.

```liquid
<!--
  Bind the "src" attribute.
-->
<img ep-bind:src="{{ data.image.url }}" />

<!--
  - Bind the "href" attribute and the text content of the <a> tag.
  - Also use the `ep-bind` attribute
    to use Liquid expressions in the text content.
-->
<a ep-bind ep-bind:href="{{ data.image.link }}">
  {{ data.image.title }}
</a>
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
    <h1 ep-bind>Hello, my name is {{ attributes.firstName }}</h1>
    <p ep-bind>
      Checkout my latest video: {{ data.videos[0].title }}
    </p>
  </body>
</html>
```

:::
