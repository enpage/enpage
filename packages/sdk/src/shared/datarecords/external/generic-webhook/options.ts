import { Type, type Static } from "@sinclair/typebox";

export const genericWebhookOptions = Type.Object({
  url: Type.String({ format: "uri" }),
  headers: Type.Optional(Type.Record(Type.String(), Type.String())),
});

export type GenericWebhookOptions = Static<typeof genericWebhookOptions>;
