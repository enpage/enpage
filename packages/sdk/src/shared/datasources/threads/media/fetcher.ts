import { type ThreadsMediaSchema, threadsMediaSchema } from "./schema";
import type { MetaOAuthConfig } from "../../meta/oauth/config";
import type { DatasourceFetcher } from "../../types";
import invariant from "~/shared/utils/invariant";
import { Http401Error } from "../../errors";
import type { MetaOptions } from "../../meta/options";
import { stringifyObjectValues } from "../../utils";
import { ajv, serializeAjvErrors } from "~/shared/ajv";

const fetchThreadsMediaDatasource: DatasourceFetcher<
  ThreadsMediaSchema,
  MetaOAuthConfig,
  MetaOptions
> = async ({ options, oauth }) => {
  invariant(oauth?.config, "fetchThreadsMediaDatasource Error: OAuth config is required");

  const params = new URLSearchParams({
    ...stringifyObjectValues(options),
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
    if (response.status === 401) {
      throw new Http401Error(`fetchThreadsMediaDatasource Error: Unauthorized.`);
    }
    throw new Error(`fetchThreadsMediaDatasource Error: Response status: ${response.status}`);
  }

  const media = (await response.json()) as ThreadsMediaSchema;

  const validate = ajv.compile<ThreadsMediaSchema>(threadsMediaSchema);
  const isValid = validate(media);

  if (!isValid) {
    throw new Error(
      `fetchThreadsMediaDatasource Error: Invalid Threads response data: ${serializeAjvErrors(validate.errors)}`,
    );
  }

  return media;
};

export default fetchThreadsMediaDatasource;
