import type { GenericWebhookOptions } from "./options";

export default async function genericWebhookHandler(formData: FormData, options: GenericWebhookOptions) {
  const result = await fetch(options.url, {
    method: "POST",
    body: JSON.stringify(formData),
    headers: options.headers,
  });
  return result.ok;
}
