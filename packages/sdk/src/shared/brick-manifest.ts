import { Type, type Static, type TObject, type TProperties } from "@sinclair/typebox";
import { LAYOUT_COLS } from "./layout-constants";

export function defineBrickManifest<
  BType extends string,
  BTitle extends string,
  BIcon extends string,
  BDesc extends string,
  BProps extends TProperties,
>({
  type,
  kind,
  title,
  description,
  preferredWidth,
  preferredHeight,
  minWidth,
  minHeight,
  maxWidth,
  icon,
  props,
  datasource,
  datarecord,
  hideInLibrary,
}: {
  type: BType;
  kind: string;
  title: BTitle;
  icon: BIcon;
  description: BDesc;
  minWidth?: {
    mobile: number;
    desktop: number;
  };
  minHeight?: {
    mobile: number;
    desktop: number;
  };
  maxWidth?: {
    mobile: number;
    desktop: number;
  };
  preferredWidth?: {
    mobile: number;
    desktop: number;
  };
  preferredHeight?: {
    mobile: number;
    desktop: number;
  };
  props: TObject<BProps>;
  datasource?: TObject;
  datarecord?: TObject;
  hideInLibrary?: boolean;
}) {
  return Type.Object({
    type: Type.Literal(type),
    kind: Type.Literal(kind),
    title: Type.Literal(title),
    description: Type.Literal(description),
    icon: Type.Literal(icon),
    hideInLibrary: Type.Boolean({ default: hideInLibrary ?? false }),
    preferredWidth: Type.Object(
      {
        mobile: Type.Number(),
        desktop: Type.Number(),
      },
      { default: preferredWidth ?? minWidth },
    ),
    preferredHeight: Type.Object(
      {
        mobile: Type.Number(),
        desktop: Type.Number(),
      },
      { default: preferredHeight ?? minHeight },
    ),
    minWidth: Type.Object(
      {
        mobile: Type.Number(),
        desktop: Type.Number(),
      },
      { default: minWidth ?? { mobile: 1, desktop: 1 } },
    ),
    maxWidth: Type.Object(
      {
        mobile: Type.Number(),
        desktop: Type.Number(),
      },
      { default: maxWidth ?? { mobile: LAYOUT_COLS.mobile, desktop: LAYOUT_COLS.desktop } },
    ),
    minHeight: Type.Object(
      {
        mobile: Type.Number(),
        desktop: Type.Number(),
      },
      { default: minHeight ?? { mobile: 1, desktop: 1 } },
    ),
    ...(datasource && { datasource }),
    ...(datarecord && { datarecord }),
    props,
  });
}

export type BrickManifest = ReturnType<typeof defineBrickManifest>;
export type ResolvedBrickManifest = Static<BrickManifest>;

export type BrickConstraints = Pick<
  ResolvedBrickManifest,
  "preferredWidth" | "preferredHeight" | "minWidth" | "minHeight" | "maxWidth"
>;
