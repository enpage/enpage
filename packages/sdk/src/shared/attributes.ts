import type {
  AttrText,
  AttrNumber,
  AttrBoolean,
  AttrEnum,
  AttrFile,
  AttrUrl,
  AttrColor,
  AttrDate,
  AttrDateTime,
  AttributesMap,
} from "@enpage/types/attributes";

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
