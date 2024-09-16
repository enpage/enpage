import type { OAuthConfig } from "../../../types";

export interface MetaOAuthConfig {
  type: "short-lived" | "long-lived";
  accessToken: string;
  userId: string;
  permissions: string[];
  expiresIn: number;
  tokenType: string;
}

export type MetaFullOAuthConfig = OAuthConfig<MetaOAuthConfig>;
