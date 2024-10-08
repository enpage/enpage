import type { OAuthConfig } from "~/shared/datasources/types";

export interface YoutubeOAuthConfig {
  accessToken: string;
  expiresIn: number;
  openId: string;
  refreshExpiresIn: number;
  refreshToken: string;
  scope: string;
  tokenType: string;
}

export type YoutubekFullOAuthConfig = OAuthConfig<YoutubeOAuthConfig>;
