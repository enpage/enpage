import type { ThreadsMediaOptions } from "./types";
import { type ThreadsMediaSchema, threadsMediaSchema } from "./schema";
import type { MetaOAuthConfig } from "../../meta/oauth/config";
import Ajv from "ajv";
import type { DatasourceFetcher } from "../../types";
import invariant from "tiny-invariant";

const fetchThreadsMediaDatasource: DatasourceFetcher<
  ThreadsMediaSchema,
  MetaOAuthConfig,
  ThreadsMediaOptions
> = async ({ options, oauth }) => {
  invariant(oauth?.config, "fetchThreadsMediaDatasource Error: OAuth config is required");

  const params = new URLSearchParams({
    ...(options.urlParams ?? {}),
    access_token: oauth.config.accessToken,
    fields: [
      "id",
      "media_product_type",
      "media_type",
      "media_url",
      "permalink",
      "owner",
      "username",
      "text",
      "timestamp",
      "shortcode",
      "thumbnail_url",
      "children",
      "is_quote_post",
    ].join(","),
  });

  const response = await fetch(`https://graph.threads.net/v1.0/me/threads?${params.toString()}`);

  if (!response.ok) {
    throw new Error(`fetchThreadsMediaDatasource Error: Response status: ${response.status}`);
  }

  const media = await response.json<ThreadsMediaSchema>();

  const ajv = new Ajv();
  const validate = ajv.compile<ThreadsMediaSchema>(threadsMediaSchema);
  const isValid = validate(media);

  if (!isValid) {
    throw new Error(`fetchThreadsMediaDatasource Error: Invalid JSON object: ${validate.errors}`);
  }

  return media;
};

export default fetchThreadsMediaDatasource;
