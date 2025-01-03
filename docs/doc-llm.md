# Generating a template with upstart

A template is described using a specific JSON schema, see below.

Pseudo template:

```jsonc filename=template.json
{
  // Manifest info
  "manifest": {
    // ...
  },
  // Themes for the template (the first theme is applied by default)
  "themes": [
    // ...
  ],
  "pages": [
    // ...
  ],
  // Optional attributes
  "attributes": {
    // ...
  },
  // Optional datasources
  "datasources": {
    // ...
  },
  // Optional datarecords
  "datarecords": {
    // ...
  },
}
```


## Template definition

### `manifest`

Here is the JSON schema for the `manifest` (described using Typebox).

```typescript
import { Type, type Static } from "@sinclair/typebox";

export const manifestSchema = Type.Object({
  id: Type.Optional(
    Type.String({
      title: "Template ID",
      description: "A unique identifier for the template. Can be any string, but should be unique.",
    }),
  ),
  name: Type.String({
    title: "Template Name",
  }),
  description: Type.Optional(
    Type.String({
      title: "Show template description",
    }),
  ),
  readme: Type.Optional(
    Type.Record(
      Type.RegExp(/^[a-z]{2}$/), // language code
      Type.String(),
      {
        title: "Readme texts.",
        description:
          "A dictionary of readme files for different languages (iso 2 letters code). Currently on supported for 'en' and 'fr'.",
      },
    ),
  ),
  tags: Type.Optional(Type.Array(Type.String(), { title: "Tags" })),
  author: Type.Optional(
    Type.String({
      title: "Author name",
    }),
  ),
  thumbnail: Type.Optional(
    Type.String({
      title: "Thumbnail",
      description: "A URL to the thumbnail image for the template.",
    }),
  ),
  homepage: Type.Optional(
    Type.String({
      title: "Homepage",
      description: "A URL to the homepage of the template.",
    }),
  ),
});

export type TemplateManifest = Static<typeof manifestSchema>;
export type PublishedTemplateManifest = TemplateManifest & Required<Pick<TemplateManifest, "id">>;

```

### `themes`

A template must provide at least one theme.
Here is the JSON schema for the `themes` (described using Typebox).

```typescript
import { Type, type Static } from "@sinclair/typebox";

export const themeSchema = Type.Object(
  {
    id: Type.String({ title: "ID", description: "The unique identifier of the theme" }),
    name: Type.String({ title: "Name", description: "The name of the theme" }),
    description: Type.Optional(
      Type.String({ title: "Description", description: "The description of the theme" }),
    ),
    tags: Type.Optional(
      Type.Array(Type.String({ title: "Tag" }), { title: "Tags", description: "The tags of the theme" }),
    ),

    // Define the theme colors
    colors: Type.Object(
      {
        primary: Type.String({
          title: "Primary color",
          description: "The brand's primary color",
        }),
        secondary: Type.String({
          title: "Secondary color",
          description: "The brand's second most used color",
        }),
        accent: Type.String({
          title: "Accent color",
          description: "The brand's least used color",
        }),
        neutral: Type.String({
          title: "Neutral color",
          description: "The base neutral color",
        }),
      },
      {
        title: "Theme base colors",
        description: "The base colors of the theme. Each theme must declare all these colors.",
      },
    ),

    // Define the theme typography
    typography: Type.Object({
      base: Type.Number({
        title: "Base font size",
        description: "The base font size in pixels. It is safe to keep it as is.",
        default: 16,
      }),
      heading: Type.Union(
        [
          Type.Literal("system-ui", { title: "System UI" }),
          Type.Literal("transitional", { title: "Transitional" }),
          Type.Literal("old-style", { title: "Old style" }),
          Type.Literal("humanist", { title: "Humanist" }),
          Type.Literal("geometric-humanist", { title: "Geometric humanist" }),
          Type.Literal("classical-humanist", { title: "Classical humanist" }),
          Type.Literal("neo-grotesque", { title: "Neo-grotesque" }),
          Type.Literal("monospace-slab-serif", { title: "Monospace slab serif" }),
          Type.Literal("monospace-code", { title: "Monospace code" }),
          Type.Literal("industrial", { title: "Industrial" }),
          Type.Literal("rounded-sans", { title: "Rounded sans" }),
          Type.Literal("slab-serif", { title: "Slab serif" }),
          Type.Literal("antique", { title: "Antique" }),
          Type.Literal("didone", { title: "Didone" }),
          Type.Literal("handwritten", { title: "Handwritten" }),
          Type.String({
            title: "Custom font name",
            description: "A custom font declared in the customFonts property.",
          }),
        ],
        {
          title: "Heading font",
          description: "Used for titles and headings.",
          default: "system-ui",
        },
      ),
      body: Type.Union(
        [
          Type.Literal("system-ui", { title: "System UI" }),
          Type.Literal("transitional", { title: "Transitional" }),
          Type.Literal("old-style", { title: "Old style" }),
          Type.Literal("humanist", { title: "Humanist" }),
          Type.Literal("geometric-humanist", { title: "Geometric humanist" }),
          Type.Literal("classical-humanist", { title: "Classical humanist" }),
          Type.Literal("neo-grotesque", { title: "Neo-grotesque" }),
          Type.Literal("monospace-slab-serif", { title: "Monospace slab serif" }),
          Type.Literal("monospace-code", { title: "Monospace code" }),
          Type.Literal("industrial", { title: "Industrial" }),
          Type.Literal("rounded-sans", { title: "Rounded sans" }),
          Type.Literal("slab-serif", { title: "Slab serif" }),
          Type.Literal("antique", { title: "Antique" }),
          Type.Literal("didone", { title: "Didone" }),
          Type.Literal("handwritten", { title: "Handwritten" }),
          Type.String({
            title: "Custom font name",
            description: "A custom font declared in the customFonts property.",
          }),
        ],
        {
          title: "Body font",
          description: "Used for paragraphs and body text",
          default: "system-ui",
        },
      ),
    }),

    // Custom fonts with their ref-name and url
    customFonts: Type.Optional(
      Type.Array(
        Type.Object(
          {
            name: Type.String({ title: "Name", description: "The name of the font" }),
            src: Type.String({ title: "Font URL", description: "The URL of the font" }),
            display: Type.Optional(
              Type.Union(
                [
                  Type.Literal("auto", { title: "Auto" }),
                  Type.Literal("swap", { title: "Swap" }),
                  Type.Literal("block", { title: "Block" }),
                  Type.Literal("fallback", { title: "Fallback" }),
                  Type.Literal("optional", { title: "Optional" }),
                  Type.String({ title: "Custom" }),
                ],
                { title: "Display", default: "auto" },
              ),
            ),
            stretch: Type.Optional(
              Type.Union(
                [
                  Type.Literal("normal", { title: "Normal" }),
                  Type.Literal("ultra-condensed", { title: "Ultra condensed" }),
                  Type.Literal("extra-condensed", { title: "Extra condensed" }),
                  Type.Literal("condensed", { title: "Condensed" }),
                  Type.Literal("semi-condensed", { title: "Semi condensed" }),
                  Type.Literal("semi-expanded", { title: "Semi expanded" }),
                  Type.Literal("expanded", { title: "Expanded" }),
                  Type.Literal("extra-expanded", { title: "Extra expanded" }),
                  Type.Literal("ultra-expanded", { title: "Ultra expanded" }),
                  Type.String({ title: "Custom" }),
                ],
                { title: "Stretch", default: "normal" },
              ),
            ),
            style: Type.Optional(
              Type.Union(
                [
                  Type.Literal("normal", { title: "Normal" }),
                  Type.Literal("italic", { title: "Italic" }),
                  Type.Literal("oblique", { title: "Oblique" }),
                  Type.String({ title: "Custom" }),
                ],
                { title: "Style", default: "normal" },
              ),
            ),
            weight: Type.Optional(
              Type.Union(
                [
                  Type.Literal("normal", { title: "Normal" }),
                  Type.Literal("bold", { title: "Bold" }),
                  Type.Literal("bolder", { title: "Bolder" }),
                  Type.Literal("lighter", { title: "Lighter" }),
                  Type.Literal("100", { title: "100" }),
                  Type.Literal("200", { title: "200" }),
                  Type.Literal("300", { title: "300" }),
                  Type.Literal("400", { title: "400" }),
                  Type.Literal("500", { title: "500" }),
                  Type.Literal("600", { title: "600" }),
                  Type.Literal("700", { title: "700" }),
                  Type.Literal("800", { title: "800" }),
                  Type.Literal("900", { title: "900" }),
                  Type.String({ title: "Custom" }),
                ],
                { title: "Weight", default: "normal" },
              ),
            ),
          },
          { title: "Custom font" },
        ),
        { title: "Custom fonts", description: "The custom fonts used in the theme" },
      ),
    ),
  },
  {
    $id: "Theme",
  },
);

export type Theme = Static<typeof themeSchema>;
export const themeArray = Type.Array(themeSchema);
export type ThemeArray = Static<typeof themeArray>;

```

### `pages`

A template must provide at least one page for the website. Each page has a name, a path, and an array of bricks.
Bricks are predefined elements available ofr the user to use. Think of it as react components. Each brick can have specific props.
Here is the JSON schema for `pages`.

```json
{
  "type": "object",
  "properties": {
    "label": {
      "type": "string"
    },
    "path": {
      "type": "string"
    },
    "bricks": {
      "type": "array",
      "items": {
        "type": "object",
        "properties": {
          "type": {
            "anyOf": [
              {
                "const": "button",
                "type": "string"
              },
              {
                "const": "card",
                "type": "string"
              },
              {
                "const": "carousel",
                "type": "string"
              },
              {
                "const": "countdown",
                "type": "string"
              },
              {
                "const": "footer",
                "type": "string"
              },
              {
                "const": "form",
                "type": "string"
              },
              {
                "const": "header",
                "type": "string"
              },
              {
                "const": "hero",
                "type": "string"
              },
              {
                "const": "icon",
                "type": "string"
              },
              {
                "const": "image",
                "type": "string"
              },
              {
                "const": "images-wall",
                "type": "string"
              },
              {
                "const": "map",
                "type": "string"
              },
              {
                "const": "social-links",
                "type": "string"
              },
              {
                "const": "text",
                "type": "string"
              },
              {
                "const": "video",
                "type": "string"
              },
              {
                "const": "html-element",
                "type": "string"
              }
            ]
          },
          "props": {
            "anyOf": [
              {
                "type": "object",
                "properties": {
                  "content": {
                    "default": "Click to edit",
                    "title": "Content",
                    "description": "The text content",
                    "ui:widget": "hidden",
                    "type": "string"
                  },
                  "editable": {
                    "title": "Editable",
                    "description": "Allow editing of text content",
                    "default": false,
                    "ui:widget": "hidden",
                    "type": "boolean"
                  },
                  "id": {
                    "title": "Brick ID",
                    "ui:widget": "hidden",
                    "type": "string"
                  },
                  "className": {
                    "default": "",
                    "ui:widget": "hidden",
                    "type": "string"
                  },
                  "z": {
                    "title": "Z-index",
                    "ui:widget": "hidden",
                    "type": "number"
                  },
                  "borderRadius": {
                    "$id": "borderRadius",
                    "default": "rounded-none",
                    "title": "Rounding",
                    "description": "Corners rounding",
                    "ui:field": "enum",
                    "ui:display": "button-group",
                    "ui:group": "border",
                    "ui:group:title": "Border",
                    "anyOf": [
                      {
                        "title": "None",
                        "const": "rounded-none",
                        "type": "string"
                      },
                      {
                        "title": "S",
                        "const": "rounded-sm",
                        "type": "string"
                      },
                      {
                        "title": "M",
                        "const": "rounded-md",
                        "type": "string"
                      },
                      {
                        "title": "L",
                        "const": "rounded-lg",
                        "type": "string"
                      },
                      {
                        "title": "XL",
                        "const": "rounded-xl",
                        "type": "string"
                      },
                      {
                        "title": "Full",
                        "const": "rounded-full",
                        "type": "string"
                      }
                    ]
                  },
                  "borderWidth": {
                    "$id": "borderWidth",
                    "default": "border-0",
                    "title": "Border width",
                    "ui:field": "enum",
                    "ui:display": "button-group",
                    "ui:group": "border",
                    "ui:group:title": "Border",
                    "anyOf": [
                      {
                        "title": "None",
                        "const": "border-0",
                        "type": "string"
                      },
                      {
                        "title": "S",
                        "const": "border",
                        "type": "string"
                      },
                      {
                        "title": "M",
                        "const": "border-2",
                        "type": "string"
                      },
                      {
                        "title": "L",
                        "const": "border-4",
                        "type": "string"
                      },
                      {
                        "title": "XL",
                        "const": "border-8",
                        "type": "string"
                      }
                    ]
                  },
                  "borderColor": {
                    "$id": "borderColor",
                    "default": "transparent",
                    "title": "Border color",
                    "ui:field": "color",
                    "ui:color-type": "border",
                    "ui:group": "border",
                    "ui:group:title": "Border",
                    "type": "string"
                  },
                  "borderStyle": {
                    "$id": "borderStyle",
                    "default": "border-solid",
                    "title": "Border style",
                    "description": "The brick border style",
                    "ui:field": "enum",
                    "ui:display": "button-group",
                    "ui:group": "border",
                    "ui:group:title": "Border",
                    "anyOf": [
                      {
                        "title": "Solid",
                        "const": "border-solid",
                        "type": "string"
                      },
                      {
                        "title": "Dashed",
                        "const": "border-dashed",
                        "type": "string"
                      },
                      {
                        "title": "Dotted",
                        "const": "border-dotted",
                        "type": "string"
                      }
                    ]
                  },
                  "padding": {
                    "$id": "padding",
                    "default": "p-2",
                    "title": "Padding",
                    "description": "Space between the content and the border",
                    "ui:field": "enum",
                    "ui:display": "button-group",
                    "ui:group": "spacing",
                    "ui:group:title": "Spacing",
                    "anyOf": [
                      {
                        "title": "None",
                        "const": "p-0",
                        "type": "string"
                      },
                      {
                        "title": "S",
                        "const": "p-2",
                        "type": "string"
                      },
                      {
                        "title": "M",
                        "const": "p-4",
                        "type": "string"
                      },
                      {
                        "title": "L",
                        "const": "p-8",
                        "type": "string"
                      },
                      {
                        "title": "XL",
                        "const": "p-16",
                        "type": "string"
                      }
                    ]
                  },
                  "backgroundColor": {
                    "$id": "backgroundColor",
                    "default": "transparent",
                    "title": "Background color",
                    "ui:field": "color",
                    "ui:color-type": "background",
                    "ui:group": "colors",
                    "ui:group:title": "Colors",
                    "type": "string"
                  },
                  "opacity": {
                    "$id": "opacity",
                    "minimum": 0.1,
                    "maximum": 1,
                    "multipleOf": 0.1,
                    "title": "Opacity",
                    "description": "Global opacity",
                    "ui:field": "slider",
                    "ui:group": "effects",
                    "ui:group:title": "Effects",
                    "type": "number"
                  },
                  "shadow": {
                    "$id": "shadow",
                    "default": "shadow-none",
                    "title": "Shadow",
                    "description": "Shadow",
                    "ui:field": "enum",
                    "ui:display": "button-group",
                    "ui:group": "effects",
                    "ui:group:title": "Effects",
                    "anyOf": [
                      {
                        "title": "None",
                        "const": "shadow-none",
                        "type": "string"
                      },
                      {
                        "title": "S",
                        "const": "shadow-sm",
                        "type": "string"
                      },
                      {
                        "title": "M",
                        "const": "shadow-md",
                        "type": "string"
                      },
                      {
                        "title": "L",
                        "const": "shadow-lg",
                        "type": "string"
                      },
                      {
                        "title": "XL",
                        "const": "shadow-xl",
                        "type": "string"
                      },
                      {
                        "title": "2XL",
                        "const": "shadow-2xl",
                        "type": "string"
                      }
                    ]
                  },
                  "heroFontSize": {
                    "default": "font-size-hero-3",
                    "title": "Font size",
                    "ui:field": "enum",
                    "ui:display": "button-group",
                    "ui:group": "border",
                    "anyOf": [
                      {
                        "title": "1",
                        "const": "font-size-hero-1",
                        "type": "string"
                      },
                      {
                        "title": "2",
                        "const": "font-size-hero-2",
                        "type": "string"
                      },
                      {
                        "title": "3",
                        "const": "font-size-hero-3",
                        "type": "string"
                      },
                      {
                        "title": "4",
                        "const": "font-size-hero-4",
                        "type": "string"
                      },
                      {
                        "title": "5",
                        "const": "font-size-hero-5",
                        "type": "string"
                      }
                    ]
                  }
                },
                "required": [
                  "content",
                  "editable",
                  "id",
                  "borderRadius",
                  "borderWidth",
                  "borderColor",
                  "borderStyle",
                  "padding",
                  "backgroundColor",
                  "shadow",
                  "heroFontSize"
                ]
              },
              {
                "type": "object",
                "properties": {
                  "content": {
                    "default": "Click to edit",
                    "title": "Content",
                    "description": "The text content",
                    "ui:widget": "hidden",
                    "type": "string"
                  },
                  "editable": {
                    "title": "Editable",
                    "description": "Allow editing of text content",
                    "default": false,
                    "ui:widget": "hidden",
                    "type": "boolean"
                  },
                  "id": {
                    "title": "Brick ID",
                    "ui:widget": "hidden",
                    "type": "string"
                  },
                  "className": {
                    "default": "",
                    "ui:widget": "hidden",
                    "type": "string"
                  },
                  "z": {
                    "title": "Z-index",
                    "ui:widget": "hidden",
                    "type": "number"
                  },
                  "borderRadius": {
                    "$id": "borderRadius",
                    "default": "rounded-none",
                    "title": "Rounding",
                    "description": "Corners rounding",
                    "ui:field": "enum",
                    "ui:display": "button-group",
                    "ui:group": "border",
                    "ui:group:title": "Border",
                    "anyOf": [
                      {
                        "title": "None",
                        "const": "rounded-none",
                        "type": "string"
                      },
                      {
                        "title": "S",
                        "const": "rounded-sm",
                        "type": "string"
                      },
                      {
                        "title": "M",
                        "const": "rounded-md",
                        "type": "string"
                      },
                      {
                        "title": "L",
                        "const": "rounded-lg",
                        "type": "string"
                      },
                      {
                        "title": "XL",
                        "const": "rounded-xl",
                        "type": "string"
                      },
                      {
                        "title": "Full",
                        "const": "rounded-full",
                        "type": "string"
                      }
                    ]
                  },
                  "borderWidth": {
                    "$id": "borderWidth",
                    "default": "border-0",
                    "title": "Border width",
                    "ui:field": "enum",
                    "ui:display": "button-group",
                    "ui:group": "border",
                    "ui:group:title": "Border",
                    "anyOf": [
                      {
                        "title": "None",
                        "const": "border-0",
                        "type": "string"
                      },
                      {
                        "title": "S",
                        "const": "border",
                        "type": "string"
                      },
                      {
                        "title": "M",
                        "const": "border-2",
                        "type": "string"
                      },
                      {
                        "title": "L",
                        "const": "border-4",
                        "type": "string"
                      },
                      {
                        "title": "XL",
                        "const": "border-8",
                        "type": "string"
                      }
                    ]
                  },
                  "borderColor": {
                    "$id": "borderColor",
                    "default": "transparent",
                    "title": "Border color",
                    "ui:field": "color",
                    "ui:color-type": "border",
                    "ui:group": "border",
                    "ui:group:title": "Border",
                    "type": "string"
                  },
                  "borderStyle": {
                    "$id": "borderStyle",
                    "default": "border-solid",
                    "title": "Border style",
                    "description": "The brick border style",
                    "ui:field": "enum",
                    "ui:display": "button-group",
                    "ui:group": "border",
                    "ui:group:title": "Border",
                    "anyOf": [
                      {
                        "title": "Solid",
                        "const": "border-solid",
                        "type": "string"
                      },
                      {
                        "title": "Dashed",
                        "const": "border-dashed",
                        "type": "string"
                      },
                      {
                        "title": "Dotted",
                        "const": "border-dotted",
                        "type": "string"
                      }
                    ]
                  },
                  "padding": {
                    "$id": "padding",
                    "default": "p-2",
                    "title": "Padding",
                    "description": "Space between the content and the border",
                    "ui:field": "enum",
                    "ui:display": "button-group",
                    "ui:group": "spacing",
                    "ui:group:title": "Spacing",
                    "anyOf": [
                      {
                        "title": "None",
                        "const": "p-0",
                        "type": "string"
                      },
                      {
                        "title": "S",
                        "const": "p-2",
                        "type": "string"
                      },
                      {
                        "title": "M",
                        "const": "p-4",
                        "type": "string"
                      },
                      {
                        "title": "L",
                        "const": "p-8",
                        "type": "string"
                      },
                      {
                        "title": "XL",
                        "const": "p-16",
                        "type": "string"
                      }
                    ]
                  },
                  "backgroundColor": {
                    "$id": "backgroundColor",
                    "default": "transparent",
                    "title": "Background color",
                    "ui:field": "color",
                    "ui:color-type": "background",
                    "ui:group": "colors",
                    "ui:group:title": "Colors",
                    "type": "string"
                  },
                  "opacity": {
                    "$id": "opacity",
                    "minimum": 0.1,
                    "maximum": 1,
                    "multipleOf": 0.1,
                    "title": "Opacity",
                    "description": "Global opacity",
                    "ui:field": "slider",
                    "ui:group": "effects",
                    "ui:group:title": "Effects",
                    "type": "number"
                  },
                  "shadow": {
                    "$id": "shadow",
                    "default": "shadow-none",
                    "title": "Shadow",
                    "description": "Shadow",
                    "ui:field": "enum",
                    "ui:display": "button-group",
                    "ui:group": "effects",
                    "ui:group:title": "Effects",
                    "anyOf": [
                      {
                        "title": "None",
                        "const": "shadow-none",
                        "type": "string"
                      },
                      {
                        "title": "S",
                        "const": "shadow-sm",
                        "type": "string"
                      },
                      {
                        "title": "M",
                        "const": "shadow-md",
                        "type": "string"
                      },
                      {
                        "title": "L",
                        "const": "shadow-lg",
                        "type": "string"
                      },
                      {
                        "title": "XL",
                        "const": "shadow-xl",
                        "type": "string"
                      },
                      {
                        "title": "2XL",
                        "const": "shadow-2xl",
                        "type": "string"
                      }
                    ]
                  },
                  "heroFontSize": {
                    "default": "font-size-hero-3",
                    "title": "Font size",
                    "ui:field": "enum",
                    "ui:display": "button-group",
                    "ui:group": "border",
                    "anyOf": [
                      {
                        "title": "1",
                        "const": "font-size-hero-1",
                        "type": "string"
                      },
                      {
                        "title": "2",
                        "const": "font-size-hero-2",
                        "type": "string"
                      },
                      {
                        "title": "3",
                        "const": "font-size-hero-3",
                        "type": "string"
                      },
                      {
                        "title": "4",
                        "const": "font-size-hero-4",
                        "type": "string"
                      },
                      {
                        "title": "5",
                        "const": "font-size-hero-5",
                        "type": "string"
                      }
                    ]
                  }
                },
                "required": [
                  "content",
                  "editable",
                  "id",
                  "borderRadius",
                  "borderWidth",
                  "borderColor",
                  "borderStyle",
                  "padding",
                  "backgroundColor",
                  "shadow",
                  "heroFontSize"
                ]
              },
              {
                "type": "object",
                "properties": {
                  "content": {
                    "default": "Click to edit",
                    "title": "Content",
                    "description": "The text content",
                    "ui:widget": "hidden",
                    "type": "string"
                  },
                  "editable": {
                    "title": "Editable",
                    "description": "Allow editing of text content",
                    "default": false,
                    "ui:widget": "hidden",
                    "type": "boolean"
                  },
                  "id": {
                    "title": "Brick ID",
                    "ui:widget": "hidden",
                    "type": "string"
                  },
                  "className": {
                    "default": "",
                    "ui:widget": "hidden",
                    "type": "string"
                  },
                  "z": {
                    "title": "Z-index",
                    "ui:widget": "hidden",
                    "type": "number"
                  },
                  "borderRadius": {
                    "$id": "borderRadius",
                    "default": "rounded-none",
                    "title": "Rounding",
                    "description": "Corners rounding",
                    "ui:field": "enum",
                    "ui:display": "button-group",
                    "ui:group": "border",
                    "ui:group:title": "Border",
                    "anyOf": [
                      {
                        "title": "None",
                        "const": "rounded-none",
                        "type": "string"
                      },
                      {
                        "title": "S",
                        "const": "rounded-sm",
                        "type": "string"
                      },
                      {
                        "title": "M",
                        "const": "rounded-md",
                        "type": "string"
                      },
                      {
                        "title": "L",
                        "const": "rounded-lg",
                        "type": "string"
                      },
                      {
                        "title": "XL",
                        "const": "rounded-xl",
                        "type": "string"
                      },
                      {
                        "title": "Full",
                        "const": "rounded-full",
                        "type": "string"
                      }
                    ]
                  },
                  "borderWidth": {
                    "$id": "borderWidth",
                    "default": "border-0",
                    "title": "Border width",
                    "ui:field": "enum",
                    "ui:display": "button-group",
                    "ui:group": "border",
                    "ui:group:title": "Border",
                    "anyOf": [
                      {
                        "title": "None",
                        "const": "border-0",
                        "type": "string"
                      },
                      {
                        "title": "S",
                        "const": "border",
                        "type": "string"
                      },
                      {
                        "title": "M",
                        "const": "border-2",
                        "type": "string"
                      },
                      {
                        "title": "L",
                        "const": "border-4",
                        "type": "string"
                      },
                      {
                        "title": "XL",
                        "const": "border-8",
                        "type": "string"
                      }
                    ]
                  },
                  "borderColor": {
                    "$id": "borderColor",
                    "default": "transparent",
                    "title": "Border color",
                    "ui:field": "color",
                    "ui:color-type": "border",
                    "ui:group": "border",
                    "ui:group:title": "Border",
                    "type": "string"
                  },
                  "borderStyle": {
                    "$id": "borderStyle",
                    "default": "border-solid",
                    "title": "Border style",
                    "description": "The brick border style",
                    "ui:field": "enum",
                    "ui:display": "button-group",
                    "ui:group": "border",
                    "ui:group:title": "Border",
                    "anyOf": [
                      {
                        "title": "Solid",
                        "const": "border-solid",
                        "type": "string"
                      },
                      {
                        "title": "Dashed",
                        "const": "border-dashed",
                        "type": "string"
                      },
                      {
                        "title": "Dotted",
                        "const": "border-dotted",
                        "type": "string"
                      }
                    ]
                  },
                  "padding": {
                    "$id": "padding",
                    "default": "p-2",
                    "title": "Padding",
                    "description": "Space between the content and the border",
                    "ui:field": "enum",
                    "ui:display": "button-group",
                    "ui:group": "spacing",
                    "ui:group:title": "Spacing",
                    "anyOf": [
                      {
                        "title": "None",
                        "const": "p-0",
                        "type": "string"
                      },
                      {
                        "title": "S",
                        "const": "p-2",
                        "type": "string"
                      },
                      {
                        "title": "M",
                        "const": "p-4",
                        "type": "string"
                      },
                      {
                        "title": "L",
                        "const": "p-8",
                        "type": "string"
                      },
                      {
                        "title": "XL",
                        "const": "p-16",
                        "type": "string"
                      }
                    ]
                  },
                  "backgroundColor": {
                    "$id": "backgroundColor",
                    "default": "transparent",
                    "title": "Background color",
                    "ui:field": "color",
                    "ui:color-type": "background",
                    "ui:group": "colors",
                    "ui:group:title": "Colors",
                    "type": "string"
                  },
                  "opacity": {
                    "$id": "opacity",
                    "minimum": 0.1,
                    "maximum": 1,
                    "multipleOf": 0.1,
                    "title": "Opacity",
                    "description": "Global opacity",
                    "ui:field": "slider",
                    "ui:group": "effects",
                    "ui:group:title": "Effects",
                    "type": "number"
                  },
                  "shadow": {
                    "$id": "shadow",
                    "default": "shadow-none",
                    "title": "Shadow",
                    "description": "Shadow",
                    "ui:field": "enum",
                    "ui:display": "button-group",
                    "ui:group": "effects",
                    "ui:group:title": "Effects",
                    "anyOf": [
                      {
                        "title": "None",
                        "const": "shadow-none",
                        "type": "string"
                      },
                      {
                        "title": "S",
                        "const": "shadow-sm",
                        "type": "string"
                      },
                      {
                        "title": "M",
                        "const": "shadow-md",
                        "type": "string"
                      },
                      {
                        "title": "L",
                        "const": "shadow-lg",
                        "type": "string"
                      },
                      {
                        "title": "XL",
                        "const": "shadow-xl",
                        "type": "string"
                      },
                      {
                        "title": "2XL",
                        "const": "shadow-2xl",
                        "type": "string"
                      }
                    ]
                  },
                  "heroFontSize": {
                    "default": "font-size-hero-3",
                    "title": "Font size",
                    "ui:field": "enum",
                    "ui:display": "button-group",
                    "ui:group": "border",
                    "anyOf": [
                      {
                        "title": "1",
                        "const": "font-size-hero-1",
                        "type": "string"
                      },
                      {
                        "title": "2",
                        "const": "font-size-hero-2",
                        "type": "string"
                      },
                      {
                        "title": "3",
                        "const": "font-size-hero-3",
                        "type": "string"
                      },
                      {
                        "title": "4",
                        "const": "font-size-hero-4",
                        "type": "string"
                      },
                      {
                        "title": "5",
                        "const": "font-size-hero-5",
                        "type": "string"
                      }
                    ]
                  }
                },
                "required": [
                  "content",
                  "editable",
                  "id",
                  "borderRadius",
                  "borderWidth",
                  "borderColor",
                  "borderStyle",
                  "padding",
                  "backgroundColor",
                  "shadow",
                  "heroFontSize"
                ]
              },
              {
                "type": "object",
                "properties": {
                  "content": {
                    "default": "Click to edit",
                    "title": "Content",
                    "description": "The text content",
                    "ui:widget": "hidden",
                    "type": "string"
                  },
                  "editable": {
                    "title": "Editable",
                    "description": "Allow editing of text content",
                    "default": false,
                    "ui:widget": "hidden",
                    "type": "boolean"
                  },
                  "id": {
                    "title": "Brick ID",
                    "ui:widget": "hidden",
                    "type": "string"
                  },
                  "className": {
                    "default": "",
                    "ui:widget": "hidden",
                    "type": "string"
                  },
                  "z": {
                    "title": "Z-index",
                    "ui:widget": "hidden",
                    "type": "number"
                  },
                  "borderRadius": {
                    "$id": "borderRadius",
                    "default": "rounded-none",
                    "title": "Rounding",
                    "description": "Corners rounding",
                    "ui:field": "enum",
                    "ui:display": "button-group",
                    "ui:group": "border",
                    "ui:group:title": "Border",
                    "anyOf": [
                      {
                        "title": "None",
                        "const": "rounded-none",
                        "type": "string"
                      },
                      {
                        "title": "S",
                        "const": "rounded-sm",
                        "type": "string"
                      },
                      {
                        "title": "M",
                        "const": "rounded-md",
                        "type": "string"
                      },
                      {
                        "title": "L",
                        "const": "rounded-lg",
                        "type": "string"
                      },
                      {
                        "title": "XL",
                        "const": "rounded-xl",
                        "type": "string"
                      },
                      {
                        "title": "Full",
                        "const": "rounded-full",
                        "type": "string"
                      }
                    ]
                  },
                  "borderWidth": {
                    "$id": "borderWidth",
                    "default": "border-0",
                    "title": "Border width",
                    "ui:field": "enum",
                    "ui:display": "button-group",
                    "ui:group": "border",
                    "ui:group:title": "Border",
                    "anyOf": [
                      {
                        "title": "None",
                        "const": "border-0",
                        "type": "string"
                      },
                      {
                        "title": "S",
                        "const": "border",
                        "type": "string"
                      },
                      {
                        "title": "M",
                        "const": "border-2",
                        "type": "string"
                      },
                      {
                        "title": "L",
                        "const": "border-4",
                        "type": "string"
                      },
                      {
                        "title": "XL",
                        "const": "border-8",
                        "type": "string"
                      }
                    ]
                  },
                  "borderColor": {
                    "$id": "borderColor",
                    "default": "transparent",
                    "title": "Border color",
                    "ui:field": "color",
                    "ui:color-type": "border",
                    "ui:group": "border",
                    "ui:group:title": "Border",
                    "type": "string"
                  },
                  "borderStyle": {
                    "$id": "borderStyle",
                    "default": "border-solid",
                    "title": "Border style",
                    "description": "The brick border style",
                    "ui:field": "enum",
                    "ui:display": "button-group",
                    "ui:group": "border",
                    "ui:group:title": "Border",
                    "anyOf": [
                      {
                        "title": "Solid",
                        "const": "border-solid",
                        "type": "string"
                      },
                      {
                        "title": "Dashed",
                        "const": "border-dashed",
                        "type": "string"
                      },
                      {
                        "title": "Dotted",
                        "const": "border-dotted",
                        "type": "string"
                      }
                    ]
                  },
                  "padding": {
                    "$id": "padding",
                    "default": "p-2",
                    "title": "Padding",
                    "description": "Space between the content and the border",
                    "ui:field": "enum",
                    "ui:display": "button-group",
                    "ui:group": "spacing",
                    "ui:group:title": "Spacing",
                    "anyOf": [
                      {
                        "title": "None",
                        "const": "p-0",
                        "type": "string"
                      },
                      {
                        "title": "S",
                        "const": "p-2",
                        "type": "string"
                      },
                      {
                        "title": "M",
                        "const": "p-4",
                        "type": "string"
                      },
                      {
                        "title": "L",
                        "const": "p-8",
                        "type": "string"
                      },
                      {
                        "title": "XL",
                        "const": "p-16",
                        "type": "string"
                      }
                    ]
                  },
                  "backgroundColor": {
                    "$id": "backgroundColor",
                    "default": "transparent",
                    "title": "Background color",
                    "ui:field": "color",
                    "ui:color-type": "background",
                    "ui:group": "colors",
                    "ui:group:title": "Colors",
                    "type": "string"
                  },
                  "opacity": {
                    "$id": "opacity",
                    "minimum": 0.1,
                    "maximum": 1,
                    "multipleOf": 0.1,
                    "title": "Opacity",
                    "description": "Global opacity",
                    "ui:field": "slider",
                    "ui:group": "effects",
                    "ui:group:title": "Effects",
                    "type": "number"
                  },
                  "shadow": {
                    "$id": "shadow",
                    "default": "shadow-none",
                    "title": "Shadow",
                    "description": "Shadow",
                    "ui:field": "enum",
                    "ui:display": "button-group",
                    "ui:group": "effects",
                    "ui:group:title": "Effects",
                    "anyOf": [
                      {
                        "title": "None",
                        "const": "shadow-none",
                        "type": "string"
                      },
                      {
                        "title": "S",
                        "const": "shadow-sm",
                        "type": "string"
                      },
                      {
                        "title": "M",
                        "const": "shadow-md",
                        "type": "string"
                      },
                      {
                        "title": "L",
                        "const": "shadow-lg",
                        "type": "string"
                      },
                      {
                        "title": "XL",
                        "const": "shadow-xl",
                        "type": "string"
                      },
                      {
                        "title": "2XL",
                        "const": "shadow-2xl",
                        "type": "string"
                      }
                    ]
                  },
                  "heroFontSize": {
                    "default": "font-size-hero-3",
                    "title": "Font size",
                    "ui:field": "enum",
                    "ui:display": "button-group",
                    "ui:group": "border",
                    "anyOf": [
                      {
                        "title": "1",
                        "const": "font-size-hero-1",
                        "type": "string"
                      },
                      {
                        "title": "2",
                        "const": "font-size-hero-2",
                        "type": "string"
                      },
                      {
                        "title": "3",
                        "const": "font-size-hero-3",
                        "type": "string"
                      },
                      {
                        "title": "4",
                        "const": "font-size-hero-4",
                        "type": "string"
                      },
                      {
                        "title": "5",
                        "const": "font-size-hero-5",
                        "type": "string"
                      }
                    ]
                  }
                },
                "required": [
                  "content",
                  "editable",
                  "id",
                  "borderRadius",
                  "borderWidth",
                  "borderColor",
                  "borderStyle",
                  "padding",
                  "backgroundColor",
                  "shadow",
                  "heroFontSize"
                ]
              },
              {
                "type": "object",
                "properties": {
                  "content": {
                    "default": "Click to edit",
                    "title": "Content",
                    "description": "The text content",
                    "ui:widget": "hidden",
                    "type": "string"
                  },
                  "editable": {
                    "title": "Editable",
                    "description": "Allow editing of text content",
                    "default": false,
                    "ui:widget": "hidden",
                    "type": "boolean"
                  },
                  "id": {
                    "title": "Brick ID",
                    "ui:widget": "hidden",
                    "type": "string"
                  },
                  "className": {
                    "default": "",
                    "ui:widget": "hidden",
                    "type": "string"
                  },
                  "z": {
                    "title": "Z-index",
                    "ui:widget": "hidden",
                    "type": "number"
                  },
                  "borderRadius": {
                    "$id": "borderRadius",
                    "default": "rounded-none",
                    "title": "Rounding",
                    "description": "Corners rounding",
                    "ui:field": "enum",
                    "ui:display": "button-group",
                    "ui:group": "border",
                    "ui:group:title": "Border",
                    "anyOf": [
                      {
                        "title": "None",
                        "const": "rounded-none",
                        "type": "string"
                      },
                      {
                        "title": "S",
                        "const": "rounded-sm",
                        "type": "string"
                      },
                      {
                        "title": "M",
                        "const": "rounded-md",
                        "type": "string"
                      },
                      {
                        "title": "L",
                        "const": "rounded-lg",
                        "type": "string"
                      },
                      {
                        "title": "XL",
                        "const": "rounded-xl",
                        "type": "string"
                      },
                      {
                        "title": "Full",
                        "const": "rounded-full",
                        "type": "string"
                      }
                    ]
                  },
                  "borderWidth": {
                    "$id": "borderWidth",
                    "default": "border-0",
                    "title": "Border width",
                    "ui:field": "enum",
                    "ui:display": "button-group",
                    "ui:group": "border",
                    "ui:group:title": "Border",
                    "anyOf": [
                      {
                        "title": "None",
                        "const": "border-0",
                        "type": "string"
                      },
                      {
                        "title": "S",
                        "const": "border",
                        "type": "string"
                      },
                      {
                        "title": "M",
                        "const": "border-2",
                        "type": "string"
                      },
                      {
                        "title": "L",
                        "const": "border-4",
                        "type": "string"
                      },
                      {
                        "title": "XL",
                        "const": "border-8",
                        "type": "string"
                      }
                    ]
                  },
                  "borderColor": {
                    "$id": "borderColor",
                    "default": "transparent",
                    "title": "Border color",
                    "ui:field": "color",
                    "ui:color-type": "border",
                    "ui:group": "border",
                    "ui:group:title": "Border",
                    "type": "string"
                  },
                  "borderStyle": {
                    "$id": "borderStyle",
                    "default": "border-solid",
                    "title": "Border style",
                    "description": "The brick border style",
                    "ui:field": "enum",
                    "ui:display": "button-group",
                    "ui:group": "border",
                    "ui:group:title": "Border",
                    "anyOf": [
                      {
                        "title": "Solid",
                        "const": "border-solid",
                        "type": "string"
                      },
                      {
                        "title": "Dashed",
                        "const": "border-dashed",
                        "type": "string"
                      },
                      {
                        "title": "Dotted",
                        "const": "border-dotted",
                        "type": "string"
                      }
                    ]
                  },
                  "padding": {
                    "$id": "padding",
                    "default": "p-2",
                    "title": "Padding",
                    "description": "Space between the content and the border",
                    "ui:field": "enum",
                    "ui:display": "button-group",
                    "ui:group": "spacing",
                    "ui:group:title": "Spacing",
                    "anyOf": [
                      {
                        "title": "None",
                        "const": "p-0",
                        "type": "string"
                      },
                      {
                        "title": "S",
                        "const": "p-2",
                        "type": "string"
                      },
                      {
                        "title": "M",
                        "const": "p-4",
                        "type": "string"
                      },
                      {
                        "title": "L",
                        "const": "p-8",
                        "type": "string"
                      },
                      {
                        "title": "XL",
                        "const": "p-16",
                        "type": "string"
                      }
                    ]
                  },
                  "backgroundColor": {
                    "$id": "backgroundColor",
                    "default": "transparent",
                    "title": "Background color",
                    "ui:field": "color",
                    "ui:color-type": "background",
                    "ui:group": "colors",
                    "ui:group:title": "Colors",
                    "type": "string"
                  },
                  "opacity": {
                    "$id": "opacity",
                    "minimum": 0.1,
                    "maximum": 1,
                    "multipleOf": 0.1,
                    "title": "Opacity",
                    "description": "Global opacity",
                    "ui:field": "slider",
                    "ui:group": "effects",
                    "ui:group:title": "Effects",
                    "type": "number"
                  },
                  "shadow": {
                    "$id": "shadow",
                    "default": "shadow-none",
                    "title": "Shadow",
                    "description": "Shadow",
                    "ui:field": "enum",
                    "ui:display": "button-group",
                    "ui:group": "effects",
                    "ui:group:title": "Effects",
                    "anyOf": [
                      {
                        "title": "None",
                        "const": "shadow-none",
                        "type": "string"
                      },
                      {
                        "title": "S",
                        "const": "shadow-sm",
                        "type": "string"
                      },
                      {
                        "title": "M",
                        "const": "shadow-md",
                        "type": "string"
                      },
                      {
                        "title": "L",
                        "const": "shadow-lg",
                        "type": "string"
                      },
                      {
                        "title": "XL",
                        "const": "shadow-xl",
                        "type": "string"
                      },
                      {
                        "title": "2XL",
                        "const": "shadow-2xl",
                        "type": "string"
                      }
                    ]
                  },
                  "heroFontSize": {
                    "default": "font-size-hero-3",
                    "title": "Font size",
                    "ui:field": "enum",
                    "ui:display": "button-group",
                    "ui:group": "border",
                    "anyOf": [
                      {
                        "title": "1",
                        "const": "font-size-hero-1",
                        "type": "string"
                      },
                      {
                        "title": "2",
                        "const": "font-size-hero-2",
                        "type": "string"
                      },
                      {
                        "title": "3",
                        "const": "font-size-hero-3",
                        "type": "string"
                      },
                      {
                        "title": "4",
                        "const": "font-size-hero-4",
                        "type": "string"
                      },
                      {
                        "title": "5",
                        "const": "font-size-hero-5",
                        "type": "string"
                      }
                    ]
                  }
                },
                "required": [
                  "content",
                  "editable",
                  "id",
                  "borderRadius",
                  "borderWidth",
                  "borderColor",
                  "borderStyle",
                  "padding",
                  "backgroundColor",
                  "shadow",
                  "heroFontSize"
                ]
              },
              {
                "type": "object",
                "properties": {
                  "content": {
                    "default": "Click to edit",
                    "title": "Content",
                    "description": "The text content",
                    "ui:widget": "hidden",
                    "type": "string"
                  },
                  "editable": {
                    "title": "Editable",
                    "description": "Allow editing of text content",
                    "default": false,
                    "ui:widget": "hidden",
                    "type": "boolean"
                  },
                  "id": {
                    "title": "Brick ID",
                    "ui:widget": "hidden",
                    "type": "string"
                  },
                  "className": {
                    "default": "",
                    "ui:widget": "hidden",
                    "type": "string"
                  },
                  "z": {
                    "title": "Z-index",
                    "ui:widget": "hidden",
                    "type": "number"
                  },
                  "borderRadius": {
                    "$id": "borderRadius",
                    "default": "rounded-none",
                    "title": "Rounding",
                    "description": "Corners rounding",
                    "ui:field": "enum",
                    "ui:display": "button-group",
                    "ui:group": "border",
                    "ui:group:title": "Border",
                    "anyOf": [
                      {
                        "title": "None",
                        "const": "rounded-none",
                        "type": "string"
                      },
                      {
                        "title": "S",
                        "const": "rounded-sm",
                        "type": "string"
                      },
                      {
                        "title": "M",
                        "const": "rounded-md",
                        "type": "string"
                      },
                      {
                        "title": "L",
                        "const": "rounded-lg",
                        "type": "string"
                      },
                      {
                        "title": "XL",
                        "const": "rounded-xl",
                        "type": "string"
                      },
                      {
                        "title": "Full",
                        "const": "rounded-full",
                        "type": "string"
                      }
                    ]
                  },
                  "borderWidth": {
                    "$id": "borderWidth",
                    "default": "border-0",
                    "title": "Border width",
                    "ui:field": "enum",
                    "ui:display": "button-group",
                    "ui:group": "border",
                    "ui:group:title": "Border",
                    "anyOf": [
                      {
                        "title": "None",
                        "const": "border-0",
                        "type": "string"
                      },
                      {
                        "title": "S",
                        "const": "border",
                        "type": "string"
                      },
                      {
                        "title": "M",
                        "const": "border-2",
                        "type": "string"
                      },
                      {
                        "title": "L",
                        "const": "border-4",
                        "type": "string"
                      },
                      {
                        "title": "XL",
                        "const": "border-8",
                        "type": "string"
                      }
                    ]
                  },
                  "borderColor": {
                    "$id": "borderColor",
                    "default": "transparent",
                    "title": "Border color",
                    "ui:field": "color",
                    "ui:color-type": "border",
                    "ui:group": "border",
                    "ui:group:title": "Border",
                    "type": "string"
                  },
                  "borderStyle": {
                    "$id": "borderStyle",
                    "default": "border-solid",
                    "title": "Border style",
                    "description": "The brick border style",
                    "ui:field": "enum",
                    "ui:display": "button-group",
                    "ui:group": "border",
                    "ui:group:title": "Border",
                    "anyOf": [
                      {
                        "title": "Solid",
                        "const": "border-solid",
                        "type": "string"
                      },
                      {
                        "title": "Dashed",
                        "const": "border-dashed",
                        "type": "string"
                      },
                      {
                        "title": "Dotted",
                        "const": "border-dotted",
                        "type": "string"
                      }
                    ]
                  },
                  "padding": {
                    "$id": "padding",
                    "default": "p-2",
                    "title": "Padding",
                    "description": "Space between the content and the border",
                    "ui:field": "enum",
                    "ui:display": "button-group",
                    "ui:group": "spacing",
                    "ui:group:title": "Spacing",
                    "anyOf": [
                      {
                        "title": "None",
                        "const": "p-0",
                        "type": "string"
                      },
                      {
                        "title": "S",
                        "const": "p-2",
                        "type": "string"
                      },
                      {
                        "title": "M",
                        "const": "p-4",
                        "type": "string"
                      },
                      {
                        "title": "L",
                        "const": "p-8",
                        "type": "string"
                      },
                      {
                        "title": "XL",
                        "const": "p-16",
                        "type": "string"
                      }
                    ]
                  },
                  "backgroundColor": {
                    "$id": "backgroundColor",
                    "default": "transparent",
                    "title": "Background color",
                    "ui:field": "color",
                    "ui:color-type": "background",
                    "ui:group": "colors",
                    "ui:group:title": "Colors",
                    "type": "string"
                  },
                  "opacity": {
                    "$id": "opacity",
                    "minimum": 0.1,
                    "maximum": 1,
                    "multipleOf": 0.1,
                    "title": "Opacity",
                    "description": "Global opacity",
                    "ui:field": "slider",
                    "ui:group": "effects",
                    "ui:group:title": "Effects",
                    "type": "number"
                  },
                  "shadow": {
                    "$id": "shadow",
                    "default": "shadow-none",
                    "title": "Shadow",
                    "description": "Shadow",
                    "ui:field": "enum",
                    "ui:display": "button-group",
                    "ui:group": "effects",
                    "ui:group:title": "Effects",
                    "anyOf": [
                      {
                        "title": "None",
                        "const": "shadow-none",
                        "type": "string"
                      },
                      {
                        "title": "S",
                        "const": "shadow-sm",
                        "type": "string"
                      },
                      {
                        "title": "M",
                        "const": "shadow-md",
                        "type": "string"
                      },
                      {
                        "title": "L",
                        "const": "shadow-lg",
                        "type": "string"
                      },
                      {
                        "title": "XL",
                        "const": "shadow-xl",
                        "type": "string"
                      },
                      {
                        "title": "2XL",
                        "const": "shadow-2xl",
                        "type": "string"
                      }
                    ]
                  },
                  "heroFontSize": {
                    "default": "font-size-hero-3",
                    "title": "Font size",
                    "ui:field": "enum",
                    "ui:display": "button-group",
                    "ui:group": "border",
                    "anyOf": [
                      {
                        "title": "1",
                        "const": "font-size-hero-1",
                        "type": "string"
                      },
                      {
                        "title": "2",
                        "const": "font-size-hero-2",
                        "type": "string"
                      },
                      {
                        "title": "3",
                        "const": "font-size-hero-3",
                        "type": "string"
                      },
                      {
                        "title": "4",
                        "const": "font-size-hero-4",
                        "type": "string"
                      },
                      {
                        "title": "5",
                        "const": "font-size-hero-5",
                        "type": "string"
                      }
                    ]
                  }
                },
                "required": [
                  "content",
                  "editable",
                  "id",
                  "borderRadius",
                  "borderWidth",
                  "borderColor",
                  "borderStyle",
                  "padding",
                  "backgroundColor",
                  "shadow",
                  "heroFontSize"
                ]
              },
              {
                "type": "object",
                "properties": {
                  "content": {
                    "default": "Click to edit",
                    "title": "Content",
                    "description": "The text content",
                    "ui:widget": "hidden",
                    "type": "string"
                  },
                  "editable": {
                    "title": "Editable",
                    "description": "Allow editing of text content",
                    "default": false,
                    "ui:widget": "hidden",
                    "type": "boolean"
                  },
                  "id": {
                    "title": "Brick ID",
                    "ui:widget": "hidden",
                    "type": "string"
                  },
                  "className": {
                    "default": "",
                    "ui:widget": "hidden",
                    "type": "string"
                  },
                  "z": {
                    "title": "Z-index",
                    "ui:widget": "hidden",
                    "type": "number"
                  },
                  "borderRadius": {
                    "$id": "borderRadius",
                    "default": "rounded-none",
                    "title": "Rounding",
                    "description": "Corners rounding",
                    "ui:field": "enum",
                    "ui:display": "button-group",
                    "ui:group": "border",
                    "ui:group:title": "Border",
                    "anyOf": [
                      {
                        "title": "None",
                        "const": "rounded-none",
                        "type": "string"
                      },
                      {
                        "title": "S",
                        "const": "rounded-sm",
                        "type": "string"
                      },
                      {
                        "title": "M",
                        "const": "rounded-md",
                        "type": "string"
                      },
                      {
                        "title": "L",
                        "const": "rounded-lg",
                        "type": "string"
                      },
                      {
                        "title": "XL",
                        "const": "rounded-xl",
                        "type": "string"
                      },
                      {
                        "title": "Full",
                        "const": "rounded-full",
                        "type": "string"
                      }
                    ]
                  },
                  "borderWidth": {
                    "$id": "borderWidth",
                    "default": "border-0",
                    "title": "Border width",
                    "ui:field": "enum",
                    "ui:display": "button-group",
                    "ui:group": "border",
                    "ui:group:title": "Border",
                    "anyOf": [
                      {
                        "title": "None",
                        "const": "border-0",
                        "type": "string"
                      },
                      {
                        "title": "S",
                        "const": "border",
                        "type": "string"
                      },
                      {
                        "title": "M",
                        "const": "border-2",
                        "type": "string"
                      },
                      {
                        "title": "L",
                        "const": "border-4",
                        "type": "string"
                      },
                      {
                        "title": "XL",
                        "const": "border-8",
                        "type": "string"
                      }
                    ]
                  },
                  "borderColor": {
                    "$id": "borderColor",
                    "default": "transparent",
                    "title": "Border color",
                    "ui:field": "color",
                    "ui:color-type": "border",
                    "ui:group": "border",
                    "ui:group:title": "Border",
                    "type": "string"
                  },
                  "borderStyle": {
                    "$id": "borderStyle",
                    "default": "border-solid",
                    "title": "Border style",
                    "description": "The brick border style",
                    "ui:field": "enum",
                    "ui:display": "button-group",
                    "ui:group": "border",
                    "ui:group:title": "Border",
                    "anyOf": [
                      {
                        "title": "Solid",
                        "const": "border-solid",
                        "type": "string"
                      },
                      {
                        "title": "Dashed",
                        "const": "border-dashed",
                        "type": "string"
                      },
                      {
                        "title": "Dotted",
                        "const": "border-dotted",
                        "type": "string"
                      }
                    ]
                  },
                  "padding": {
                    "$id": "padding",
                    "default": "p-2",
                    "title": "Padding",
                    "description": "Space between the content and the border",
                    "ui:field": "enum",
                    "ui:display": "button-group",
                    "ui:group": "spacing",
                    "ui:group:title": "Spacing",
                    "anyOf": [
                      {
                        "title": "None",
                        "const": "p-0",
                        "type": "string"
                      },
                      {
                        "title": "S",
                        "const": "p-2",
                        "type": "string"
                      },
                      {
                        "title": "M",
                        "const": "p-4",
                        "type": "string"
                      },
                      {
                        "title": "L",
                        "const": "p-8",
                        "type": "string"
                      },
                      {
                        "title": "XL",
                        "const": "p-16",
                        "type": "string"
                      }
                    ]
                  },
                  "backgroundColor": {
                    "$id": "backgroundColor",
                    "default": "transparent",
                    "title": "Background color",
                    "ui:field": "color",
                    "ui:color-type": "background",
                    "ui:group": "colors",
                    "ui:group:title": "Colors",
                    "type": "string"
                  },
                  "opacity": {
                    "$id": "opacity",
                    "minimum": 0.1,
                    "maximum": 1,
                    "multipleOf": 0.1,
                    "title": "Opacity",
                    "description": "Global opacity",
                    "ui:field": "slider",
                    "ui:group": "effects",
                    "ui:group:title": "Effects",
                    "type": "number"
                  },
                  "shadow": {
                    "$id": "shadow",
                    "default": "shadow-none",
                    "title": "Shadow",
                    "description": "Shadow",
                    "ui:field": "enum",
                    "ui:display": "button-group",
                    "ui:group": "effects",
                    "ui:group:title": "Effects",
                    "anyOf": [
                      {
                        "title": "None",
                        "const": "shadow-none",
                        "type": "string"
                      },
                      {
                        "title": "S",
                        "const": "shadow-sm",
                        "type": "string"
                      },
                      {
                        "title": "M",
                        "const": "shadow-md",
                        "type": "string"
                      },
                      {
                        "title": "L",
                        "const": "shadow-lg",
                        "type": "string"
                      },
                      {
                        "title": "XL",
                        "const": "shadow-xl",
                        "type": "string"
                      },
                      {
                        "title": "2XL",
                        "const": "shadow-2xl",
                        "type": "string"
                      }
                    ]
                  },
                  "heroFontSize": {
                    "default": "font-size-hero-3",
                    "title": "Font size",
                    "ui:field": "enum",
                    "ui:display": "button-group",
                    "ui:group": "border",
                    "anyOf": [
                      {
                        "title": "1",
                        "const": "font-size-hero-1",
                        "type": "string"
                      },
                      {
                        "title": "2",
                        "const": "font-size-hero-2",
                        "type": "string"
                      },
                      {
                        "title": "3",
                        "const": "font-size-hero-3",
                        "type": "string"
                      },
                      {
                        "title": "4",
                        "const": "font-size-hero-4",
                        "type": "string"
                      },
                      {
                        "title": "5",
                        "const": "font-size-hero-5",
                        "type": "string"
                      }
                    ]
                  }
                },
                "required": [
                  "content",
                  "editable",
                  "id",
                  "borderRadius",
                  "borderWidth",
                  "borderColor",
                  "borderStyle",
                  "padding",
                  "backgroundColor",
                  "shadow",
                  "heroFontSize"
                ]
              },
              {
                "type": "object",
                "properties": {
                  "content": {
                    "default": "Click to edit",
                    "title": "Content",
                    "description": "The text content",
                    "ui:widget": "hidden",
                    "type": "string"
                  },
                  "editable": {
                    "title": "Editable",
                    "description": "Allow editing of text content",
                    "default": false,
                    "ui:widget": "hidden",
                    "type": "boolean"
                  },
                  "id": {
                    "title": "Brick ID",
                    "ui:widget": "hidden",
                    "type": "string"
                  },
                  "className": {
                    "default": "",
                    "ui:widget": "hidden",
                    "type": "string"
                  },
                  "z": {
                    "title": "Z-index",
                    "ui:widget": "hidden",
                    "type": "number"
                  },
                  "borderRadius": {
                    "$id": "borderRadius",
                    "default": "rounded-none",
                    "title": "Rounding",
                    "description": "Corners rounding",
                    "ui:field": "enum",
                    "ui:display": "button-group",
                    "ui:group": "border",
                    "ui:group:title": "Border",
                    "anyOf": [
                      {
                        "title": "None",
                        "const": "rounded-none",
                        "type": "string"
                      },
                      {
                        "title": "S",
                        "const": "rounded-sm",
                        "type": "string"
                      },
                      {
                        "title": "M",
                        "const": "rounded-md",
                        "type": "string"
                      },
                      {
                        "title": "L",
                        "const": "rounded-lg",
                        "type": "string"
                      },
                      {
                        "title": "XL",
                        "const": "rounded-xl",
                        "type": "string"
                      },
                      {
                        "title": "Full",
                        "const": "rounded-full",
                        "type": "string"
                      }
                    ]
                  },
                  "borderWidth": {
                    "$id": "borderWidth",
                    "default": "border-0",
                    "title": "Border width",
                    "ui:field": "enum",
                    "ui:display": "button-group",
                    "ui:group": "border",
                    "ui:group:title": "Border",
                    "anyOf": [
                      {
                        "title": "None",
                        "const": "border-0",
                        "type": "string"
                      },
                      {
                        "title": "S",
                        "const": "border",
                        "type": "string"
                      },
                      {
                        "title": "M",
                        "const": "border-2",
                        "type": "string"
                      },
                      {
                        "title": "L",
                        "const": "border-4",
                        "type": "string"
                      },
                      {
                        "title": "XL",
                        "const": "border-8",
                        "type": "string"
                      }
                    ]
                  },
                  "borderColor": {
                    "$id": "borderColor",
                    "default": "transparent",
                    "title": "Border color",
                    "ui:field": "color",
                    "ui:color-type": "border",
                    "ui:group": "border",
                    "ui:group:title": "Border",
                    "type": "string"
                  },
                  "borderStyle": {
                    "$id": "borderStyle",
                    "default": "border-solid",
                    "title": "Border style",
                    "description": "The brick border style",
                    "ui:field": "enum",
                    "ui:display": "button-group",
                    "ui:group": "border",
                    "ui:group:title": "Border",
                    "anyOf": [
                      {
                        "title": "Solid",
                        "const": "border-solid",
                        "type": "string"
                      },
                      {
                        "title": "Dashed",
                        "const": "border-dashed",
                        "type": "string"
                      },
                      {
                        "title": "Dotted",
                        "const": "border-dotted",
                        "type": "string"
                      }
                    ]
                  },
                  "padding": {
                    "$id": "padding",
                    "default": "p-2",
                    "title": "Padding",
                    "description": "Space between the content and the border",
                    "ui:field": "enum",
                    "ui:display": "button-group",
                    "ui:group": "spacing",
                    "ui:group:title": "Spacing",
                    "anyOf": [
                      {
                        "title": "None",
                        "const": "p-0",
                        "type": "string"
                      },
                      {
                        "title": "S",
                        "const": "p-2",
                        "type": "string"
                      },
                      {
                        "title": "M",
                        "const": "p-4",
                        "type": "string"
                      },
                      {
                        "title": "L",
                        "const": "p-8",
                        "type": "string"
                      },
                      {
                        "title": "XL",
                        "const": "p-16",
                        "type": "string"
                      }
                    ]
                  },
                  "backgroundColor": {
                    "$id": "backgroundColor",
                    "default": "transparent",
                    "title": "Background color",
                    "ui:field": "color",
                    "ui:color-type": "background",
                    "ui:group": "colors",
                    "ui:group:title": "Colors",
                    "type": "string"
                  },
                  "opacity": {
                    "$id": "opacity",
                    "minimum": 0.1,
                    "maximum": 1,
                    "multipleOf": 0.1,
                    "title": "Opacity",
                    "description": "Global opacity",
                    "ui:field": "slider",
                    "ui:group": "effects",
                    "ui:group:title": "Effects",
                    "type": "number"
                  },
                  "shadow": {
                    "$id": "shadow",
                    "default": "shadow-none",
                    "title": "Shadow",
                    "description": "Shadow",
                    "ui:field": "enum",
                    "ui:display": "button-group",
                    "ui:group": "effects",
                    "ui:group:title": "Effects",
                    "anyOf": [
                      {
                        "title": "None",
                        "const": "shadow-none",
                        "type": "string"
                      },
                      {
                        "title": "S",
                        "const": "shadow-sm",
                        "type": "string"
                      },
                      {
                        "title": "M",
                        "const": "shadow-md",
                        "type": "string"
                      },
                      {
                        "title": "L",
                        "const": "shadow-lg",
                        "type": "string"
                      },
                      {
                        "title": "XL",
                        "const": "shadow-xl",
                        "type": "string"
                      },
                      {
                        "title": "2XL",
                        "const": "shadow-2xl",
                        "type": "string"
                      }
                    ]
                  },
                  "heroFontSize": {
                    "default": "font-size-hero-3",
                    "title": "Font size",
                    "ui:field": "enum",
                    "ui:display": "button-group",
                    "ui:group": "border",
                    "anyOf": [
                      {
                        "title": "1",
                        "const": "font-size-hero-1",
                        "type": "string"
                      },
                      {
                        "title": "2",
                        "const": "font-size-hero-2",
                        "type": "string"
                      },
                      {
                        "title": "3",
                        "const": "font-size-hero-3",
                        "type": "string"
                      },
                      {
                        "title": "4",
                        "const": "font-size-hero-4",
                        "type": "string"
                      },
                      {
                        "title": "5",
                        "const": "font-size-hero-5",
                        "type": "string"
                      }
                    ]
                  }
                },
                "required": [
                  "content",
                  "editable",
                  "id",
                  "borderRadius",
                  "borderWidth",
                  "borderColor",
                  "borderStyle",
                  "padding",
                  "backgroundColor",
                  "shadow",
                  "heroFontSize"
                ]
              },
              {
                "type": "object",
                "properties": {
                  "content": {
                    "default": "Click to edit",
                    "title": "Content",
                    "description": "The text content",
                    "ui:widget": "hidden",
                    "type": "string"
                  },
                  "editable": {
                    "title": "Editable",
                    "description": "Allow editing of text content",
                    "default": false,
                    "ui:widget": "hidden",
                    "type": "boolean"
                  },
                  "id": {
                    "title": "Brick ID",
                    "ui:widget": "hidden",
                    "type": "string"
                  },
                  "className": {
                    "default": "",
                    "ui:widget": "hidden",
                    "type": "string"
                  },
                  "z": {
                    "title": "Z-index",
                    "ui:widget": "hidden",
                    "type": "number"
                  },
                  "borderRadius": {
                    "$id": "borderRadius",
                    "default": "rounded-none",
                    "title": "Rounding",
                    "description": "Corners rounding",
                    "ui:field": "enum",
                    "ui:display": "button-group",
                    "ui:group": "border",
                    "ui:group:title": "Border",
                    "anyOf": [
                      {
                        "title": "None",
                        "const": "rounded-none",
                        "type": "string"
                      },
                      {
                        "title": "S",
                        "const": "rounded-sm",
                        "type": "string"
                      },
                      {
                        "title": "M",
                        "const": "rounded-md",
                        "type": "string"
                      },
                      {
                        "title": "L",
                        "const": "rounded-lg",
                        "type": "string"
                      },
                      {
                        "title": "XL",
                        "const": "rounded-xl",
                        "type": "string"
                      },
                      {
                        "title": "Full",
                        "const": "rounded-full",
                        "type": "string"
                      }
                    ]
                  },
                  "borderWidth": {
                    "$id": "borderWidth",
                    "default": "border-0",
                    "title": "Border width",
                    "ui:field": "enum",
                    "ui:display": "button-group",
                    "ui:group": "border",
                    "ui:group:title": "Border",
                    "anyOf": [
                      {
                        "title": "None",
                        "const": "border-0",
                        "type": "string"
                      },
                      {
                        "title": "S",
                        "const": "border",
                        "type": "string"
                      },
                      {
                        "title": "M",
                        "const": "border-2",
                        "type": "string"
                      },
                      {
                        "title": "L",
                        "const": "border-4",
                        "type": "string"
                      },
                      {
                        "title": "XL",
                        "const": "border-8",
                        "type": "string"
                      }
                    ]
                  },
                  "borderColor": {
                    "$id": "borderColor",
                    "default": "transparent",
                    "title": "Border color",
                    "ui:field": "color",
                    "ui:color-type": "border",
                    "ui:group": "border",
                    "ui:group:title": "Border",
                    "type": "string"
                  },
                  "borderStyle": {
                    "$id": "borderStyle",
                    "default": "border-solid",
                    "title": "Border style",
                    "description": "The brick border style",
                    "ui:field": "enum",
                    "ui:display": "button-group",
                    "ui:group": "border",
                    "ui:group:title": "Border",
                    "anyOf": [
                      {
                        "title": "Solid",
                        "const": "border-solid",
                        "type": "string"
                      },
                      {
                        "title": "Dashed",
                        "const": "border-dashed",
                        "type": "string"
                      },
                      {
                        "title": "Dotted",
                        "const": "border-dotted",
                        "type": "string"
                      }
                    ]
                  },
                  "padding": {
                    "$id": "padding",
                    "default": "p-2",
                    "title": "Padding",
                    "description": "Space between the content and the border",
                    "ui:field": "enum",
                    "ui:display": "button-group",
                    "ui:group": "spacing",
                    "ui:group:title": "Spacing",
                    "anyOf": [
                      {
                        "title": "None",
                        "const": "p-0",
                        "type": "string"
                      },
                      {
                        "title": "S",
                        "const": "p-2",
                        "type": "string"
                      },
                      {
                        "title": "M",
                        "const": "p-4",
                        "type": "string"
                      },
                      {
                        "title": "L",
                        "const": "p-8",
                        "type": "string"
                      },
                      {
                        "title": "XL",
                        "const": "p-16",
                        "type": "string"
                      }
                    ]
                  },
                  "backgroundColor": {
                    "$id": "backgroundColor",
                    "default": "transparent",
                    "title": "Background color",
                    "ui:field": "color",
                    "ui:color-type": "background",
                    "ui:group": "colors",
                    "ui:group:title": "Colors",
                    "type": "string"
                  },
                  "opacity": {
                    "$id": "opacity",
                    "minimum": 0.1,
                    "maximum": 1,
                    "multipleOf": 0.1,
                    "title": "Opacity",
                    "description": "Global opacity",
                    "ui:field": "slider",
                    "ui:group": "effects",
                    "ui:group:title": "Effects",
                    "type": "number"
                  },
                  "shadow": {
                    "$id": "shadow",
                    "default": "shadow-none",
                    "title": "Shadow",
                    "description": "Shadow",
                    "ui:field": "enum",
                    "ui:display": "button-group",
                    "ui:group": "effects",
                    "ui:group:title": "Effects",
                    "anyOf": [
                      {
                        "title": "None",
                        "const": "shadow-none",
                        "type": "string"
                      },
                      {
                        "title": "S",
                        "const": "shadow-sm",
                        "type": "string"
                      },
                      {
                        "title": "M",
                        "const": "shadow-md",
                        "type": "string"
                      },
                      {
                        "title": "L",
                        "const": "shadow-lg",
                        "type": "string"
                      },
                      {
                        "title": "XL",
                        "const": "shadow-xl",
                        "type": "string"
                      },
                      {
                        "title": "2XL",
                        "const": "shadow-2xl",
                        "type": "string"
                      }
                    ]
                  },
                  "heroFontSize": {
                    "default": "font-size-hero-3",
                    "title": "Font size",
                    "ui:field": "enum",
                    "ui:display": "button-group",
                    "ui:group": "border",
                    "anyOf": [
                      {
                        "title": "1",
                        "const": "font-size-hero-1",
                        "type": "string"
                      },
                      {
                        "title": "2",
                        "const": "font-size-hero-2",
                        "type": "string"
                      },
                      {
                        "title": "3",
                        "const": "font-size-hero-3",
                        "type": "string"
                      },
                      {
                        "title": "4",
                        "const": "font-size-hero-4",
                        "type": "string"
                      },
                      {
                        "title": "5",
                        "const": "font-size-hero-5",
                        "type": "string"
                      }
                    ]
                  }
                },
                "required": [
                  "content",
                  "editable",
                  "id",
                  "borderRadius",
                  "borderWidth",
                  "borderColor",
                  "borderStyle",
                  "padding",
                  "backgroundColor",
                  "shadow",
                  "heroFontSize"
                ]
              },
              {
                "type": "object",
                "properties": {
                  "src": {
                    "default": "https://placehold.co/400x200",
                    "title": "File",
                    "ui:field": "file",
                    "ui:accept": "image/*",
                    "ui:show-img-search": true,
                    "ui:allow-url": true,
                    "type": "string"
                  },
                  "alt": {
                    "title": "Alternate Text",
                    "description": "Alternative text for the image. Recommended for screen readers and SEO.",
                    "ui:placeholder": "Your image description",
                    "type": "string"
                  },
                  "id": {
                    "title": "Brick ID",
                    "ui:widget": "hidden",
                    "type": "string"
                  },
                  "className": {
                    "default": "",
                    "ui:widget": "hidden",
                    "type": "string"
                  },
                  "z": {
                    "title": "Z-index",
                    "ui:widget": "hidden",
                    "type": "number"
                  },
                  "borderRadius": {
                    "$id": "borderRadius",
                    "default": "rounded-none",
                    "title": "Rounding",
                    "description": "Corners rounding",
                    "ui:field": "enum",
                    "ui:display": "button-group",
                    "ui:group": "border",
                    "ui:group:title": "Border",
                    "anyOf": [
                      {
                        "title": "None",
                        "const": "rounded-none",
                        "type": "string"
                      },
                      {
                        "title": "S",
                        "const": "rounded-sm",
                        "type": "string"
                      },
                      {
                        "title": "M",
                        "const": "rounded-md",
                        "type": "string"
                      },
                      {
                        "title": "L",
                        "const": "rounded-lg",
                        "type": "string"
                      },
                      {
                        "title": "XL",
                        "const": "rounded-xl",
                        "type": "string"
                      },
                      {
                        "title": "Full",
                        "const": "rounded-full",
                        "type": "string"
                      }
                    ]
                  },
                  "borderWidth": {
                    "$id": "borderWidth",
                    "default": "border-0",
                    "title": "Border width",
                    "ui:field": "enum",
                    "ui:display": "button-group",
                    "ui:group": "border",
                    "ui:group:title": "Border",
                    "anyOf": [
                      {
                        "title": "None",
                        "const": "border-0",
                        "type": "string"
                      },
                      {
                        "title": "S",
                        "const": "border",
                        "type": "string"
                      },
                      {
                        "title": "M",
                        "const": "border-2",
                        "type": "string"
                      },
                      {
                        "title": "L",
                        "const": "border-4",
                        "type": "string"
                      },
                      {
                        "title": "XL",
                        "const": "border-8",
                        "type": "string"
                      }
                    ]
                  },
                  "borderColor": {
                    "$id": "borderColor",
                    "default": "transparent",
                    "title": "Border color",
                    "ui:field": "color",
                    "ui:color-type": "border",
                    "ui:group": "border",
                    "ui:group:title": "Border",
                    "type": "string"
                  },
                  "borderStyle": {
                    "$id": "borderStyle",
                    "default": "border-solid",
                    "title": "Border style",
                    "description": "The brick border style",
                    "ui:field": "enum",
                    "ui:display": "button-group",
                    "ui:group": "border",
                    "ui:group:title": "Border",
                    "anyOf": [
                      {
                        "title": "Solid",
                        "const": "border-solid",
                        "type": "string"
                      },
                      {
                        "title": "Dashed",
                        "const": "border-dashed",
                        "type": "string"
                      },
                      {
                        "title": "Dotted",
                        "const": "border-dotted",
                        "type": "string"
                      }
                    ]
                  },
                  "padding": {
                    "$id": "padding",
                    "default": "p-2",
                    "title": "Padding",
                    "description": "Space between the content and the border",
                    "ui:field": "enum",
                    "ui:display": "button-group",
                    "ui:group": "spacing",
                    "ui:group:title": "Spacing",
                    "anyOf": [
                      {
                        "title": "None",
                        "const": "p-0",
                        "type": "string"
                      },
                      {
                        "title": "S",
                        "const": "p-2",
                        "type": "string"
                      },
                      {
                        "title": "M",
                        "const": "p-4",
                        "type": "string"
                      },
                      {
                        "title": "L",
                        "const": "p-8",
                        "type": "string"
                      },
                      {
                        "title": "XL",
                        "const": "p-16",
                        "type": "string"
                      }
                    ]
                  },
                  "backgroundColor": {
                    "$id": "backgroundColor",
                    "default": "transparent",
                    "title": "Background color",
                    "ui:field": "color",
                    "ui:color-type": "background",
                    "ui:group": "colors",
                    "ui:group:title": "Colors",
                    "type": "string"
                  },
                  "opacity": {
                    "$id": "opacity",
                    "minimum": 0.1,
                    "maximum": 1,
                    "multipleOf": 0.1,
                    "title": "Opacity",
                    "description": "Global opacity",
                    "ui:field": "slider",
                    "ui:group": "effects",
                    "ui:group:title": "Effects",
                    "type": "number"
                  },
                  "shadow": {
                    "$id": "shadow",
                    "default": "shadow-none",
                    "title": "Shadow",
                    "description": "Shadow",
                    "ui:field": "enum",
                    "ui:display": "button-group",
                    "ui:group": "effects",
                    "ui:group:title": "Effects",
                    "anyOf": [
                      {
                        "title": "None",
                        "const": "shadow-none",
                        "type": "string"
                      },
                      {
                        "title": "S",
                        "const": "shadow-sm",
                        "type": "string"
                      },
                      {
                        "title": "M",
                        "const": "shadow-md",
                        "type": "string"
                      },
                      {
                        "title": "L",
                        "const": "shadow-lg",
                        "type": "string"
                      },
                      {
                        "title": "XL",
                        "const": "shadow-xl",
                        "type": "string"
                      },
                      {
                        "title": "2XL",
                        "const": "shadow-2xl",
                        "type": "string"
                      }
                    ]
                  }
                },
                "required": [
                  "src",
                  "alt",
                  "id",
                  "borderRadius",
                  "borderWidth",
                  "borderColor",
                  "borderStyle",
                  "padding",
                  "backgroundColor",
                  "shadow"
                ]
              },
              {
                "type": "object",
                "properties": {
                  "content": {
                    "default": "Click to edit",
                    "title": "Content",
                    "description": "The text content",
                    "ui:widget": "hidden",
                    "type": "string"
                  },
                  "editable": {
                    "title": "Editable",
                    "description": "Allow editing of text content",
                    "default": false,
                    "ui:widget": "hidden",
                    "type": "boolean"
                  },
                  "id": {
                    "title": "Brick ID",
                    "ui:widget": "hidden",
                    "type": "string"
                  },
                  "className": {
                    "default": "",
                    "ui:widget": "hidden",
                    "type": "string"
                  },
                  "z": {
                    "title": "Z-index",
                    "ui:widget": "hidden",
                    "type": "number"
                  },
                  "borderRadius": {
                    "$id": "borderRadius",
                    "default": "rounded-none",
                    "title": "Rounding",
                    "description": "Corners rounding",
                    "ui:field": "enum",
                    "ui:display": "button-group",
                    "ui:group": "border",
                    "ui:group:title": "Border",
                    "anyOf": [
                      {
                        "title": "None",
                        "const": "rounded-none",
                        "type": "string"
                      },
                      {
                        "title": "S",
                        "const": "rounded-sm",
                        "type": "string"
                      },
                      {
                        "title": "M",
                        "const": "rounded-md",
                        "type": "string"
                      },
                      {
                        "title": "L",
                        "const": "rounded-lg",
                        "type": "string"
                      },
                      {
                        "title": "XL",
                        "const": "rounded-xl",
                        "type": "string"
                      },
                      {
                        "title": "Full",
                        "const": "rounded-full",
                        "type": "string"
                      }
                    ]
                  },
                  "borderWidth": {
                    "$id": "borderWidth",
                    "default": "border-0",
                    "title": "Border width",
                    "ui:field": "enum",
                    "ui:display": "button-group",
                    "ui:group": "border",
                    "ui:group:title": "Border",
                    "anyOf": [
                      {
                        "title": "None",
                        "const": "border-0",
                        "type": "string"
                      },
                      {
                        "title": "S",
                        "const": "border",
                        "type": "string"
                      },
                      {
                        "title": "M",
                        "const": "border-2",
                        "type": "string"
                      },
                      {
                        "title": "L",
                        "const": "border-4",
                        "type": "string"
                      },
                      {
                        "title": "XL",
                        "const": "border-8",
                        "type": "string"
                      }
                    ]
                  },
                  "borderColor": {
                    "$id": "borderColor",
                    "default": "transparent",
                    "title": "Border color",
                    "ui:field": "color",
                    "ui:color-type": "border",
                    "ui:group": "border",
                    "ui:group:title": "Border",
                    "type": "string"
                  },
                  "borderStyle": {
                    "$id": "borderStyle",
                    "default": "border-solid",
                    "title": "Border style",
                    "description": "The brick border style",
                    "ui:field": "enum",
                    "ui:display": "button-group",
                    "ui:group": "border",
                    "ui:group:title": "Border",
                    "anyOf": [
                      {
                        "title": "Solid",
                        "const": "border-solid",
                        "type": "string"
                      },
                      {
                        "title": "Dashed",
                        "const": "border-dashed",
                        "type": "string"
                      },
                      {
                        "title": "Dotted",
                        "const": "border-dotted",
                        "type": "string"
                      }
                    ]
                  },
                  "padding": {
                    "$id": "padding",
                    "default": "p-2",
                    "title": "Padding",
                    "description": "Space between the content and the border",
                    "ui:field": "enum",
                    "ui:display": "button-group",
                    "ui:group": "spacing",
                    "ui:group:title": "Spacing",
                    "anyOf": [
                      {
                        "title": "None",
                        "const": "p-0",
                        "type": "string"
                      },
                      {
                        "title": "S",
                        "const": "p-2",
                        "type": "string"
                      },
                      {
                        "title": "M",
                        "const": "p-4",
                        "type": "string"
                      },
                      {
                        "title": "L",
                        "const": "p-8",
                        "type": "string"
                      },
                      {
                        "title": "XL",
                        "const": "p-16",
                        "type": "string"
                      }
                    ]
                  },
                  "backgroundColor": {
                    "$id": "backgroundColor",
                    "default": "transparent",
                    "title": "Background color",
                    "ui:field": "color",
                    "ui:color-type": "background",
                    "ui:group": "colors",
                    "ui:group:title": "Colors",
                    "type": "string"
                  },
                  "opacity": {
                    "$id": "opacity",
                    "minimum": 0.1,
                    "maximum": 1,
                    "multipleOf": 0.1,
                    "title": "Opacity",
                    "description": "Global opacity",
                    "ui:field": "slider",
                    "ui:group": "effects",
                    "ui:group:title": "Effects",
                    "type": "number"
                  },
                  "shadow": {
                    "$id": "shadow",
                    "default": "shadow-none",
                    "title": "Shadow",
                    "description": "Shadow",
                    "ui:field": "enum",
                    "ui:display": "button-group",
                    "ui:group": "effects",
                    "ui:group:title": "Effects",
                    "anyOf": [
                      {
                        "title": "None",
                        "const": "shadow-none",
                        "type": "string"
                      },
                      {
                        "title": "S",
                        "const": "shadow-sm",
                        "type": "string"
                      },
                      {
                        "title": "M",
                        "const": "shadow-md",
                        "type": "string"
                      },
                      {
                        "title": "L",
                        "const": "shadow-lg",
                        "type": "string"
                      },
                      {
                        "title": "XL",
                        "const": "shadow-xl",
                        "type": "string"
                      },
                      {
                        "title": "2XL",
                        "const": "shadow-2xl",
                        "type": "string"
                      }
                    ]
                  },
                  "heroFontSize": {
                    "default": "font-size-hero-3",
                    "title": "Font size",
                    "ui:field": "enum",
                    "ui:display": "button-group",
                    "ui:group": "border",
                    "anyOf": [
                      {
                        "title": "1",
                        "const": "font-size-hero-1",
                        "type": "string"
                      },
                      {
                        "title": "2",
                        "const": "font-size-hero-2",
                        "type": "string"
                      },
                      {
                        "title": "3",
                        "const": "font-size-hero-3",
                        "type": "string"
                      },
                      {
                        "title": "4",
                        "const": "font-size-hero-4",
                        "type": "string"
                      },
                      {
                        "title": "5",
                        "const": "font-size-hero-5",
                        "type": "string"
                      }
                    ]
                  }
                },
                "required": [
                  "content",
                  "editable",
                  "id",
                  "borderRadius",
                  "borderWidth",
                  "borderColor",
                  "borderStyle",
                  "padding",
                  "backgroundColor",
                  "shadow",
                  "heroFontSize"
                ]
              },
              {
                "type": "object",
                "properties": {
                  "content": {
                    "default": "Click to edit",
                    "title": "Content",
                    "description": "The text content",
                    "ui:widget": "hidden",
                    "type": "string"
                  },
                  "editable": {
                    "title": "Editable",
                    "description": "Allow editing of text content",
                    "default": false,
                    "ui:widget": "hidden",
                    "type": "boolean"
                  },
                  "id": {
                    "title": "Brick ID",
                    "ui:widget": "hidden",
                    "type": "string"
                  },
                  "className": {
                    "default": "",
                    "ui:widget": "hidden",
                    "type": "string"
                  },
                  "z": {
                    "title": "Z-index",
                    "ui:widget": "hidden",
                    "type": "number"
                  },
                  "borderRadius": {
                    "$id": "borderRadius",
                    "default": "rounded-none",
                    "title": "Rounding",
                    "description": "Corners rounding",
                    "ui:field": "enum",
                    "ui:display": "button-group",
                    "ui:group": "border",
                    "ui:group:title": "Border",
                    "anyOf": [
                      {
                        "title": "None",
                        "const": "rounded-none",
                        "type": "string"
                      },
                      {
                        "title": "S",
                        "const": "rounded-sm",
                        "type": "string"
                      },
                      {
                        "title": "M",
                        "const": "rounded-md",
                        "type": "string"
                      },
                      {
                        "title": "L",
                        "const": "rounded-lg",
                        "type": "string"
                      },
                      {
                        "title": "XL",
                        "const": "rounded-xl",
                        "type": "string"
                      },
                      {
                        "title": "Full",
                        "const": "rounded-full",
                        "type": "string"
                      }
                    ]
                  },
                  "borderWidth": {
                    "$id": "borderWidth",
                    "default": "border-0",
                    "title": "Border width",
                    "ui:field": "enum",
                    "ui:display": "button-group",
                    "ui:group": "border",
                    "ui:group:title": "Border",
                    "anyOf": [
                      {
                        "title": "None",
                        "const": "border-0",
                        "type": "string"
                      },
                      {
                        "title": "S",
                        "const": "border",
                        "type": "string"
                      },
                      {
                        "title": "M",
                        "const": "border-2",
                        "type": "string"
                      },
                      {
                        "title": "L",
                        "const": "border-4",
                        "type": "string"
                      },
                      {
                        "title": "XL",
                        "const": "border-8",
                        "type": "string"
                      }
                    ]
                  },
                  "borderColor": {
                    "$id": "borderColor",
                    "default": "transparent",
                    "title": "Border color",
                    "ui:field": "color",
                    "ui:color-type": "border",
                    "ui:group": "border",
                    "ui:group:title": "Border",
                    "type": "string"
                  },
                  "borderStyle": {
                    "$id": "borderStyle",
                    "default": "border-solid",
                    "title": "Border style",
                    "description": "The brick border style",
                    "ui:field": "enum",
                    "ui:display": "button-group",
                    "ui:group": "border",
                    "ui:group:title": "Border",
                    "anyOf": [
                      {
                        "title": "Solid",
                        "const": "border-solid",
                        "type": "string"
                      },
                      {
                        "title": "Dashed",
                        "const": "border-dashed",
                        "type": "string"
                      },
                      {
                        "title": "Dotted",
                        "const": "border-dotted",
                        "type": "string"
                      }
                    ]
                  },
                  "padding": {
                    "$id": "padding",
                    "default": "p-2",
                    "title": "Padding",
                    "description": "Space between the content and the border",
                    "ui:field": "enum",
                    "ui:display": "button-group",
                    "ui:group": "spacing",
                    "ui:group:title": "Spacing",
                    "anyOf": [
                      {
                        "title": "None",
                        "const": "p-0",
                        "type": "string"
                      },
                      {
                        "title": "S",
                        "const": "p-2",
                        "type": "string"
                      },
                      {
                        "title": "M",
                        "const": "p-4",
                        "type": "string"
                      },
                      {
                        "title": "L",
                        "const": "p-8",
                        "type": "string"
                      },
                      {
                        "title": "XL",
                        "const": "p-16",
                        "type": "string"
                      }
                    ]
                  },
                  "backgroundColor": {
                    "$id": "backgroundColor",
                    "default": "transparent",
                    "title": "Background color",
                    "ui:field": "color",
                    "ui:color-type": "background",
                    "ui:group": "colors",
                    "ui:group:title": "Colors",
                    "type": "string"
                  },
                  "opacity": {
                    "$id": "opacity",
                    "minimum": 0.1,
                    "maximum": 1,
                    "multipleOf": 0.1,
                    "title": "Opacity",
                    "description": "Global opacity",
                    "ui:field": "slider",
                    "ui:group": "effects",
                    "ui:group:title": "Effects",
                    "type": "number"
                  },
                  "shadow": {
                    "$id": "shadow",
                    "default": "shadow-none",
                    "title": "Shadow",
                    "description": "Shadow",
                    "ui:field": "enum",
                    "ui:display": "button-group",
                    "ui:group": "effects",
                    "ui:group:title": "Effects",
                    "anyOf": [
                      {
                        "title": "None",
                        "const": "shadow-none",
                        "type": "string"
                      },
                      {
                        "title": "S",
                        "const": "shadow-sm",
                        "type": "string"
                      },
                      {
                        "title": "M",
                        "const": "shadow-md",
                        "type": "string"
                      },
                      {
                        "title": "L",
                        "const": "shadow-lg",
                        "type": "string"
                      },
                      {
                        "title": "XL",
                        "const": "shadow-xl",
                        "type": "string"
                      },
                      {
                        "title": "2XL",
                        "const": "shadow-2xl",
                        "type": "string"
                      }
                    ]
                  },
                  "heroFontSize": {
                    "default": "font-size-hero-3",
                    "title": "Font size",
                    "ui:field": "enum",
                    "ui:display": "button-group",
                    "ui:group": "border",
                    "anyOf": [
                      {
                        "title": "1",
                        "const": "font-size-hero-1",
                        "type": "string"
                      },
                      {
                        "title": "2",
                        "const": "font-size-hero-2",
                        "type": "string"
                      },
                      {
                        "title": "3",
                        "const": "font-size-hero-3",
                        "type": "string"
                      },
                      {
                        "title": "4",
                        "const": "font-size-hero-4",
                        "type": "string"
                      },
                      {
                        "title": "5",
                        "const": "font-size-hero-5",
                        "type": "string"
                      }
                    ]
                  }
                },
                "required": [
                  "content",
                  "editable",
                  "id",
                  "borderRadius",
                  "borderWidth",
                  "borderColor",
                  "borderStyle",
                  "padding",
                  "backgroundColor",
                  "shadow",
                  "heroFontSize"
                ]
              },
              {
                "type": "object",
                "properties": {
                  "content": {
                    "default": "Click to edit",
                    "title": "Content",
                    "description": "The text content",
                    "ui:widget": "hidden",
                    "type": "string"
                  },
                  "editable": {
                    "title": "Editable",
                    "description": "Allow editing of text content",
                    "default": false,
                    "ui:widget": "hidden",
                    "type": "boolean"
                  },
                  "id": {
                    "title": "Brick ID",
                    "ui:widget": "hidden",
                    "type": "string"
                  },
                  "className": {
                    "default": "",
                    "ui:widget": "hidden",
                    "type": "string"
                  },
                  "z": {
                    "title": "Z-index",
                    "ui:widget": "hidden",
                    "type": "number"
                  },
                  "borderRadius": {
                    "$id": "borderRadius",
                    "default": "rounded-none",
                    "title": "Rounding",
                    "description": "Corners rounding",
                    "ui:field": "enum",
                    "ui:display": "button-group",
                    "ui:group": "border",
                    "ui:group:title": "Border",
                    "anyOf": [
                      {
                        "title": "None",
                        "const": "rounded-none",
                        "type": "string"
                      },
                      {
                        "title": "S",
                        "const": "rounded-sm",
                        "type": "string"
                      },
                      {
                        "title": "M",
                        "const": "rounded-md",
                        "type": "string"
                      },
                      {
                        "title": "L",
                        "const": "rounded-lg",
                        "type": "string"
                      },
                      {
                        "title": "XL",
                        "const": "rounded-xl",
                        "type": "string"
                      },
                      {
                        "title": "Full",
                        "const": "rounded-full",
                        "type": "string"
                      }
                    ]
                  },
                  "borderWidth": {
                    "$id": "borderWidth",
                    "default": "border-0",
                    "title": "Border width",
                    "ui:field": "enum",
                    "ui:display": "button-group",
                    "ui:group": "border",
                    "ui:group:title": "Border",
                    "anyOf": [
                      {
                        "title": "None",
                        "const": "border-0",
                        "type": "string"
                      },
                      {
                        "title": "S",
                        "const": "border",
                        "type": "string"
                      },
                      {
                        "title": "M",
                        "const": "border-2",
                        "type": "string"
                      },
                      {
                        "title": "L",
                        "const": "border-4",
                        "type": "string"
                      },
                      {
                        "title": "XL",
                        "const": "border-8",
                        "type": "string"
                      }
                    ]
                  },
                  "borderColor": {
                    "$id": "borderColor",
                    "default": "transparent",
                    "title": "Border color",
                    "ui:field": "color",
                    "ui:color-type": "border",
                    "ui:group": "border",
                    "ui:group:title": "Border",
                    "type": "string"
                  },
                  "borderStyle": {
                    "$id": "borderStyle",
                    "default": "border-solid",
                    "title": "Border style",
                    "description": "The brick border style",
                    "ui:field": "enum",
                    "ui:display": "button-group",
                    "ui:group": "border",
                    "ui:group:title": "Border",
                    "anyOf": [
                      {
                        "title": "Solid",
                        "const": "border-solid",
                        "type": "string"
                      },
                      {
                        "title": "Dashed",
                        "const": "border-dashed",
                        "type": "string"
                      },
                      {
                        "title": "Dotted",
                        "const": "border-dotted",
                        "type": "string"
                      }
                    ]
                  },
                  "padding": {
                    "$id": "padding",
                    "default": "p-2",
                    "title": "Padding",
                    "description": "Space between the content and the border",
                    "ui:field": "enum",
                    "ui:display": "button-group",
                    "ui:group": "spacing",
                    "ui:group:title": "Spacing",
                    "anyOf": [
                      {
                        "title": "None",
                        "const": "p-0",
                        "type": "string"
                      },
                      {
                        "title": "S",
                        "const": "p-2",
                        "type": "string"
                      },
                      {
                        "title": "M",
                        "const": "p-4",
                        "type": "string"
                      },
                      {
                        "title": "L",
                        "const": "p-8",
                        "type": "string"
                      },
                      {
                        "title": "XL",
                        "const": "p-16",
                        "type": "string"
                      }
                    ]
                  },
                  "backgroundColor": {
                    "$id": "backgroundColor",
                    "default": "transparent",
                    "title": "Background color",
                    "ui:field": "color",
                    "ui:color-type": "background",
                    "ui:group": "colors",
                    "ui:group:title": "Colors",
                    "type": "string"
                  },
                  "opacity": {
                    "$id": "opacity",
                    "minimum": 0.1,
                    "maximum": 1,
                    "multipleOf": 0.1,
                    "title": "Opacity",
                    "description": "Global opacity",
                    "ui:field": "slider",
                    "ui:group": "effects",
                    "ui:group:title": "Effects",
                    "type": "number"
                  },
                  "shadow": {
                    "$id": "shadow",
                    "default": "shadow-none",
                    "title": "Shadow",
                    "description": "Shadow",
                    "ui:field": "enum",
                    "ui:display": "button-group",
                    "ui:group": "effects",
                    "ui:group:title": "Effects",
                    "anyOf": [
                      {
                        "title": "None",
                        "const": "shadow-none",
                        "type": "string"
                      },
                      {
                        "title": "S",
                        "const": "shadow-sm",
                        "type": "string"
                      },
                      {
                        "title": "M",
                        "const": "shadow-md",
                        "type": "string"
                      },
                      {
                        "title": "L",
                        "const": "shadow-lg",
                        "type": "string"
                      },
                      {
                        "title": "XL",
                        "const": "shadow-xl",
                        "type": "string"
                      },
                      {
                        "title": "2XL",
                        "const": "shadow-2xl",
                        "type": "string"
                      }
                    ]
                  },
                  "heroFontSize": {
                    "default": "font-size-hero-3",
                    "title": "Font size",
                    "ui:field": "enum",
                    "ui:display": "button-group",
                    "ui:group": "border",
                    "anyOf": [
                      {
                        "title": "1",
                        "const": "font-size-hero-1",
                        "type": "string"
                      },
                      {
                        "title": "2",
                        "const": "font-size-hero-2",
                        "type": "string"
                      },
                      {
                        "title": "3",
                        "const": "font-size-hero-3",
                        "type": "string"
                      },
                      {
                        "title": "4",
                        "const": "font-size-hero-4",
                        "type": "string"
                      },
                      {
                        "title": "5",
                        "const": "font-size-hero-5",
                        "type": "string"
                      }
                    ]
                  }
                },
                "required": [
                  "content",
                  "editable",
                  "id",
                  "borderRadius",
                  "borderWidth",
                  "borderColor",
                  "borderStyle",
                  "padding",
                  "backgroundColor",
                  "shadow",
                  "heroFontSize"
                ]
              },
              {
                "type": "object",
                "properties": {
                  "id": {
                    "title": "Brick ID",
                    "ui:widget": "hidden",
                    "type": "string"
                  },
                  "className": {
                    "default": "",
                    "ui:widget": "hidden",
                    "type": "string"
                  },
                  "z": {
                    "title": "Z-index",
                    "ui:widget": "hidden",
                    "type": "number"
                  },
                  "content": {
                    "default": "Click to edit",
                    "title": "Content",
                    "description": "The text content",
                    "ui:widget": "hidden",
                    "type": "string"
                  },
                  "editable": {
                    "title": "Editable",
                    "description": "Allow editing of text content",
                    "default": false,
                    "ui:widget": "hidden",
                    "type": "boolean"
                  },
                  "borderRadius": {
                    "$id": "borderRadius",
                    "default": "rounded-none",
                    "title": "Rounding",
                    "description": "Corners rounding",
                    "ui:field": "enum",
                    "ui:display": "button-group",
                    "ui:group": "border",
                    "ui:group:title": "Border",
                    "anyOf": [
                      {
                        "title": "None",
                        "const": "rounded-none",
                        "type": "string"
                      },
                      {
                        "title": "S",
                        "const": "rounded-sm",
                        "type": "string"
                      },
                      {
                        "title": "M",
                        "const": "rounded-md",
                        "type": "string"
                      },
                      {
                        "title": "L",
                        "const": "rounded-lg",
                        "type": "string"
                      },
                      {
                        "title": "XL",
                        "const": "rounded-xl",
                        "type": "string"
                      },
                      {
                        "title": "Full",
                        "const": "rounded-full",
                        "type": "string"
                      }
                    ]
                  },
                  "borderWidth": {
                    "$id": "borderWidth",
                    "default": "border-0",
                    "title": "Border width",
                    "ui:field": "enum",
                    "ui:display": "button-group",
                    "ui:group": "border",
                    "ui:group:title": "Border",
                    "anyOf": [
                      {
                        "title": "None",
                        "const": "border-0",
                        "type": "string"
                      },
                      {
                        "title": "S",
                        "const": "border",
                        "type": "string"
                      },
                      {
                        "title": "M",
                        "const": "border-2",
                        "type": "string"
                      },
                      {
                        "title": "L",
                        "const": "border-4",
                        "type": "string"
                      },
                      {
                        "title": "XL",
                        "const": "border-8",
                        "type": "string"
                      }
                    ]
                  },
                  "borderColor": {
                    "$id": "borderColor",
                    "default": "transparent",
                    "title": "Border color",
                    "ui:field": "color",
                    "ui:color-type": "border",
                    "ui:group": "border",
                    "ui:group:title": "Border",
                    "type": "string"
                  },
                  "borderStyle": {
                    "$id": "borderStyle",
                    "default": "border-solid",
                    "title": "Border style",
                    "description": "The brick border style",
                    "ui:field": "enum",
                    "ui:display": "button-group",
                    "ui:group": "border",
                    "ui:group:title": "Border",
                    "anyOf": [
                      {
                        "title": "Solid",
                        "const": "border-solid",
                        "type": "string"
                      },
                      {
                        "title": "Dashed",
                        "const": "border-dashed",
                        "type": "string"
                      },
                      {
                        "title": "Dotted",
                        "const": "border-dotted",
                        "type": "string"
                      }
                    ]
                  },
                  "padding": {
                    "$id": "padding",
                    "default": "p-2",
                    "title": "Padding",
                    "description": "Space between the content and the border",
                    "ui:field": "enum",
                    "ui:display": "button-group",
                    "ui:group": "spacing",
                    "ui:group:title": "Spacing",
                    "anyOf": [
                      {
                        "title": "None",
                        "const": "p-0",
                        "type": "string"
                      },
                      {
                        "title": "S",
                        "const": "p-2",
                        "type": "string"
                      },
                      {
                        "title": "M",
                        "const": "p-4",
                        "type": "string"
                      },
                      {
                        "title": "L",
                        "const": "p-8",
                        "type": "string"
                      },
                      {
                        "title": "XL",
                        "const": "p-16",
                        "type": "string"
                      }
                    ]
                  },
                  "backgroundColor": {
                    "$id": "backgroundColor",
                    "default": "transparent",
                    "title": "Background color",
                    "ui:field": "color",
                    "ui:color-type": "background",
                    "ui:group": "colors",
                    "ui:group:title": "Colors",
                    "type": "string"
                  },
                  "opacity": {
                    "$id": "opacity",
                    "minimum": 0.1,
                    "maximum": 1,
                    "multipleOf": 0.1,
                    "title": "Opacity",
                    "description": "Global opacity",
                    "ui:field": "slider",
                    "ui:group": "effects",
                    "ui:group:title": "Effects",
                    "type": "number"
                  },
                  "shadow": {
                    "$id": "shadow",
                    "default": "shadow-none",
                    "title": "Shadow",
                    "description": "Shadow",
                    "ui:field": "enum",
                    "ui:display": "button-group",
                    "ui:group": "effects",
                    "ui:group:title": "Effects",
                    "anyOf": [
                      {
                        "title": "None",
                        "const": "shadow-none",
                        "type": "string"
                      },
                      {
                        "title": "S",
                        "const": "shadow-sm",
                        "type": "string"
                      },
                      {
                        "title": "M",
                        "const": "shadow-md",
                        "type": "string"
                      },
                      {
                        "title": "L",
                        "const": "shadow-lg",
                        "type": "string"
                      },
                      {
                        "title": "XL",
                        "const": "shadow-xl",
                        "type": "string"
                      },
                      {
                        "title": "2XL",
                        "const": "shadow-2xl",
                        "type": "string"
                      }
                    ]
                  }
                },
                "required": [
                  "id",
                  "content",
                  "editable",
                  "borderRadius",
                  "borderWidth",
                  "borderColor",
                  "borderStyle",
                  "padding",
                  "backgroundColor",
                  "shadow"
                ]
              },
              {
                "type": "object",
                "properties": {
                  "src": {
                    "default": "https://placehold.co/400x200",
                    "title": "File",
                    "description": "The image file",
                    "ui:field": "file",
                    "type": "string"
                  },
                  "alt": {
                    "title": "Alt Text",
                    "description": "Alternative text for the image",
                    "ui:placeholder": "Your image description",
                    "type": "string"
                  },
                  "id": {
                    "title": "Brick ID",
                    "ui:widget": "hidden",
                    "type": "string"
                  },
                  "className": {
                    "default": "",
                    "ui:widget": "hidden",
                    "type": "string"
                  },
                  "z": {
                    "title": "Z-index",
                    "ui:widget": "hidden",
                    "type": "number"
                  }
                },
                "required": [
                  "src",
                  "alt",
                  "id"
                ]
              },
              {
                "type": "object",
                "patternProperties": {
                  "^(.*)$": {}
                }
              }
            ]
          },
          "id": {
            "title": "ID",
            "description": "A unique identifier for the brick.",
            "type": "string"
          },
          "position": {
            "title": "Position",
            "description": "The position of the brick in the layout.",
            "type": "object",
            "properties": {
              "mobile": {
                "type": "object",
                "properties": {
                  "x": {
                    "title": "X",
                    "description": "The column start (0-based) in grid units, not pixels.",
                    "type": "number"
                  },
                  "y": {
                    "title": "Y",
                    "description": "The row start (0-based) in grid units, not pixels.",
                    "type": "number"
                  },
                  "w": {
                    "title": "Width",
                    "description": "The width in columns in grid units, not pixels.",
                    "type": "number"
                  },
                  "h": {
                    "title": "Height",
                    "description": "The height in rows in grid units, not pixels.",
                    "type": "number"
                  },
                  "manualHeight": {
                    "description": "Do not use this field. It is used internally by the editor.",
                    "type": "number"
                  },
                  "hidden": {
                    "description": "Do not use this field. It is used internally by the editor.",
                    "type": "boolean"
                  }
                },
                "required": [
                  "x",
                  "y",
                  "w",
                  "h"
                ]
              },
              "desktop": {
                "type": "object",
                "properties": {
                  "x": {
                    "title": "X",
                    "description": "The column start (0-based) in grid units, not pixels.",
                    "type": "number"
                  },
                  "y": {
                    "title": "Y",
                    "description": "The row start (0-based) in grid units, not pixels.",
                    "type": "number"
                  },
                  "w": {
                    "title": "Width",
                    "description": "The width in columns in grid units, not pixels.",
                    "type": "number"
                  },
                  "h": {
                    "title": "Height",
                    "description": "The height in rows in grid units, not pixels.",
                    "type": "number"
                  },
                  "manualHeight": {
                    "description": "Do not use this field. It is used internally by the editor.",
                    "type": "number"
                  },
                  "hidden": {
                    "description": "Do not use this field. It is used internally by the editor.",
                    "type": "boolean"
                  }
                },
                "required": [
                  "x",
                  "y",
                  "w",
                  "h"
                ]
              }
            },
            "required": [
              "mobile",
              "desktop"
            ]
          }
        },
        "required": [
          "type",
          "props",
          "id",
          "position"
        ]
      }
    },
    "tags": {
      "type": "array",
      "items": {
        "type": "string"
      }
    }
  },
  "required": [
    "label",
    "path",
    "bricks",
    "tags"
  ]
}
```

### `attributes`

Attributes affect various settings of the site/page.
They can appear at the top level of the template schema, in which case they are applied at the site level.
They can also appear at the page level, in which case they are applied at the page level, possibly
overriding the site attributes.

Here is the code in charge of handling attributes. You can deduct the schema yourself.

```typescript
import {
  Type,
  type StringOptions,
  type NumberOptions,
  type SchemaOptions,
  type ObjectOptions,
  type TProperties,
} from "@sinclair/typebox";
import { Value } from "@sinclair/typebox/value";
import type { ElementColor } from "./themes/color-system";

// KEEP IT
type EnumOption = {
  title?: string;
  description?: string;
  value: string;
  icon?: string;
};

type AttributeOptions<T extends Record<string, unknown>> = {
  "ui:group"?: string;
  "ui:group:title"?: string;
  "ui:group:order"?: number;
  advanced?: boolean;
  "ui:hidden"?: boolean | "if-empty";
} & T;

type GeoPoint = { lat: number; lng: number; name?: string };

export function defineAttributes(attrs: TProperties) {
  // Attributes starting with "$" are reserved for internal use
  for (const key in attrs) {
    if (key.startsWith("$")) {
      throw new Error(
        `Attribute names starting with '$' (like "${key}") are reserved for internal use. Please rename it.`,
      );
    }
  }
  return Type.Object(
    { ...defaultAttributes, ...attrs },
    {
      $id: "attributes",
    },
  );
}

export type Attributes = ReturnType<typeof defineAttributes>;

export const attr = {
  /**
   * Define a text
   */
  string(name: string, defaultValue = "", opts?: AttributeOptions<Omit<StringOptions, "title" | "default">>) {
    return Type.String({ title: name, default: defaultValue, ...opts });
  },
  /**
   * Define a number attribute
   */
  number(name: string, defaultValue = 0, opts?: AttributeOptions<Omit<NumberOptions, "title" | "default">>) {
    return Type.Number({ title: name, default: defaultValue, ...opts });
  },
  /**
   * Define a boolean
   */
  boolean(
    name: string,
    defaultValue = false,
    opts?: AttributeOptions<Omit<SchemaOptions, "title" | "default">>,
  ) {
    const defaultOpts = {
      "ui:field": "switch",
    };
    return Type.Boolean({ title: name, default: defaultValue, ...defaultOpts, ...opts });
  },
  /**
   * Define an enum
   */
  enum(
    name: string,
    defaultValue: string,
    opts: AttributeOptions<
      Omit<SchemaOptions, "title" | "default"> & {
        options: EnumOption[] | string[];
        displayAs?: "radio" | "select" | "button-group" | "icon-group";
      }
    >,
  ) {
    const defaultOpts = {
      "ui:field": "enum",
      "ui:display": opts.displayAs || "select",
    };
    const { options, displayAs, ...commonOpts } = opts;
    return Type.Union(
      options.map((opt) =>
        Type.Literal(typeof opt === "string" ? opt : opt.value, {
          title: typeof opt === "string" ? opt : opt.title,
          "ui:icon": typeof opt === "string" ? undefined : opt.icon,
        }),
      ),
      {
        title: name,
        default: defaultValue,
        ...defaultOpts,
        ...commonOpts,
      },
    );
  },
  /**
   * Define a file that can be uploaded by the user
   */
  file(
    name: string,
    defaultValue = "",
    opts: AttributeOptions<Omit<SchemaOptions, "title" | "default">> = {},
  ) {
    return Type.String({ title: name, default: defaultValue, ...opts, format: "data-url" });
  },
  /**
   * Define a URL
   */
  url(
    name: string,
    defaultValue = "",
    opts: AttributeOptions<Omit<SchemaOptions, "title" | "default">> = {},
  ) {
    return Type.String({ title: name, default: defaultValue, ...opts, format: "uri" });
  },
  /**
   * Define a color attribute
   */
  color(
    name: string,
    defaultValue: ElementColor = "",
    opts?: AttributeOptions<Omit<StringOptions, "title" | "default">>,
  ) {
    const defaultOpts = {
      "ui:field": "color",
      // important for the json schema form not to display several fields because of the union type
      // "ui:fieldReplacesAnyOrOneOf": true,
    };
    return Type.String({ title: name, default: defaultValue, ...defaultOpts, ...opts });
  },
  /**
   * Define a date
   */
  date(
    name: string,
    defaultValue = new Date(),
    opts: AttributeOptions<Omit<SchemaOptions, "title" | "default">> = {},
  ) {
    return Type.String({ title: name, default: defaultValue.toISOString(), ...opts, format: "date" });
  },
  /**
   * Define a date and time
   */
  datetime(
    name: string,
    defaultValue = new Date(),
    opts: AttributeOptions<Omit<SchemaOptions, "title" | "default">> = {},
  ) {
    return Type.String({ title: name, default: defaultValue.toISOString(), ...opts, format: "date-time" });
  },
  /**
   * Define a geolocation
   */
  geolocation(
    name: string,
    defaultValue: GeoPoint,
    opts: AttributeOptions<Omit<ObjectOptions, "title" | "default">> = {},
  ) {
    return Type.Object(
      {
        lat: Type.Number({ minimum: -90, maximum: 90 }),
        lng: Type.Number({ minimum: -180, maximum: 180 }),
        name: Type.Optional(Type.String({ title: "Name" })),
      },
      { title: name, default: defaultValue, ...opts },
    );
  },
};

// Default attributes
const defaultAttributes = {
  $pageLanguage: attr.enum("Page language", "en", {
    options: [
      { value: "ar", title: "Arabic" },
      { value: "zh", title: "Chinese" },
      { value: "cs", title: "Czech" },
      { value: "nl", title: "Dutch" },
      { value: "en", title: "English" },
      { value: "fr", title: "French" },
      { value: "de", title: "German" },
      { value: "he", title: "Hebrew" },
      { value: "hi", title: "Hindi" },
      { value: "it", title: "Italian" },
      { value: "ja", title: "Japanese" },
      { value: "ko", title: "Korean" },
      { value: "fa", title: "Persian" },
      { value: "pl", title: "Polish" },
      { value: "pt", title: "Portuguese" },
      { value: "ru", title: "Russian" },
      { value: "es", title: "Spanish" },
      { value: "tr", title: "Turkish" },
      { value: "vi", title: "Vietnamese" },
    ],
    "ui:group": "meta",
    "ui:group:title": "Meta tags / SEO",
  }),

  $pagePath: attr.string("Page path", "/", {
    description: "The URL path of the page",
    "ui:group": "location",
    "ui:group:title": "Location",
    "ui:group:order": 1,
    "ui:field": "path",
  }),

  $pageTitle: attr.string("Page title", "Untitled", {
    "ui:group": "meta",
    "ui:group:title": "Meta tags / SEO",
  }),

  $pageDescription: attr.string("Page description", "", {
    "ui:widget": "textarea",
    "ui:options": {
      rows: 3,
      widget: "textarea",
    },
    "ui:group": "meta",
    "ui:group:title": "Meta tags / SEO",
  }),
  $pageKeywords: attr.string("Page keywords", "", {
    "ui:group": "meta",
    "ui:group:title": "Meta tags / SEO",
  }),

  $pageLastUpdated: attr.datetime("Last updated", undefined, { "ui:hidden": true }),

  // --- layout attributes ---
  $pageWidth: attr.enum("Page width", "max-w-screen-2xl", {
    options: [
      {
        value: "max-w-screen-lg",
        title: "M",
        description: "Common for text-heavy content/blog posts",
      },
      { value: "max-w-screen-xl", title: "L", description: "Usefull or some landing pages" },
      { value: "max-w-screen-2xl", title: "XL", description: "Common width" },
      { value: "max-w-full", title: "Full", description: "Takes the entire space" },
    ],
    description: "The maximum width of the page. Desktop only.",
    displayAs: "button-group",
    "ui:group": "layout",
    "ui:group:title": "Page Layout & Design",
  }),

  $pagePaddingVertical: attr.enum("Page vertical spacing", "20", {
    options: [
      { value: "0", title: "None" },
      { value: "10", title: "S" },
      { value: "20", title: "M" },
      { value: "30", title: "L" },
      { value: "50", title: "XL" },
    ],
    description: "Vertical spacing. Desktop only.",
    displayAs: "button-group",
    "ui:group": "layout",
    "ui:group:title": "Page Layout & Design",
  }),

  $pagePaddingHorizontal: attr.enum("Page horizontal spacing", "20", {
    options: [
      { value: "0", title: "None" },
      { value: "10", title: "S" },
      { value: "20", title: "M" },
      { value: "30", title: "L" },
      { value: "50", title: "XL" },
    ],
    description: "Horizontal spacing. Desktop only.",
    displayAs: "button-group",
    "ui:group": "layout",
    "ui:group:title": "Page Layout & Design",
  }),

  $backgroundColor: attr.color("Page background color", "#ffffff", {
    "ui:field": "color",
    "ui:group": "layout",
    "ui:group:title": "Page Layout & Design",
  }),

  $textColor: attr.color("Default text color", "#222222", {
    "ui:field": "color",
    "ui:group": "layout",
    "ui:group:title": "Page Layout & Design",
    "ui:color-type": "page-text",
  }),
};

export function resolveAttributes(attributes: Attributes) {
  return Value.Create(attributes);
}


```

### `datasources`

Datasources are a way to provide dynamic data to the template.
Each key of the object corresponds to its unique ID.
Here is the JSON schema for `datasources`.

```json
{
  "title": "Datasources map",
  "description": "The map of datasources available in the system",
  "type": "object",
  "patternProperties": {
    "^(.*)$": {
      "anyOf": [
        {
          "type": "object",
          "properties": {
            "provider": {
              "title": "Generic",
              "description": "Generic datasource is saved locally in Upstart.",
              "const": "generic",
              "type": "string"
            },
            "name": {
              "title": "Name of the datasource",
              "comment": "For example, 'My data'",
              "type": "string"
            },
            "description": {
              "title": "Description of the datasource",
              "type": "string"
            },
            "schema": {
              "additionalProperties": true,
              "title": "JSON schema of the datasource fields.",
              "type": "object",
              "properties": {}
            },
            "refresh": {
              "title": "Refresh options",
              "description": "Options to refresh the datasource",
              "type": "object",
              "properties": {
                "method": {
                  "anyOf": [
                    {
                      "const": "interval",
                      "type": "string"
                    },
                    {
                      "const": "manual",
                      "type": "string"
                    }
                  ]
                },
                "interval": {
                  "type": "number"
                }
              },
              "required": [
                "method"
              ]
            },
            "sampleData": {
              "title": "Sample data",
              "description": "Sample data for the datasource. Should match the declared schema."
            }
          },
          "required": [
            "provider",
            "name",
            "schema"
          ]
        },
        {
          "type": "object",
          "properties": {
            "provider": {
              "anyOf": [
                {
                  "const": "youtube-list",
                  "type": "string"
                },
                {
                  "anyOf": [
                    {
                      "const": "facebook-posts",
                      "type": "string"
                    },
                    {
                      "const": "instagram-feed",
                      "type": "string"
                    },
                    {
                      "const": "threads-media",
                      "type": "string"
                    }
                  ]
                },
                {
                  "const": "mastodon-status",
                  "type": "string"
                },
                {
                  "const": "rss",
                  "type": "string"
                },
                {
                  "const": "tiktok-video",
                  "type": "string"
                },
                {
                  "const": "json",
                  "type": "string"
                }
              ]
            },
            "options": {
              "anyOf": [
                {
                  "type": "object",
                  "properties": {
                    "refreshInterval": {
                      "type": "number"
                    },
                    "channelId": {
                      "type": "string"
                    },
                    "order": {
                      "type": "string"
                    },
                    "maxResults": {
                      "type": "number"
                    },
                    "regionCode": {
                      "type": "string"
                    },
                    "relevanceLanguage": {
                      "type": "string"
                    }
                  },
                  "required": [
                    "channelId"
                  ]
                },
                {
                  "type": "object",
                  "properties": {
                    "refreshInterval": {
                      "type": "number"
                    },
                    "limit": {
                      "type": "number"
                    }
                  }
                },
                {
                  "type": "object",
                  "properties": {
                    "refreshInterval": {
                      "type": "number"
                    },
                    "username": {
                      "type": "string"
                    }
                  },
                  "required": [
                    "username"
                  ]
                },
                {
                  "type": "object",
                  "properties": {
                    "refreshInterval": {
                      "type": "number"
                    },
                    "url": {
                      "format": "uri",
                      "type": "string"
                    }
                  },
                  "required": [
                    "url"
                  ]
                },
                {
                  "type": "object",
                  "properties": {
                    "refreshInterval": {
                      "allOf": [
                        {
                          "type": "number"
                        },
                        {
                          "type": "number"
                        }
                      ]
                    },
                    "maxCount": {
                      "type": "number"
                    }
                  }
                },
                {
                  "type": "object",
                  "properties": {
                    "refreshInterval": {
                      "type": "number"
                    },
                    "url": {
                      "type": "string"
                    },
                    "headers": {
                      "type": "object",
                      "patternProperties": {
                        "^(.*)$": {
                          "type": "string"
                        }
                      }
                    }
                  },
                  "required": [
                    "url"
                  ]
                }
              ]
            },
            "name": {
              "title": "Name of the datasource",
              "comment": "For example, 'My data'",
              "type": "string"
            },
            "description": {
              "title": "Description of the datasource",
              "type": "string"
            },
            "sampleData": {},
            "refresh": {
              "title": "Refresh options",
              "description": "Options to refresh the datasource",
              "type": "object",
              "properties": {
                "method": {
                  "anyOf": [
                    {
                      "const": "interval",
                      "type": "string"
                    },
                    {
                      "const": "manual",
                      "type": "string"
                    },
                    {
                      "const": "live",
                      "type": "string"
                    }
                  ]
                },
                "interval": {
                  "type": "number"
                }
              },
              "required": [
                "method"
              ]
            }
          },
          "required": [
            "provider",
            "options",
            "name"
          ]
        }
      ]
    }
  }
}

```
