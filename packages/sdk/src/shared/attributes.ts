import {
  Type,
  type TSchema,
  type StringOptions,
  type NumberOptions,
  type SchemaOptions,
  type ObjectOptions,
  type Static,
  type TObject,
  type TAny,
  type TProperties,
} from "@sinclair/typebox";
import { Value } from "@sinclair/typebox/value";

// KEEP IT
type EnumOption = {
  // name: string;
  title?: string;
  value: string;
  icon?: string;
};

type AttributeOptions<T extends Record<string, unknown>> = {
  "ui:group"?: string;
  "ui:group:title"?: string;
  advanced?: boolean;
  "ui:hidden"?: boolean | "if-empty";
} & T;

type GeoPoint = { lat: number; lng: number; name?: string };

type AttributesMap = {
  [key: string]: TAny;
};

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
      id: "attributes",
    },
  );
}

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
    };
    const { options, ...commonOpts } = opts;
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
    defaultValue = "",
    opts: AttributeOptions<Omit<SchemaOptions, "title" | "default">> = {},
  ) {
    return Type.Union(
      [
        // For RGB(A) HEX colors
        Type.String({
          format: "rgb-hex",
          pattern: "^#[0-9a-fA-F]{3,8}$",
        }),
        // For RGB(A) object
        Type.Object({
          r: Type.Number({ minimum: 0, maximum: 255 }),
          g: Type.Number({ minimum: 0, maximum: 255 }),
          b: Type.Number({ minimum: 0, maximum: 255 }),
          a: Type.Number({ minimum: 0, maximum: 1 }),
        }),
        // HSL(A) colors
        Type.String({ title: name, default: defaultValue, ...opts, format: "hsl-string" }),
        // HSL(A) object
        Type.Object({
          h: Type.Number({ minimum: 0, maximum: 360 }),
          s: Type.Number({ minimum: 0, maximum: 100 }),
          l: Type.Number({ minimum: 0, maximum: 100 }),
          a: Type.Number({ minimum: 0, maximum: 1 }),
        }),
        // For CSS color names
        Type.String({ title: name, default: defaultValue, ...opts, format: "color-name" }),
        // For gradients
        Type.Array(
          Type.Object({
            color: Type.String({ format: "color" }),
            position: Type.String({ format: "percentage" }),
          }),
        ),
      ],
      { title: name, default: defaultValue },
    );
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
  $tabletBreakpointEnabled: attr.boolean("Enable tablet layout", false, {
    description: "Enable a different layout for tablets",
    "ui:group": "layout",
    "ui:group:title": "Layout",
  }),

  $gridGap: attr.number("Grid gap", 10, {
    min: 0,
    max: 100,
    description: "Grid gap in pixels",
    "ui:group": "layout",
    "ui:group:title": "Layout",
  }),

  // $gridMobileCols: attr.number("Mobile columns", 2, {
  //   min: 1,
  //   max: 12,
  //   "ui:group": "layout",
  //   "ui:hidden": true,
  // }),
  // $gridTabletCols: attr.number("Tablet columns", 4, {
  //   min: 1,
  //   max: 12,
  //   "ui:group": "layout",
  //   "ui:hidden": true,
  // }),
  // $gridDesktopCols: attr.number("Desktop columns", 12, {
  //   min: 1,
  //   max: 12,
  //   "ui:group": "layout",
  //   "ui:hidden": true,
  // }),
};

export function resolveAttributes(attributes: ReturnType<typeof defineAttributes>) {
  return Value.Create(attributes);
}

export type AttributesResolved = ReturnType<typeof resolveAttributes>;

// export type AttributesResolved<
//   S extends TObject = TObject,
//   B extends S & typeof defaultAttributes = S & typeof defaultAttributes,
// > = {
//   [key in keyof B]: Static<B[key]>;
// };
