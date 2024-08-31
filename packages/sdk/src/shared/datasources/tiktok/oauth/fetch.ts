import { addSeconds, subMinutes } from "date-fns";
import type { TiktokOAuthConfig, TiktokFullOAuthConfig } from "./config";
import { mapKeys, camelCase } from "lodash-es";
import type { EnpageEnv } from "~/shared/env";

export function updateTiktokOAuthConfig(config: TiktokFullOAuthConfig, data: TiktokOAuthConfig) {
  return {
    ...config,
    config: data,
    nextRefreshTokenAt: getNextRefreshedAt(data),
    oauthRefreshTokenExpireAt: getTiktokRefreshExpireAt(data),
    oauthTokenExpireAt: getTiktokExpireAt(data),
  } satisfies TiktokFullOAuthConfig;
}

export function getNextRefreshedAt(data: TiktokOAuthConfig): Date {
  if (!data.expiresIn) {
    throw new Error("expiresIn is missing");
  }
  return subMinutes(addSeconds(new Date(), data.expiresIn), 60);
}

export function getTiktokExpireAt(data: TiktokOAuthConfig): Date {
  if (!data.expiresIn) {
    throw new Error("expiresIn is missing");
  }
  return addSeconds(new Date(), data.expiresIn);
}

export function getTiktokRefreshExpireAt(data: TiktokOAuthConfig): Date | null {
  if (!data.refreshExpiresIn) {
    throw new Error("refreshExpiresIn is missing");
  }
  return addSeconds(new Date(), data.refreshExpiresIn);
}

/**
 * @todo implement this function
 */
export function getTiktokNewOAuthConfig(config: TiktokOAuthConfig, data: TiktokOAuthConfig) {
  console.log("getTiktokNewOAuthConfig config: %s", JSON.stringify(config));
  console.log("getTiktokNewOAuthConfig data: %s", JSON.stringify(data));
  return data;
}

async function fetchTiktokToken(url: string, body: URLSearchParams) {
  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body,
  });

  if (!response.ok) {
    throw new Error(`Response status: ${response.status}`);
  }

  const data = (await response.json()) as TiktokOAuthConfig;

  if (!data) {
    throw new Error("No data found");
  }

  return mapKeys(data, (v: unknown, k: string) => camelCase(k)) as unknown as TiktokOAuthConfig;
}

export async function fetchTiktokOAuthConfig(env: EnpageEnv, oauthConfig: TiktokFullOAuthConfig) {
  if (!env.TIKTOK_CLIENT_KEY) {
    throw new Error("TIKTOK_CLIENT_KEY not found in env");
  }

  if (!env.TIKTOK_CLIENT_SECRET) {
    throw new Error("TIKTOK_CLIENT_SECRET not found in env");
  }

  const url = "https://open.tiktokapis.com/v2/oauth/token/";

  const params = new URLSearchParams({
    refresh_token: oauthConfig.config.refreshToken,
    grant_type: "refresh_token",
    client_key: env.TIKTOK_CLIENT_KEY,
    client_secret: env.TIKTOK_CLIENT_SECRET,
  });

  return fetchTiktokToken(url, params);
}
