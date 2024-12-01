import { Type, type Static } from "@sinclair/typebox";
import { buildOAuthConfigSchema } from "~/shared/datasources";

const metaOAuthConfig = Type.Object({
  type: Type.Union([Type.Literal("short-lived"), Type.Literal("long-lived")]),
  accessToken: Type.String(),
  userId: Type.String(),
  permissions: Type.Array(Type.String()),
  expiresIn: Type.Number(),
  tokenType: Type.String(),
});

export type MetaOAuthConfig = Static<typeof metaOAuthConfig>;

const metaFullOAuthConfig = buildOAuthConfigSchema(metaOAuthConfig);
export type MetaFullOAuthConfig = Static<typeof metaFullOAuthConfig>;
