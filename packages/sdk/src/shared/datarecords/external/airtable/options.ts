import { Type, type Static } from "@sinclair/typebox";

export const airtableOptions = Type.Object({
  apiKey: Type.String({
    pattern: "^pat[A-Za-z0-9]+$",
    description: 'Airtable Personal Access Token starting with "pat"',
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
  view: Type.Optional(
    Type.String({
      description: "Optional view name or ID",
    }),
  ),
});

export type AirtableOptions = Static<typeof airtableOptions>;
