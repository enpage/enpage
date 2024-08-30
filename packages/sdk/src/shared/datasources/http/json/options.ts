import { Type, type Static } from "@sinclair/typebox";
import { providerOptions } from "../../types";

export const httpJsonOptions = Type.Composite([
  providerOptions,
  Type.Object({
    url: Type.String(),
    headers: Type.Optional(Type.Record(Type.String(), Type.String())),
    pageConfig: Type.Object({
      page: Type.Number(),
      limit: Type.Number(),
    }),
  }),
]);

export type HttpJsonOptions = Static<typeof httpJsonOptions>;
