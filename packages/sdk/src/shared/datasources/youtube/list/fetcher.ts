import type { YoutubeListOptions } from "./options";
import { type YoutubeListSchema, youtubeListSchema } from "./schema";
import Ajv from "ajv";
import type { DatasourceFetcher } from "../../types";
import type { YoutubeOAuthConfig } from "../oauth/config";
import { Http401Error } from "../../errors";
import { stringifyObjectValues } from "../../utils";
import { ajv, serializeAjvErrors } from "~/shared/ajv";

const fetchYoutubeList: DatasourceFetcher<
  YoutubeListSchema,
  YoutubeOAuthConfig,
  YoutubeListOptions
> = async ({ options, oauth }) => {
  const params = new URLSearchParams({
    ...stringifyObjectValues(options),
    part: "snippet,id",
    type: "video",
    videoEmbeddable: "true",
    access_token: oauth.config.accessToken,
  });

  const url = `https://www.googleapis.com/youtube/v3/search?${params}`;

  const response = await fetch(url);

  if (!response.ok) {
    if (response.status === 401) {
      throw new Http401Error(`fetchYoutubeList Error: Unauthorized.`);
    }
    throw new Error(`fetchYoutubeList Error: Response status: ${response.status}`);
  }

  const data = (await response.json()) as YoutubeListSchema;
  const validate = ajv.compile<YoutubeListSchema>(youtubeListSchema);
  const isValid = validate(data);

  if (!isValid) {
    throw new Error(
      `fetchYoutubeList Error: Invalid Youtube response data: ${serializeAjvErrors(validate.errors)}`,
    );
  }

  return data;
};

export default fetchYoutubeList;
