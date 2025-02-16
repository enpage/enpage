import type { AirtableOptions } from "./options";

/**
 * WARNING: not tested yet!!
 *
 * @todo test this function in a real environment
 */
export default async function airtableHandler(formData: FormData, options: AirtableOptions) {
  const result = await fetch(
    `https://api.airtable.com/v0/${options.baseId}/${encodeURIComponent(options.tableIdOrName)}`,
    {
      method: "POST",
      body: JSON.stringify(formData),
      headers: {
        Authorization: `Bearer ${options.accessToken}`,
        "Content-Type": "application/json",
      },
    },
  );
  return result.ok;
}
