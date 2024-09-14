# Context

The context contains information about the current page such as attributes and Data Sources.

## `enpage.context`

Hold the current page context.

```javascript{1}
const { attributes, data } = enpage.context;

console.log("Hello %s", attributes.firstName);
```



See also [Attributes](../guides/templates/attributes) and [Data Sources](../guides/data-sources).

