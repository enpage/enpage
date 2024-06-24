import type { DatasourceManifestMap, DatasourceResolved } from "@enpage/types/datasources";
import type { AttributesMap } from "@enpage/types/attributes";
import type { CSSRegistry } from "./dynamic-css";

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

export interface CoreProps {
  customizations?: Customization | Customization[];
  visibleAnimation?: string;
  visibleAnimationDuration?: string;
  hoverAnimation?: string;
  hoverAnimationDuration?: string;
  label?: string;
  editable?: boolean;
  id: string;
  // dynamicStyles?: Record<string, unknown>;
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

export interface IconProps extends CoreProps, Duplicatable {
  blockType: "icon";
  slug: string;
  color?: string;
  textEditable?: never;
  preventReordering?: never;
}

export interface ImageProps extends CoreProps, Duplicatable {
  blockType: "image";
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
  | ImageProps
  | IconProps
  | WidgetProps
  | TextProps;

export type EnpageContext = DatasourceResolved<DatasourceManifestMap>;

export type AttributesTemplateProp<S extends AttributesMap> = {
  [key in keyof S]: S[key]["value"];
};

export type TemplateProps<Datasources extends DatasourceManifestMap = {}, Settings extends AttributesMap = {}> = {
  data: EnpageContext;
  styles: Record<string, unknown>;
  attributes: Partial<AttributesTemplateProp<Settings>>;
};

export type CSSVarName = string;
export type CSSVarValue = string | number;

export type ResponsiveValue<T> =
  | T
  | {
      mobile?: T;
      tablet?: T;
      desktop?: T;
      mobileOnly?: T;
      tabletOnly?: T;
      desktopOnly?: T;
      maxMobile?: T;
      maxTablet?: T;
    };

export type CSSVarDescriptor = {
  name: CSSVarName;
  cssProp: string;
  globalValue?: CSSVarValue;
  localValues: Map<ElementId, ResponsiveValue<CSSVarValue>>;
};

export type CSSVarRegistry = Map<symbol, CSSVarDescriptor>;

export type CSSClassesReg = Map<string, Map<CSSVarName, CSSVarValue>>;
export type ElementId = string;

export type DynamicStylesArg = Record<symbol, ResponsiveValue<CSSVarValue> | undefined | null>;

export interface Editor {
  onSelectBlock: (blockId: string) => void;
}

export type RunContextType<
  Datasources extends DatasourceManifestMap = {},
  Settings extends AttributesMap = {},
> = TemplateProps<Datasources, Settings> & {
  mode: "edit" | "view";
  cssRegistry: CSSRegistry;
};
