import { Type, type Static, type TObject, type TProperties } from "@sinclair/typebox";

export function defineBrickManifest<
  BType extends string,
  BTitle extends string,
  BIcon extends string,
  BFile extends string,
  BDesc extends string,
  BProps extends TProperties,
>({
  type,
  title,
  description,
  preferredW,
  preferredH,
  minWidth,
  minHeight,
  icon,
  file,
  props,
  datasource,
  datarecord,
}: {
  type: BType;
  title: BTitle;
  icon: BIcon;
  file: BFile;
  description: BDesc;
  minWidth?: number;
  minHeight?: number;
  preferredW?: number;
  preferredH?: number;
  props: TObject<BProps>;
  datasource?: TObject;
  datarecord?: TObject;
}) {
  return Type.Object({
    type: Type.Literal(type),
    title: Type.Literal(title),
    description: Type.Literal(description),
    icon: Type.Literal(icon),
    file: Type.Literal(file),
    preferredW: Type.Number({ default: preferredW ?? minWidth ?? 1 }),
    preferredH: Type.Number({ default: preferredH ?? minHeight ?? 1 }),
    minWidth: Type.Number({ default: minWidth ?? 1 }),
    minHeight: Type.Number({ default: minHeight ?? 1 }),
    ...(datasource && { datasource }),
    ...(datarecord && { datarecord }),
    props,
  });
}

export type BrickManifest = ReturnType<typeof defineBrickManifest>;
export type ResolvedBrickManifest = Static<BrickManifest>;
