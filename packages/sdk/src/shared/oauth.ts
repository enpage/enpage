import { Type, type TSchema } from "@sinclair/typebox";

export const buildOAuthConfigSchema = <T extends TSchema>(T: T) =>
  Type.Object({
    siteId: Type.String(),
    siteDatasourceId: Type.String(),
    config: T,
    oauthTokenExpireAt: Type.String(),
    oauthRefreshTokenExpireAt: Type.Optional(Type.String()),
    nextRefreshTokenAt: Type.Optional(Type.String()),
  });
