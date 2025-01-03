import { Type, type Static } from "@sinclair/typebox";

export const googleSheetsOptions = Type.Object({
  spreadsheetId: Type.String(),
  // If targeting specific sheet
  sheetName: Type.Optional(Type.String()),
});

export type GoogleSheetsOptions = Static<typeof googleSheetsOptions>;
