import { type MastodonStatusArraySchema, mastodonStatusArraySchema } from "./schema";
import fetchMastodonAccount from "../account/fetcher";
import Ajv from "ajv";
import type { DatasourceFetcher } from "../../types";
import { Http401Error } from "../../errors";
import type { MastodonCommonOptions } from "../options";

const fetchMastodonStatus: DatasourceFetcher<
  MastodonStatusArraySchema,
  null,
  MastodonCommonOptions
> = async ({ options, env }) => {
  const account = await fetchMastodonAccount({ options: { username: options.username }, env, oauth: null });

  const accountUrl = new URL(account.url);
  const url = `https://${accountUrl.host}/api/v1/accounts/${account.id}/statuses`;

  const response = await fetch(url);

  if (!response.ok) {
    if (response.status === 401) {
      throw new Http401Error(`fetchMastodonStatus Error: Unauthorized.`);
    }
    throw new Error(`fetchMastodonStatus Error: Response status: ${response.status}`);
  }

  const statuses = (await response.json()) as MastodonStatusArraySchema;

  const ajv = new Ajv();
  const validate = ajv.compile<MastodonStatusArraySchema>(mastodonStatusArraySchema);
  const isValid = validate(statuses);

  if (!isValid) {
    throw new Error(`fetchMastodonStatus Error: Invalid response object: ${validate.errors}`);
  }

  return statuses;
};

export default fetchMastodonStatus;
