import type { EnpageEnv } from "../env";
import { Type, type Static } from "@sinclair/typebox";
import z from "zod";
import type { GenericPageConfig, PageConfig } from "../page-config";

export const providerOptions = Type.Object({
  nextRefreshDelay: Type.Optional(Type.Number()),
});

export type ProviderOptions = Static<typeof providerOptions>;

export interface OAuthConfig<T> {
  siteId: string;
  siteDatasourceId: string;
  config: T;
  oauthTokenExpireAt: Date;
  oauthRefreshTokenExpireAt: Date | null;
  nextRefreshTokenAt: Date | null;
}

export type DatasourceFetcherParams<OAuthProps = unknown, Opts extends ProviderOptions = ProviderOptions> = {
  env: EnpageEnv;
  options: Opts;
  pageConfig: GenericPageConfig;
  oauth: OAuthProps extends null ? null : OAuthConfig<OAuthProps>;
};

export type DatasourceFetcher<
  T = unknown,
  OAuthOpts = unknown,
  Opts extends ProviderOptions = ProviderOptions,
> = (params: DatasourceFetcherParams<OAuthOpts, Opts>) => Promise<T>;

const providers = [
  "facebook-posts",
  "instagram-feed",
  "mastodon-status",
  "rss",
  "threads-media",
  "tiktok-video",
  "youtube-list",
  "http-json",
] as const;

export type DatasourceProvider = (typeof providers)[number];

export const datasourceProvider = z.enum(providers);
