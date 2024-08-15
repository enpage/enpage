import type { EnpageEnv } from "../env";

export interface Options {
  nextRefreshDelay?: number;
}

export interface OAuthConfig<T> {
  siteId: string;
  siteDatasourceId: string;
  config: T;
  oauthTokenExpireAt: Date;
  oauthRefreshTokenExpireAt: Date | null;
  nextRefreshTokenAt: Date | null;
}

type DatasourceFetcherParams<OAuthProps = unknown, Opts extends Options = Options> = {
  env: EnpageEnv;
  options: Opts;
  oauth: OAuthProps extends null ? null : OAuthConfig<OAuthProps>;
};

export type DatasourceFetcher<T = unknown, OAuthOpts = unknown, Opts extends Options = Options> = (
  params: DatasourceFetcherParams<OAuthOpts, Opts>,
) => Promise<T>;
