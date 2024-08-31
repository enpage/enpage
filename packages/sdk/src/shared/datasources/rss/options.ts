import { Type, type Static } from "@sinclair/typebox";
import { providerOptions } from "../types";

export const rssOptions = Type.Composite([
  providerOptions,
  Type.Object({
    url: Type.String({ format: "uri" }),
  }),
]);

export type RssOptions = Static<typeof rssOptions>;