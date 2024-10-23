import { Type } from "@sinclair/typebox";
import { customAlphabet } from "nanoid";

export const generateId = customAlphabet("1234567890azertyuiopqsdfghjklmwxcvbnAZERTYUIOPQSDFGHJKLMWXCVBN", 7);

export function getCommonBrickProps(defaultClassName = "") {
  return {
    className: Type.String({
      default: defaultClassName,
      title: "Class Name",
      description: "The class name to apply to the text",
      "ui:widget": "hidden",
    }),
    id: Type.String({
      title: "ID",
      "ui:widget": "hidden",
    }),
    // brickId: Type.String({
    //   "ui:widget": "hidden",
    // }),
    brickRounding: Type.Union(
      [
        Type.Literal("rounded-none", { title: "None" }),
        Type.Literal("rounded-sm", { title: "S" }),
        Type.Literal("rounded-md", { title: "M" }),
        Type.Literal("rounded-lg", { title: "L" }),
        Type.Literal("rounded-xl", { title: "XL" }),
        Type.Literal("rounded-full", { title: "Full" }),
      ],
      {
        default: "rounded-none",
        title: "Rounding",
        description: "The brick corners rounding",
        "ui:field": "enum",
        "ui:display": "button-group",
      },
    ),
    brickPadding: Type.Number({
      minimum: 0,
      maximum: 10,
      default: 0,
      title: "Padding",
      description: "The brick inside space",
      "ui:field": "slider",
    }),
    brickBackground: Type.String({
      default: "bg-transparent",
      title: "Background color",
      description: "The brick background color",
      "ui:field": "color",
    }),
  } as const;
}

export const editableTextProps = {
  justify: Type.Union(
    [
      Type.Literal("text-left", { title: "Left", description: "Left align" }),
      Type.Literal("text-center", { title: "Center", description: "Center align" }),
      Type.Literal("text-right", { title: "Right", description: "Right align" }),
      Type.Literal("text-justify", { title: "Justify", description: "Justify align" }),
    ],
    {
      default: "text-left",
      title: "Justify",
      description: "The text alignment",
      "ui:widget": "hidden",
    },
  ),
  textEditable: Type.Boolean({
    default: true,
    "ui:widget": "hidden",
  }),
  content: Type.String({
    default: "Click to edit",
    title: "Content",
    description: "The text content",
    "ui:widget": "hidden",
  }),
};
