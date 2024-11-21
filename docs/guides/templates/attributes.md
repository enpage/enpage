# Attributes

Template attributes are used to let **site owners** customize the appearance or behavior of your template.

**You** are responsible — as a developer / designer — for defining the attributes you want to expose *to the site owner*. The site owner can then set the values of these attributes within the Upstart Editor.

Here is an example of how to define settings in your template:

::: code-group

```javascript [enpage.config.js]
import { defineAttributes, attr } from "@enpage/sdk/attributes";

export const attributes = defineAttributes({
  showContactButton: attr.boolean("Show Contact Button", true),
  firstName: attr.string("First Name", "John"),
  lastName: attr.string("Last Name", "Doe")
});
```

:::

## Attributes types

There are several types of attributes that can be defined in your template.

### String

```typescript
// Signature
attr.string(label: string, defaultValue: string): Attribute<string>
```

```javascript
export const attributes = defineAttributes({
  firstName: attr.string("First Name", "John"),
  lastName: attr.string("Last Name", "Doe")
});
```

### Number

```typescript
// Signature
attr.number(label: string, defaultValue: number): Attribute<number>
```

```javascript
export const attributes = defineAttributes({
  age: attr.number("Age", 25),
  height: attr.number("Height", 180)
});
```

### Boolean

```typescript
// Signature
attr.boolean(label: string, defaultValue: boolean): Attribute<boolean>
```

```javascript
export const attributes = defineAttributes({
  showContactButton: attr.boolean("Show Contact Button", true),
  showFooter: attr.boolean("Show Footer", true)
});
```

### Date

Date attributes are used to let the site owner pick a date. They are displayed as a date picker in the editor.

```typescript
// Signature
attr.date(label: string, defaultValue: Date): Attribute<Date>
```

```javascript
export const attributes = defineAttributes({
  birthDate: attr.date("Birth Date", "1990-01-01"),
});
```

### DateTime

DateTime attributes are used to let the site owner pick a date and time. They are displayed as a date and time picker in the editor.

```typescript
// Signature
attr.dateTime(label: string, defaultValue: Date): Attribute<Date>
```

```javascript
export const attributes = defineAttributes({
  eventDate: attr.dateTime("Event Date", "2022-12-31T23:59:59"),
});
```

### Enum

Enum attributes are used to let the site owner choose from a list of predefined options.
In the editor, they can be displayed as a dropdown or radio buttons.

```typescript
// Signature
attr.enum(label: string, defaultValue: string, options: string[]): Attribute<string>
```

```javascript
export const attributes = defineAttributes({
  layout: attr.enum("Layout", "grid", ["grid", "list"]),
  color: attr.enum("Color", "blue", ["blue", "red", "green"])
});
```

### Color

Color attributes are used to let the site owner pick a color. They are displayed as a color picker in the editor.

```typescript
// Signature
attr.color(label: string, defaultValue: string): Attribute<string>
```

```javascript
export const attributes = defineAttributes({
  primaryColor: attr.color("Primary Color", "#ff0000"),
  secondaryColor: attr.color("Secondary Color", "#00ff00")
});
```

### Image

```typescript
// Signature
attr.image(label: string, defaultValue: string): Attribute<string>
```

```javascript
export const attributes = defineAttributes({
  logo: attr.image("Logo", "assets/img/logo.png"),
  background: attr.image("Background", "https://example.com/imgages/bg.jpg")
});
```

### File

The File attribute is used to let the site owner upload a file (e.g. a PDF document).
It differs from `image` attribute in that it does not display a preview of the file in the editor.

```typescript
// Signature
attr.file(label: string, defaultValue: string): Attribute<string>
```

```javascript
export const attributes = defineAttributes({
  cv: attr.file("CV", "assets/files/document.pdf"),
});
```

## Built-in Attributes

Enpage defines a set of built-in attributes. Built-in attributes names start with `$`.

### List of built-in attributes

::: tip Note
- You don't need to define these attributes in your template. They are automatically populated by Enpage or the site owner through the Upstart Editor.
- Most of these attributes are automatically used to build meta-tags. <ins>You don't need</ins> to add those meta-tags manually.
:::

- `$siteTitle` (string): The title of the site (used by default in `<title>`).
- `$siteDescription` (string): The description of the site (used by default in meta tags).
- `$siteKeywords` (string): The keywords of the site (used by default in meta tags).
- `$siteLanguage` (string): The language of the site (used by default in meta tags).
- `$siteUrl` (string): The URL of the site.
- `$siteLastUpdated` (date): The date when the page was last updated.
- `$pageTitle` (string): The title of the page. (used in multi-page templates)
- `$pageLanguage` (string): The language of the page.
- `$pageDescription` (string): The description of the page. (used in multi-page templates)
- `$pageKeywords` (string): The keywords of the page. (used in multi-page templates)
- `$pageUrl` (string): The URL of the page. (used in multi-page templates)
