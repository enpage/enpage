import { type MastodonStatusArraySchema, mastodonStatusArraySchema } from "./schema";
import fetchMastodonAccount from "../account/fetcher";
import type { DatasourceFetcher } from "~/shared/datasources/types";
import { UnauthorizedError } from "~/shared/errors";
import type { MastodonCommonOptions } from "../options";
import { ajv, serializeAjvErrors } from "~/shared/ajv";

const fetchMastodonStatus: DatasourceFetcher<
  MastodonStatusArraySchema,
  null,
  MastodonCommonOptions
> = async ({ options, pageConfig }) => {
  const account = await fetchMastodonAccount({
    options: { username: options.username },
    pageConfig,
    oauth: null,
  });

  const accountUrl = new URL(account.url);
  const url = `https://${accountUrl.host}/api/v1/accounts/${account.id}/statuses`;

  const response = await fetch(url);

  if (!response.ok) {
    if (response.status === 401) {
      throw new UnauthorizedError(`fetchMastodonStatus Error: Unauthorized.`);
    }
    throw new Error(`fetchMastodonStatus Error: Response status: ${response.status}`);
  }

  const statuses = (await response.json()) as MastodonStatusArraySchema;

  const validate = ajv.compile<MastodonStatusArraySchema>(mastodonStatusArraySchema);
  const isValid = validate(statuses);

  if (!isValid) {
    throw new Error(
      `fetchMastodonStatus Error: Invalid Mastodon status response data: ${serializeAjvErrors(validate.errors)}`,
    );
  }

  return statuses;
};

export default fetchMastodonStatus;
