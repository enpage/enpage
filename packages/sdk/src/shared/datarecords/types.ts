import { Type, type Static } from "@sinclair/typebox";
import z from "zod";
import type { GenericPageConfig } from "../page";

export const providerOptions = Type.Object({});

export type ProviderOptions = Static<typeof providerOptions>;

export interface OAuthConfig<T> {
  siteId: string;
  siteDatarecordId: string;
  config: T;
  oauthTokenExpireAt: Date;
  oauthRefreshTokenExpireAt: Date | null;
  nextRefreshTokenAt: Date | null;
}

export type DatarecordFetcherParams<OAuthProps = unknown, Opts extends ProviderOptions = ProviderOptions> = {
  options: Opts;
  pageConfig: GenericPageConfig;
  oauth: OAuthProps extends null ? null : OAuthConfig<OAuthProps>;
};

export type DatarecordFetcher<
  T = unknown,
  OAuthOpts = unknown,
  Opts extends ProviderOptions = ProviderOptions,
> = (params: DatarecordFetcherParams<OAuthOpts, Opts>) => Promise<T>;

const providers = ["google-sheets", "airtable", "api"] as const;

export type DatarecordProvider = (typeof providers)[number];

export const datarecordProvider = z.enum(providers);
