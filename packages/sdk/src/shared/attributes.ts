import type { ResponsiveMode } from "./responsive";
import {
  Type,
  type TSchema,
  type StringOptions,
  type NumberOptions,
  type SchemaOptions,
  type ObjectOptions,
  type Static,
} from "@sinclair/typebox";

// KEEP IT
type EnumOption = {
  name: string;
  value: string;
  icon?: string;
};

type Responsive<T> =
  | T
  | {
      [key in ResponsiveMode]?: T;
    };

type AttributeOptions<T extends Record<string, unknown>> = {
  group?: string;
  advanced?: boolean;
  hideInInspector?: boolean | "if-empty";
} & T;

type GeoPoint = { lat: number; lng: number; name?: string };

export type AttributesMap = {
  [key: string]: TSchema;
};

export type AttributesResolved<S extends AttributesMap> = {
  [key in keyof S]: Responsive<Static<S[key]>>;
};

export function defineAttributes(attrs: AttributesMap) {
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
      title: "Attributes",
      description: "Define the attributes of the page",
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
    return Type.Boolean({ title: name, default: defaultValue, ...opts });
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
    const { options, ...commonOpts } = opts;
    return Type.Union(
      options.map((opt) => Type.Literal(typeof opt === "string" ? opt : opt.value)),
      {
        title: name,
        default: defaultValue,
        optionsIcons: options.map((opt) => (typeof opt === "string" ? null : opt.icon)).filter(Boolean),
        optionsNames: options.map((opt) => (typeof opt === "string" ? opt : opt.name)),
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
const defaultAttributes: AttributesMap = {
  $siteLanguage: attr.enum("Page language", "en", {
    options: [
      { value: "en", name: "English" },
      { value: "es", name: "Spanish" },
      { value: "fr", name: "French" },
      { value: "de", name: "German" },
      { value: "it", name: "Italian" },
      { value: "ja", name: "Japanese" },
      { value: "ko", name: "Korean" },
      { value: "pt", name: "Portuguese" },
      { value: "ru", name: "Russian" },
      { value: "zh", name: "Chinese" },
    ],
  }),
  $siteTitle: attr.string("Page title", "Untitled"),
  $siteDescription: attr.string("Page description"),
  $siteKeywords: attr.string("Page keywords"),
  $siteLastUpdated: attr.datetime("Last updated"),
};
