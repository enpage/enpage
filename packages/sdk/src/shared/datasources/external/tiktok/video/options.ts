import { Type, type Static } from "@sinclair/typebox";
import { providerOptions } from "~/shared/datasources/types";

export const tiktokVideoOptions = Type.Composite([
  providerOptions,
  Type.Object({
    maxCount: Type.Number(),
  }),
]);

export type TiktokVideoOptions = Static<typeof tiktokVideoOptions>;
