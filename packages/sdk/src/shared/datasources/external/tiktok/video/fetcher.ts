import type { TiktokVideoOptions } from "./options";
import { type TiktokVideoResponseSchema, tiktokVideoResponseSchema } from "./schema";
import type { TiktokOAuthConfig } from "../oauth/config";
import { UnauthorizedError } from "~/shared/errors";
import { ajv, serializeAjvErrors } from "~/shared/ajv";
import type { DatasourceFetcher } from "~/shared/datasources";

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
  const { refreshInterval, ...body } = options;
  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${oauth.config.accessToken}`,
    },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    if (response.status === 401) {
      throw new UnauthorizedError(`fetchTiktokVideoDatasource Error: Unauthorized.`);
    }
    throw new Error(`Response status: ${response.status}`);
  }
  const data = (await response.json()) as TiktokVideoResponseSchema;

  const validate = ajv.compile<TiktokVideoResponseSchema>(tiktokVideoResponseSchema);
  const isValid = validate(data);

  if (!isValid) {
    throw new Error(
      `fetchTiktokVideoDatasource Error: Invalid TikTok response data: ${serializeAjvErrors(validate.errors)}`,
    );
  }

  return data;
};

export default fetchTiktokVideoDatasource;
