import { instagramFeedSchema, type InstagramFeedSchema } from "./schema";
import type { MetaOAuthConfig } from "../../meta/oauth/config";
import type { DatasourceFetcher } from "../../types";
import { Http401Error } from "../../errors";
import type { MetaOptions } from "../../meta/options";
import { stringifyObjectValues } from "../../utils";
import { ajv, serializeAjvErrors } from "~/shared/ajv";

const fetchInstagramFeedDatasource: DatasourceFetcher<
  InstagramFeedSchema,
  MetaOAuthConfig,
  MetaOptions
> = async ({ options, oauth }) => {
  const params = new URLSearchParams({
    ...stringifyObjectValues(options),
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

  const validate = ajv.compile<InstagramFeedSchema>(instagramFeedSchema);
  const isValid = validate(feed);

  if (!isValid) {
    throw new Error(
      `fetchInstagramFeedDatasource Error: Invalid Instagram response data: ${serializeAjvErrors(validate.errors)}`,
    );
  }

  return feed;
};

export default fetchInstagramFeedDatasource;
