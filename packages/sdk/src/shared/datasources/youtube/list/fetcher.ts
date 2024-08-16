import type { YoutubeListOptions } from "./types";
import { type YoutubeListSchema, youtubeListSchema } from "./schema";
import Ajv from "ajv";
import type { DatasourceFetcher } from "../../types";
import type { YoutubeOAuthConfig } from "../oauth/config";
import { Http401Error } from "../../errors";

const fetchYoutubeList: DatasourceFetcher<
  YoutubeListSchema,
  YoutubeOAuthConfig | null,
  YoutubeListOptions
> = async ({ options, oauth, env }) => {
  if (!env.YOUTUBE_API_KEY) {
    throw new Error("fetchYoutubeList: YOUTUBE_API_KEY is not set");
  }

  const params = new URLSearchParams({
    ...(options.urlParams ?? {}),
    part: "snippet,id",
    type: "video",
    videoEmbeddable: "true",
  });

  if (oauth?.config?.accessToken) {
    params.set("access_token", oauth.config.accessToken);
  } else if (!env.YOUTUBE_API_KEY) {
    throw new Error("fetchYoutubeList: YOUTUBE_API_KEY is not set");
  } else {
    params.set("key", env.YOUTUBE_API_KEY);
  }

  const url = `https://www.googleapis.com/youtube/v3/search?${params.toString()}`;
  const response = await fetch(url);
  if (!response.ok) {
    if (response.status === 401) {
      throw new Http401Error(`fetchYoutubeList Error: Unauthorized.`);
    }
    throw new Error(`fetchYoutubeList Error: Response status: ${response.status}`);
  }

  const data = (await response.json()) as YoutubeListSchema;

  const ajv = new Ajv();
  const validate = ajv.compile<YoutubeListSchema>(youtubeListSchema);
  const isValid = validate(data);

  if (!isValid) {
    throw new Error(`fetchYoutubeList Error: Invalid Youtube response object: ${validate.errors}`);
  }

  return data;
};

export default fetchYoutubeList;
