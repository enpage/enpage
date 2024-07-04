import { ResponsiveMode } from "./responsive";

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
  [key in keyof S]: S[key] & {
    value: S[key]["defaultValue"];
    responsiveValue?: S[key]["responsive"] extends true ? S[key]["responsiveDefaultValue"] : never;
  };
};
