import type { OAuthConfig } from "~/shared/datarecords/types";

export interface TiktokOAuthConfig {
  accessToken: string;
  expiresIn: number;
  openId: string;
  refreshExpiresIn: number;
  refreshToken: string;
  scope: string;
  tokenType: string;
}

export type TiktokFullOAuthConfig = OAuthConfig<TiktokOAuthConfig>;
