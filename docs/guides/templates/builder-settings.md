# Builder Settings

Builder Settings can be used to configure the template builder. **This is optional.**

Here is an example of how you can define Builder settings in your template:

::: code-group

```javascript [enpage.config.js]
import { defineBuilderSettings } from "@enpage/sdk/builder-settings";

defineBuilderSettings({
  editorOutlineColor: "#FF9900", // customize the outline color of the editor when an element is selected/hovered
});
```
:::

## Available settings

### `editorOutlineColor`

The outline color of the editor when an element is selected/hovered. This can be useful if the default purple
color does not fit well with your template. You can use any valid CSS color value, such as hex, rgb, or color names.
