import {
  Type,
  type StringOptions,
  type NumberOptions,
  type SchemaOptions,
  type ObjectOptions,
  type TAny,
  type TProperties,
} from "@sinclair/typebox";
import { Value } from "@sinclair/typebox/value";
import type { ElementColor } from "./themes/color-system";

// KEEP IT
type EnumOption = {
  // name: string;
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
      $id: "attributes",
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
  $gridGap: attr.number("Grid gap", 10, {
    min: 0,
    max: 100,
    description: "Grid gap in pixels",
    "ui:group": "layout",
    "ui:group:title": "Layout & Design",
  }),

  $pageWidth: attr.enum("Page width", "max-w-screen-2xl", {
    options: [
      {
        value: "max-w-screen-md",
        title: "M",
        description: "Common for text-heavy content/blog posts",
      },
      { value: "max-w-screen-xl", title: "L", description: "Usefull or some landing pages" },
      { value: "max-w-screen-2xl", title: "XL", description: "Common width" },
      { value: "max-w-full", title: "Full", description: "Takes the entire space" },
    ],
    displayAs: "button-group",
    "ui:group": "layout",
    "ui:group:title": "Layout & Design",
  }),

  $backgroundColor: attr.color("Page background color", "#ffffff", {
    "ui:field": "color",
    "ui:group": "layout",
    "ui:group:title": "Layout & Design",
  }),

  $textColor: attr.color("Default text color", "#222222", {
    "ui:field": "color",
    "ui:group": "layout",
    "ui:group:title": "Layout & Design",
    "ui:color-type": "page-text",
  }),
};

export function resolveAttributes(attributes: ReturnType<typeof defineAttributes>) {
  return Value.Create(attributes);
}

export type AttributesResolved = ReturnType<typeof resolveAttributes>;
