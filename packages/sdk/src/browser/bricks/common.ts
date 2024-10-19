import { Type } from "@sinclair/typebox";
import { customAlphabet } from "nanoid";

export const generateId = customAlphabet("1234567890azertyuiopqsdfghjklmwxcvbnAZERTYUIOPQSDFGHJKLMWXCVBN", 7);

export function getCommonBrickProps(defaultClassName: string) {
  return {
    className: Type.String({
      default: defaultClassName,
      title: "Class Name",
      description: "The class name to apply to the text",
      "ui:field": "hidden",
    }),
    id: Type.String({
      title: "ID",
      description: "The id attribute for the text",
      "ui:field": "hidden",
    }),
    brickId: Type.String({
      default: "",
      "ui:field": "hidden",
    }),
  } as const;
}

export function getTextEditableBrickProps() {
  return {
    textEditable: Type.Boolean({
      default: true,
      "ui:field": "hidden",
    }),
  } as const;
}
