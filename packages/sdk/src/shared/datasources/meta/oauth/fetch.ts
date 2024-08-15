import { addSeconds, subMinutes } from "date-fns";
import type { MetaFullOAuthConfig } from "./config";
import type { EnpageEnv } from "~/shared/env";

export interface MetaGetLongLivedTokenResponse {
  access_token: string;
  token_type: string;
  expires_in: number;
}

export function updateMetaOAuthConfig(oauth: MetaFullOAuthConfig, data: MetaGetLongLivedTokenResponse) {
  oauth.config.accessToken = data.access_token;
  oauth.config.type = "long-lived";
  oauth.config.expiresIn = data.expires_in;
  oauth.config.tokenType = data.token_type;
  oauth.oauthTokenExpireAt = addSeconds(new Date(), data.expires_in);
  oauth.nextRefreshTokenAt = subMinutes(addSeconds(new Date(), data.expires_in), 60);
  return oauth;
}

async function fetchMetaToken(url: string, params: URLSearchParams) {
  const fullUrl = `${url}?${params.toString()}`;
  const response = await fetch(fullUrl);
  if (!response.ok) {
    throw new Error(`fetchMetaToken Error: Response status: ${response.status}`);
  }
  return response.json<MetaGetLongLivedTokenResponse>();
}

export async function fetchMetaOAuthConfig(
  baseUrl: string,
  clientSecret: string,
  metaPrefix: string,
  oauth: MetaFullOAuthConfig,
) {
  switch (oauth.config.type) {
    case "short-lived": {
      const url = `${baseUrl}/access_token`;
      const params = new URLSearchParams();
      params.append("grant_type", `${metaPrefix}_exchange_token`);
      params.append("client_secret", clientSecret);
      params.append("access_token", oauth.config.accessToken);
      return fetchMetaToken(url, params);
    }
    case "long-lived": {
      const url = `${baseUrl}/refresh_access_token`;
      const params = new URLSearchParams();
      params.append("grant_type", `${metaPrefix}_refresh_token`);
      params.append("access_token", oauth.config.accessToken);
      return fetchMetaToken(url, params);
    }
    default:
      throw new Error("Invalid config type");
  }
}

export async function fetchFacebookOAuthConfig(env: EnpageEnv, fbConfig: MetaFullOAuthConfig) {
  if (!env.FACEBOOK_APP_SECRET) {
    throw new Error("FACEBOOK_APP_SECRET not found in env");
  }
  return fetchMetaOAuthConfig("https://graph.facebook.com", env.FACEBOOK_APP_SECRET, "fb", fbConfig);
}

export async function fetchInstagramOAuthConfig(env: EnpageEnv, igConfig: MetaFullOAuthConfig) {
  if (!env.INSTAGRAM_APP_SECRET) {
    throw new Error("INSTAGRAM_APP_SECRET not found in env");
  }
  return fetchMetaOAuthConfig("https://graph.instagram.com", env.INSTAGRAM_APP_SECRET, "ig", igConfig);
}

export async function fetchThreadsOAuthConfig(env: EnpageEnv, authConfig: MetaFullOAuthConfig) {
  if (!env.THREADS_APP_SECRET) {
    throw new Error("THREADS_APP_SECRET not found in env");
  }
  return fetchMetaOAuthConfig("https://graph.threads.net", env.THREADS_APP_SECRET, "th", authConfig);
}
