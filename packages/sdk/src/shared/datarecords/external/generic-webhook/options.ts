import { Type, type Static } from "@sinclair/typebox";

export const genericWebhookOptions = Type.Object({
  url: Type.String({ format: "uri", title: "Webhook URL" }),
  headers: Type.Optional(
    Type.Record(Type.String(), Type.String(), {
      title: "Headers",
      description: "Additional headers to include in the webhook request",
    }),
  ),
});

export type GenericWebhookOptions = Static<typeof genericWebhookOptions>;
