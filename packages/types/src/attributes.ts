import { ResponsiveMode } from "./responsive";

export interface BaseAttribute {
  name: string;
  group?: string;
  advanced?: boolean;
  hideInInspector?: boolean | "if-empty";
}

interface Responsive<T> {
  responsive?: boolean;
  responsiveValue?: Record<ResponsiveMode, T>;
}

export interface AttrText extends BaseAttribute, Responsive<string> {
  type: "text";
  options?: string[];
  multiline?: boolean;
  value?: string;
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
  value?: number;
  suffix?: string;
}

export interface AttrBoolean extends BaseAttribute, Responsive<boolean> {
  type: "boolean";
  placeholder?: string;
  value?: boolean;
}

export type AttrEnumOption = string | { label: string; icon?: () => any; value: string };

export interface AttrEnum<O extends string> extends BaseAttribute, Responsive<string> {
  type: "enum";
  options: (O | { label: string; icon?: () => any; value: O })[];
  displayAs?: "radio" | "select" | "button-group" | "icon-group";
  placeholder?: string;
  value?: O;
}

type GeoPoint = { lat: number; lng: number; name?: string };

export interface AttrGeoAddress extends BaseAttribute, Responsive<GeoPoint> {
  type: "geo-address";
  placeholder?: string;
  value?: GeoPoint;
}

export interface AttrUrl extends BaseAttribute, Responsive<string> {
  type: "url";
  default?: string;
  placeholder?: string;
  value?: string;
}

export interface AttrFile extends BaseAttribute, Responsive<string> {
  type: "file";
  accept: string[];
  placeholder?: string;
  buttonLabel?: string;
  value?: string;
}

export interface AttrColor extends BaseAttribute, Responsive<string> {
  type: "color";
  allowGradient?: boolean;
  value?: string;
}

// Block attributes

// const attrText = z.object({
//   type: z.literal("text"),
//   name: z.string(),
//   default: z.string().optional(),
//   options: z.array(z.string()).optional(),
//   multiline: z.boolean().optional(),
//   hideInInspector: z.boolean().or(z.literal("if-empty")).optional(),
//   responsive: z.boolean().optional(),
//   value: z.string().optional(),
//   placeholder: z.string().optional(),
//   responsiveValue: z.record(responsiveMode, z.string()).optional(),
//   group: z.string().optional(),
//   advanced: z.boolean().optional(),
// });

// export type AttrText = z.infer<typeof attrText>;

// const attrNumber = z.object({
//   type: z.literal("number"),
//   group: z.string().optional(),
//   advanced: z.boolean().optional(),
//   name: z.string(),
//   default: z.number(),
//   hideInInspector: z.boolean().or(z.literal("if-empty")).optional(),
//   displayAs: z.enum(["slider", "input"]),
//   min: z.number().optional(),
//   max: z.number().optional(),
//   step: z.number().optional(),
//   options: z.array(z.number()).optional(),
//   placeholder: z.string().optional(),
//   value: z.number().optional(),
//   suffix: z.string().optional(),
//   responsive: z.boolean().optional(),
//   responsiveValue: z.record(responsiveMode, z.number()).optional(),
// });

// export type AttrNumber = z.infer<typeof attrNumber>;

// const attrBoolean = z.object({
//   type: z.literal("boolean"),
//   group: z.string().optional(),
//   advanced: z.boolean().optional(),
//   name: z.string(),
//   default: z.boolean(),
//   hideInInspector: z.boolean().or(z.literal("if-empty")).optional(),
//   placeholder: z.string().optional(),
//   value: z.boolean().optional(),
//   responsive: z.boolean().optional(),
//   responsiveValue: z.record(responsiveMode, z.boolean()).optional(),
// });

// export type AttrBoolean = z.infer<typeof attrBoolean>;

// const attrEnum = z.object({
//   type: z.literal("enum"),
//   name: z.string(),
//   group: z.string().optional(),
//   advanced: z.boolean().optional(),
//   default: z.string(),
//   // could be texts or icons
//   options: z.array(
//     z.string().or(
//       z.object({
//         label: z.string(),
//         icon: z.function().returns(z.custom<ReactNode>()).optional(),
//         value: z.string(),
//       }),
//     ),
//   ),
//   hideInInspector: z.boolean().or(z.literal("if-empty")).optional(),
//   displayAs: z.enum(["radio", "select", "button-group", "icon-group"]),
//   placeholder: z.string().optional(),
//   value: z.string().optional(),
//   responsive: z.boolean().optional(),
//   responsiveValue: z.record(responsiveMode, z.string()).optional(),
// });

// export type AttrEnum = z.infer<typeof attrEnum>;

// const attrGeoAddress = z.object({
//   type: z.literal("geo-address"),
//   name: z.string(),
//   group: z.string().optional(),
//   advanced: z.boolean().optional(),
//   default: z
//     .object({
//       lat: z.number(),
//       lng: z.number(),
//       name: z.string(),
//     })
//     .optional(),
//   hideInInspector: z.boolean().or(z.literal("if-empty")).optional(),
//   responsive: z.null().optional(),
//   placeholder: z.string().optional(),
//   value: z
//     .object({
//       lat: z.number(),
//       lng: z.number(),
//       name: z.string(),
//     })
//     .optional(),
//   responsiveValue: z
//     .record(
//       responsiveMode,
//       z.object({
//         lat: z.number(),
//         lng: z.number(),
//         name: z.string(),
//       }),
//     )
//     .optional(),
// });

// export type AttrGeoAddress = z.infer<typeof attrGeoAddress>;

// const attrUrl = z.object({
//   type: z.literal("url"),
//   group: z.string().optional(),
//   advanced: z.boolean().optional(),
//   name: z.string(),
//   default: z.string().optional(),
//   allowUpload: z.boolean().optional(),
//   onlyUpload: z.boolean().optional(),
//   objectType: z.enum(["image", "video"]).optional(),
//   hideInInspector: z.boolean().or(z.literal("if-empty")).optional(),
//   responsive: z.null().optional(),
//   value: z.string().optional(),
//   placeholder: z.string().optional(),
//   responsiveValue: z.record(responsiveMode, z.string()).optional(),
// });

// export type AttrUrl = z.infer<typeof attrUrl>;

// const attrFile = z.object({
//   type: z.literal("file"),
//   group: z.string().optional(),
//   advanced: z.boolean().optional(),
//   name: z.string(),
//   default: z.string().optional(),
//   accept: z.array(z.string()),
//   hideInInspector: z.boolean().or(z.literal("if-empty")).optional(),
//   responsive: z.null().optional(),
//   value: z.string().optional(),
//   placeholder: z.string().optional(),
//   buttonLabel: z.string().optional(),
//   responsiveValue: z.record(responsiveMode, z.string()).optional(),
// });

// export type AttrFile = z.infer<typeof attrFile>;

// const attrColor = z.object({
//   type: z.literal("color"),
//   group: z.string().optional(),
//   advanced: z.boolean().optional(),
//   name: z.string(),
//   default: z.string(),
//   // .or(z.function().args(z.custom<Theme>()).returns(z.string())),
//   allowGradient: z.boolean().optional(),
//   hideInInspector: z.boolean().or(z.literal("if-empty")).optional(),
//   responsive: z.null().optional(),
//   value: z.string().optional(),
//   responsiveValue: z.record(responsiveMode, z.string()).optional(),
// });

// export type AttrColor = z.infer<typeof attrColor>;

// const attr = z.discriminatedUnion("type", [
//   attrText,
//   attrColor,
//   attrGeoAddress,
//   attrUrl,
//   attrFile,
//   attrNumber,
//   attrEnum,
//   attrBoolean,
// ]);

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
