import { Type, type Static } from "@sinclair/typebox";
import { providerOptions } from "~/shared/datasources/types";

export const youtubeListOptions = Type.Composite([
  providerOptions,
  Type.Object({
    channelId: Type.String(),
    order: Type.Optional(Type.String()),
    maxResults: Type.Optional(Type.Number()),
    regionCode: Type.Optional(Type.String()),
    relevanceLanguage: Type.Optional(Type.String()),
  }),
]);

export type YoutubeListOptions = Static<typeof youtubeListOptions>;
