import type { InstagramFeedOptions } from "./types";
import { instagramFeedSchema, type InstagramFeedSchema } from "./schema";
import Ajv from "ajv";
import type { MetaOAuthConfig } from "../../meta/oauth/config";
import type { DatasourceFetcher } from "../../types";
import { Http401Error } from "../../errors";

const fetchInstagramFeedDatasource: DatasourceFetcher<
  InstagramFeedSchema,
  MetaOAuthConfig,
  InstagramFeedOptions
> = async ({ options, oauth }) => {
  const params = new URLSearchParams({
    ...(options.urlParams ?? {}),
    access_token: oauth.config.accessToken,
    fields: ["id", "caption", "timestamp", "thumbnail_url", "media_url", "permalink", "media_type"].join(","),
  });

  const response = await fetch(`https://graph.instagram.com/me/media?${params.toString()}`);

  if (!response.ok) {
    if (response.status === 401) {
      throw new Http401Error(`fetchInstagramFeedDatasource Error: Unauthorized.`);
    }
    throw new Error(`fetchInstagramFeedDatasource Error: Response status: ${response.status}`);
  }

  const feed = (await response.json()) as InstagramFeedSchema;

  const ajv = new Ajv();
  const validate = ajv.compile<InstagramFeedSchema>(instagramFeedSchema);
  const isValid = validate(feed);

  if (!isValid) {
    throw new Error(`fetchInstagramFeedDatasource Error: Invalid JSON object: ${validate.errors}`);
  }

  return feed;
};

export default fetchInstagramFeedDatasource;
