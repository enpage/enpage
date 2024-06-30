# Attributes

Template attributes are used to let **site owners** customize the appearance or behavior of your template.

**You** are responsible — as a developer / designer — for defining the attributes you want to expose *to the site owner*. The site owner can then set the values of these attributes within the Enpage editor.

Here is an example of how you can define settings in your template:

::: code-group

```javascript [enpage.config.js]
import { defineAttributes, attr } from "@enpage/sdk/attributes";

defineAttributes({
  showContactButton: attr.boolean("Show Contact Button", true),
});
```

```liquid [index.html]
<!--
Use the attribute in your HTML file.
Here we use liquid syntax to conditionally render the contact
button based on the value of the `showContactButton` attribute.
-->
{% if attributes.showContactButton == true %}
  <button>Contact Us</button>
{% endif %}
```
