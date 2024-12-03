import { Type, type Static } from "@sinclair/typebox";
import { buildOAuthConfigSchema } from "~/shared/oauth";

const tiktokOAuthConfig = Type.Object({
  accessToken: Type.String(),
  expiresIn: Type.Number(),
  openId: Type.String(),
  refreshExpiresIn: Type.Number(),
  refreshToken: Type.String(),
  scope: Type.String(),
  tokenType: Type.String(),
});

const tiktokFullOAuthConfig = buildOAuthConfigSchema(tiktokOAuthConfig);
export type TiktokFullOAuthConfig = Static<typeof tiktokFullOAuthConfig>;
