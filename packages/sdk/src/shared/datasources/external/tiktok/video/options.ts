import { Type, type Static } from "@sinclair/typebox";
import { providerOptions } from "~/shared/datasources/provider-options";

export const tiktokVideoOptions = Type.Composite([
  providerOptions,
  Type.Object({
    maxCount: Type.Optional(Type.Number()),
    refreshInterval: Type.Optional(Type.Number()),
  }),
]);

export type TiktokVideoOptions = Static<typeof tiktokVideoOptions>;
