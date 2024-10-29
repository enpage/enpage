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
  icon,
  file,
  props,
}: {
  type: BType;
  title: BTitle;
  icon: BIcon;
  file: BFile;
  description: BDesc;
  props: TObject<BProps>;
}) {
  return Type.Object({
    type: Type.Literal(type),
    title: Type.Literal(title),
    description: Type.Literal(description),
    icon: Type.Literal(icon),
    file: Type.Literal(file),
    props,
  });
}

export type BrickManifest = ReturnType<typeof defineBrickManifest>;
export type ResolvedBrickManifest = Static<BrickManifest>;
