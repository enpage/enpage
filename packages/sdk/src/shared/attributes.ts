import { ResponsiveMode } from "./types";

export interface BaseAttribute {
  name: string;
  group?: string;
  advanced?: boolean;
  hideInInspector?: boolean | "if-empty";
}

interface Responsive<T> {
  responsive?: boolean;
  responsiveDefaultValue?: Record<ResponsiveMode, T>;
}

export interface AttrDate extends BaseAttribute {
  type: "date";
  defaultValue?: Date;
}

export interface AttrDateTime extends BaseAttribute {
  type: "datetime";
  defaultValue?: Date;
}

export interface AttrText extends BaseAttribute, Responsive<string> {
  type: "text";
  options?: string[];
  multiline?: boolean;
  defaultValue?: string;
  placeholder?: string;
}

export interface AttrNumber extends BaseAttribute, Responsive<number> {
  type: "number";
  displayAs: "slider" | "input";
  min?: number;
  max?: number;
  step?: number;
  options?: number[];
  placeholder?: string;
  defaultValue?: number;
  suffix?: string;
}

export interface AttrBoolean extends BaseAttribute, Responsive<boolean> {
  type: "boolean";
  placeholder?: string;
  defaultValue?: boolean;
}

export type AttrEnumOption = string | { label: string; icon?: () => any; value: string };

export interface AttrEnum<O extends string> extends BaseAttribute, Responsive<string> {
  type: "enum";
  options: (O | { label: string; icon?: () => any; value: O })[];
  displayAs?: "radio" | "select" | "button-group" | "icon-group";
  placeholder?: string;
  defaultValue?: O;
}

type GeoPoint = { lat: number; lng: number; name?: string };

export interface AttrGeoAddress extends BaseAttribute, Responsive<GeoPoint> {
  type: "geo-address";
  placeholder?: string;
  defaultValue?: GeoPoint;
}

export interface AttrUrl extends BaseAttribute, Responsive<string> {
  type: "url";
  default?: string;
  placeholder?: string;
  defaultValue?: string;
}

export interface AttrFile extends BaseAttribute, Responsive<string> {
  type: "file";
  accept: string[];
  placeholder?: string;
  buttonLabel?: string;
  defaultValue?: string;
}

export interface AttrColor extends BaseAttribute, Responsive<string> {
  type: "color";
  allowGradient?: boolean;
  defaultValue?: string;
}

export type Attribute =
  | AttrText
  | AttrDate
  | AttrDateTime
  | AttrNumber
  | AttrBoolean
  | AttrEnum<any>
  | AttrGeoAddress
  | AttrUrl
  | AttrFile
  | AttrColor;

export type AttributesMap = {
  [key: string]: Attribute;
};

export type AttributesResolved<S extends AttributesMap> = {
  [key in keyof S]: S[key]["defaultValue"];
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
  return { ...defaultAttributes, ...attrs };
}

export const attr = {
  /**
   * Define a text attribute
   */
  text(name: string, defaultValue = "", opts?: Omit<AttrText, "name" | "type" | "defaultValue">) {
    return {
      type: "text",
      defaultValue,
      name,
      ...opts,
    } as const satisfies AttrText;
  },
  /**
   * Define a number attribute
   */
  number(name: string, defaultValue: number, opts?: Omit<AttrNumber, "name" | "type" | "defaultValue">) {
    return {
      type: "number",
      name,
      defaultValue,
      displayAs: "input",
      ...opts,
    } as const satisfies AttrNumber;
  },
  /**
   * Define a boolean attribute
   */
  boolean(name: string, defaultValue: boolean, opts?: Omit<AttrBoolean, "name" | "type" | "defaultValue">) {
    return {
      type: "boolean",
      defaultValue,
      name,
      ...opts,
    } as const satisfies AttrBoolean;
  },
  /**
   * Define an enum attribute
   */
  enum<O extends string>(name: string, defaultValue: O, opts: Omit<AttrEnum<O>, "name" | "type" | "defaultValue">) {
    return {
      type: "enum",
      defaultValue,
      name,
      ...opts,
    } as const satisfies AttrEnum<O>;
  },
  /**
   * Define a file attribute
   */
  file(
    name: string,
    opts: Omit<AttrFile, "name" | "type"> = {
      accept: ["*"],
    },
  ) {
    return {
      type: "file",
      name,
      ...opts,
    } as const satisfies AttrFile;
  },
  /**
   * Define a URL attribute
   */
  url(name: string, defaultValue = "", opts: Omit<AttrUrl, "name" | "type" | "defaultValue"> = {}) {
    return {
      type: "url",
      defaultValue,
      name,
      ...opts,
    } as const satisfies AttrUrl;
  },
  /**
   * Define a color attribute
   */
  color(name: string, defaultValue: string, opts: Omit<AttrColor, "name" | "type"> = {}) {
    return {
      type: "color",
      defaultValue,
      name,
      ...opts,
    } as const satisfies AttrColor;
  },
  date(name: string, defaultValue?: Date, opts: Omit<AttrDate, "name" | "type" | "defaultValue"> = {}) {
    return {
      type: "date",
      defaultValue,
      name,
      ...opts,
    } as const satisfies AttrDate;
  },
  datetime(name: string, defaultValue?: Date, opts: Omit<AttrDateTime, "name" | "type" | "defaultValue"> = {}) {
    return {
      type: "datetime",
      defaultValue,
      name,
      ...opts,
    } as const satisfies AttrDateTime;
  },
};

// Default attributes
const defaultAttributes: AttributesMap = {
  $siteLanguage: attr.enum("Page language", "en", {
    options: [
      { value: "en", label: "English" },
      { value: "es", label: "Spanish" },
      { value: "fr", label: "French" },
      { value: "de", label: "German" },
      { value: "it", label: "Italian" },
      { value: "ja", label: "Japanese" },
      { value: "ko", label: "Korean" },
      { value: "pt", label: "Portuguese" },
      { value: "ru", label: "Russian" },
      { value: "zh", label: "Chinese" },
    ],
  }),
  $siteTitle: attr.text("Page title", "Untitled"),
  $siteDescription: attr.text("Page description"),
  $siteKeywords: attr.text("Page keywords"),
  $siteLastUpdated: attr.datetime("Last updated"),
};
