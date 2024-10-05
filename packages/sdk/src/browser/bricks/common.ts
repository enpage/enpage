import { Type } from "@sinclair/typebox";
import { customAlphabet } from "nanoid";

export const generateId = customAlphabet("1234567890azertyuiopqsdfghjklmwxcvbn", 7);

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
  } as const;
}
