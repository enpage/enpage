import { Type, type Static } from "@sinclair/typebox";
import { providerOptions } from "../../provider-options";

export const mastodonCommonOptions = Type.Composite([
  providerOptions,
  Type.Object({
    username: Type.String(),
  }),
]);

export type MastodonCommonOptions = Static<typeof mastodonCommonOptions>;
