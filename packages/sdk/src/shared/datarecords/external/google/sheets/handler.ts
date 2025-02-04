import type { GoogleSheetsOptions } from "./options";

/**
 * WARNING: not tested yet!!
 *
 * @todo test this function in a real environment
 */
export default async function googleSheetsHandler(
  formData: FormData,
  options: GoogleSheetsOptions,
  accessToken: string,
) {
  const url = `https://sheets.googleapis.com/v4/spreadsheets/${options.spreadsheetId}/values/A:Z:append?valueInputOption=RAW`;

  const result = await fetch(url, {
    method: "POST",
    body: JSON.stringify({
      values: [formData], // Wrap the row values in an array since API expects 2D array
    }),
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
  });
  return result.ok;
}
