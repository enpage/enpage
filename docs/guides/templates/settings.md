# Settings

Settings are used to configure the template builder.
Various settings can be configured in `enpage.config.js`.

Here is an example of how you can define settings in your template:

```javascript [enpage.config.js]
import { defineSettings } from "@enpage/sdk/settings";

defineSettings({
  editorOutlineColor: "#FF9900", // customize the outline color of the editor when an element is selected/hovered
});
```

## Available settings

Here are the available settings that you can configure in the `enpage.config.js` file:

### `editorOutlineColor`

The outline color of the editor when an element is selected/hovered. You can use any valid CSS color value, such as hex, rgb, or color names.
