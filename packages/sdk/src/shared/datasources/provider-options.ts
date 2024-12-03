import { Type, type Static } from "@sinclair/typebox";

export const providerOptions = Type.Object({
  refreshInterval: Type.Optional(Type.Number()),
});

export type ProviderOptions = Static<typeof providerOptions>;
