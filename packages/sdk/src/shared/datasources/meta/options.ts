import { Type, type Static } from "@sinclair/typebox";
import { providerOptions } from "../types";

export const metaOptions = Type.Composite([
  providerOptions,
  Type.Object({
    limit: Type.Optional(Type.Number()),
  }),
]);

export type MetaOptions = Static<typeof metaOptions>;
