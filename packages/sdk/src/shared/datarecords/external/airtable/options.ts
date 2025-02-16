import { Type, type Static } from "@sinclair/typebox";

export const airtableOptions = Type.Object({
  accessToken: Type.String({
    description: "Airtable Personal Token or OAuth Access Token",
  }),
  baseId: Type.String({
    pattern: "^app[A-Za-z0-9]+$",
    description: 'Airtable Base ID starting with "app"',
  }),
  tableIdOrName: Type.Union([
    Type.String({
      pattern: "^tbl[A-Za-z0-9]+$",
      description: 'Airtable Table ID starting with "tbl"',
    }),
    Type.String({
      description: "Table name as shown in Airtable interface",
    }),
  ]),
});

export type AirtableOptions = Static<typeof airtableOptions>;
