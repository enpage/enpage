import type { Attributes } from "../attributes";
import type { ProviderOptions } from "./provider-options";

export type DatasourceFetcherParams<
  OAuthProps = unknown,
  Opts extends Record<string, unknown> = ProviderOptions,
> = {
  options: Opts;
  attr: Attributes;
  oauth: OAuthProps;
};

export type DatasourceFetcher<
  T = unknown,
  OAuthOpts = unknown,
  Opts extends Record<string, unknown> = ProviderOptions,
> = (params: DatasourceFetcherParams<OAuthOpts, Opts>) => Promise<T>;
