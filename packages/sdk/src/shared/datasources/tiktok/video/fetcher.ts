import type { TiktokVideoOptions } from "./types";
import { type TiktokVideoResponseSchema, tiktokVideoResponseSchema } from "./schema";
import type { TiktokOAuthConfig } from "../oauth/config";
import type { DatasourceFetcher } from "../../types";
import Ajv from "ajv";

const fetchTiktokVideoDatasource: DatasourceFetcher<
  TiktokVideoResponseSchema,
  TiktokOAuthConfig,
  TiktokVideoOptions
> = async ({ options, oauth }) => {
  const params = new URLSearchParams({
    access_token: oauth.config.accessToken,
    fields: ["id", "title", "video_description", "duration", "cover_image_url", "embed_link"].join(","),
  });

  const url = `https://open.tiktokapis.com/v2/video/list/?${params.toString()}`;
  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${oauth.config.accessToken}`,
    },
    body: JSON.stringify(options.body ?? {}),
  });

  if (!response.ok) {
    throw new Error(`Response status: ${response.status}`);
  }
  const data = await response.json<TiktokVideoResponseSchema>();

  const ajv = new Ajv();
  const validate = ajv.compile<TiktokVideoResponseSchema>(tiktokVideoResponseSchema);
  const isValid = validate(data);

  if (!isValid) {
    throw new Error(`fetchTiktokVideoDatasource Error: Invalid JSON object: ${validate.errors}`);
  }

  return data;
};

export default fetchTiktokVideoDatasource;
