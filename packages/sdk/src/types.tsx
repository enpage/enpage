import type { ElementType } from "react";
import { DatasourceManifestMap, AttributesMap } from "@enpage/types";
import type { Styles } from "./styles.css";
import type Zod from "zod";

export type Customization =
  | "none"
  | "all"
  | "background"
  | "size"
  | "spacing"
  | "border"
  | "shadow"
  | "typography"
  | "position"
  | "direction"
  | "opacity"
  | "transform"
  | "animation";

type ResponsiveValue<T> = T | { mobile: T; tablet?: T; desktop?: T };

interface CoreProps {
  customizations?: Customization | Customization[];
  visibleAnimation?: string;
  visibleAnimationDuration?: string;
  hoverAnimation?: string;
  hoverAnimationDuration?: string;
  as?: ElementType;
  label?: string;
}

interface Duplicatable {
  duplicatable?: boolean;
}

interface TextEditable {
  textEditable?: boolean | "plain-text" | "html" | 'allow-paid-users-only"';
}

interface Reorderable {
  preventReordering?: boolean;
}

export interface PageProps extends CoreProps {
  blockType: "page";
  duplicatable?: never;
  textEditable?: never;
  preventReordering?: never;
}

export interface ContainerProps extends CoreProps, Duplicatable, Reorderable {
  blockType: "container";
  direction: ResponsiveValue<"horizontal" | "vertical">;
  allowCrossDragInside?: boolean | string[];
  allowCrossDragOutside?: boolean | string[];
  textEditable?: never;
}

export interface SectionsProps extends CoreProps, Reorderable {
  blockType: "sections";
  preventDeletion?: boolean | 'allow-paid-users-only"';
  textEditable?: never;
  duplicatable?: never;
}

export interface SectionProps extends CoreProps, Duplicatable {
  blockType: "section";
  textEditable?: never;
  preventReordering?: never;
}

export interface ElementProps extends CoreProps, Duplicatable {
  blockType: "element";
  textEditable?: never;
  preventReordering?: never;
}

export interface WidgetProps extends CoreProps, Duplicatable {
  blockType: "widget";
  textEditable?: never;
  preventReordering?: never;
}

export interface TextProps extends CoreProps, Duplicatable, TextEditable {
  blockType: "text";
  preventReordering?: never;
}

export type PropTypes =
  | PageProps
  | SectionsProps
  | ContainerProps
  | SectionsProps
  | SectionProps
  | ElementProps
  | WidgetProps
  | TextProps;

export type BlockProps<
  E extends ElementType,
  P extends PropTypes,
  StylesProps,
> = React.ComponentPropsWithoutRef<E> & StylesProps & P;

export type DataTemplateProp<D extends DatasourceManifestMap> = {
  [key in keyof D]: Zod.infer<D[key]["schema"]>;
};

export type AttributesTemplateProp<S extends AttributesMap> = {
  [key in keyof S]: S[key]["value"];
};

export type TemplateProps<
  Datasources extends DatasourceManifestMap = {},
  Settings extends AttributesMap = {},
> = {
  data: DataTemplateProp<Datasources>;
  styles: Record<string, Styles>;
  attributes: Partial<AttributesTemplateProp<Settings>>;
};
