import { Type, type Static } from "@sinclair/typebox";
import { providerOptions } from "../types";

export const mastodonCommonOptions = Type.Composite([
  providerOptions,
  Type.Object({
    username: Type.String(),
  }),
]);

export type MastodonCommonOptions = Static<typeof mastodonCommonOptions>;
