import { type TObject, Type, type Static } from "@sinclair/typebox";

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
            title: "Custom font",
            description: "The custom font name from teh customFonts array",
            "ui:option-hidden": true,
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
            title: "Custom font",
            description: "The custom font name from teh customFonts array",
            "ui:option-hidden": true,
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

/**
 * Process the theme schema and potentialy modify the typography entries by adding custom fonts defined in the theme to the accepted union.
 */
export function getProcessedThemeSchema(schema: typeof themeSchema, theme: Theme): TObject {
  if (!theme.customFonts?.length) {
    return schema;
  }
  return {
    ...schema,
    properties: {
      ...schema.properties,
      typography: {
        ...schema.properties.typography,
        properties: {
          ...schema.properties.typography.properties,
          body: Type.Union(
            [
              ...theme.customFonts.map((font) => Type.Literal(font.name, { title: font.name })),
              ...schema.properties.typography.properties.body.anyOf,
            ],
            {
              title: schema.properties.typography.properties.body.title,
              description: schema.properties.typography.properties.body.description,
              default: schema.properties.typography.properties.body.default,
            },
          ),
          heading: Type.Union(
            [
              ...theme.customFonts.map((font) => Type.Literal(font.name, { title: font.name })),
              ...schema.properties.typography.properties.heading.anyOf,
            ],
            {
              title: schema.properties.typography.properties.heading.title,
              description: schema.properties.typography.properties.heading.description,
              default: schema.properties.typography.properties.heading.default,
            },
          ),
        },
      },
    },
  };
}

export type Theme = Static<typeof themeSchema>;
export const themeArray = Type.Array(themeSchema);
export type ThemeArray = Static<typeof themeArray>;
