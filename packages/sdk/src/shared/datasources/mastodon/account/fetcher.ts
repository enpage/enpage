import { type MastodonAccountSchema, mastodonAccountSchema } from "./schema";
import Ajv from "ajv";
import type { DatasourceFetcher } from "../../types";
import type { MastodonAccountOptions } from "./types";

const fetchMastodonAccount: DatasourceFetcher<MastodonAccountSchema, null, MastodonAccountOptions> = async ({
  options,
}) => {
  const params = new URLSearchParams({
    acct: options.username,
  });

  const url = `https://mastodon.social/api/v1/accounts/lookup?${params.toString()}`;
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`fetchMastodonAccount Error: Response status: ${response.status}`);
  }

  const account = (await response.json()) as MastodonAccountSchema;

  const ajv = new Ajv();
  const validate = ajv.compile<MastodonAccountSchema>(mastodonAccountSchema);
  const isValid = validate(account);

  if (!isValid) {
    throw new Error(`fetchMastodonAccount Error: Invalid JSON object: ${validate.errors}`);
  }

  return account;
};

export default fetchMastodonAccount;
