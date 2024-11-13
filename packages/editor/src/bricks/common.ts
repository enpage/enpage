import { type Static, Type } from "@sinclair/typebox";
import { tx } from "@enpage/style-system/twind";

// export const commonBrickProps = Type.Object({
//   className: Type.String({
//     default: "",
//     title: "Class Name",
//     description: "The class name to apply to the text",
//     "ui:widget": "hidden",
//   }),
//   id: Type.String({
//     title: "ID",
//     "ui:widget": "hidden",
//   }),
//   z: Type.Optional(
//     Type.Number({
//       title: "Z-index",
//       "ui:widget": "hidden",
//     }),
//   ),
//   // brickId: Type.String({
//   //   "ui:widget": "hidden",
//   // }),
//   brickRounding: Type.Union(
//     [
//       Type.Literal("rounded-none", { title: "None" }),
//       Type.Literal("rounded-sm", { title: "S" }),
//       Type.Literal("rounded-md", { title: "M" }),
//       Type.Literal("rounded-lg", { title: "L" }),
//       Type.Literal("rounded-xl", { title: "XL" }),
//       Type.Literal("rounded-full", { title: "Full" }),
//     ],
//     {
//       default: "rounded-none",
//       title: "Rounding",
//       description: "The brick corners rounding",
//       "ui:field": "enum",
//       "ui:display": "button-group",
//       "ui:group": "border",
//     },
//   ),
//   borderWidth: Type.Union(
//     [
//       Type.Literal("border-0", { title: "None" }),
//       Type.Literal("border", { title: "S" }),
//       Type.Literal("border-2", { title: "M" }),
//       Type.Literal("border-4", { title: "L" }),
//       Type.Literal("border-8", { title: "XL" }),
//     ],
//     {
//       default: "border-0",
//       title: "Border width",
//       description: "The brick border width",
//       "ui:field": "enum",
//       "ui:display": "button-group",
//       "ui:group": "border",
//     },
//   ),
//   borderColor: Type.String({
//     default: "transparent",
//     title: "Border color",
//     description: "The brick border color",
//     "ui:field": "color",
//     "ui:color-attr": "border-color",
//     "ui:group": "border",
//   }),
//   borderStyle: Type.Union(
//     [
//       Type.Literal("border-solid", { title: "Solid" }),
//       Type.Literal("border-dashed", { title: "Dashed" }),
//       Type.Literal("border-dotted", { title: "Dotted" }),
//     ],
//     {
//       default: "border-solid",
//       title: "Border style",
//       description: "The brick border style",
//       "ui:field": "enum",
//       "ui:display": "button-group",
//       "ui:group": "border",
//     },
//   ),
//   brickPadding: Type.Number({
//     minimum: 0,
//     maximum: 10,
//     default: 0,
//     title: "Padding",
//     description: "The brick inside space",
//     "ui:field": "slider",
//   }),
//   brickBackgroundColor: Type.String({
//     default: "transparent",
//     title: "Background color",
//     description: "The brick background color",
//     "ui:field": "color",
//     "ui:color-attr": "background-color",
//   }),
// });

// export const editableTextProps = Type.Object({
//   justify: Type.Optional(
//     Type.Union(
//       [
//         Type.Literal("text-left", { title: "Left", description: "Left align" }),
//         Type.Literal("text-center", { title: "Center", description: "Center align" }),
//         Type.Literal("text-right", { title: "Right", description: "Right align" }),
//         Type.Literal("text-justify", { title: "Justify", description: "Justify align" }),
//       ],
//       {
//         default: "text-left",
//         title: "Justify",
//         description: "The text alignment",
//         "ui:widget": "hidden",
//       },
//     ),
//   ),
//   textEditable: Type.Optional(
//     Type.Boolean({
//       default: true,
//       "ui:widget": "hidden",
//     }),
//   ),
// });