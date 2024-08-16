import type { EnpageEnv } from "../env";
import z from "zod";

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

export enum DatasourceProvider {
  FacebookPosts = "facebook-posts",
  InstagramFeed = "instagram-feed",
  MastodonStatus = "mastodon-status",
  Rss = "rss",
  ThreadsMedia = "threads-media",
  TiktokVideo = "tiktok-video",
  TwitterTimeline = "twitter-timeline",
  TwitterTweet = "twitter-tweet",
  YoutubeList = "youtube-list",
}

export const datasourceProvider = z.nativeEnum(DatasourceProvider);
