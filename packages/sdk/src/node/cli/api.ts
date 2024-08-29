import { API_BASE_URL } from "./constants";
import { accessConfig } from "./config";

/**
 *
 * @param pathOrUrl
 * @param data
 * @returns
 */
export async function post<ResponseType = unknown>(
  path: string,
  data: Record<string, unknown> | URLSearchParams,
  headers: Record<string, string> = {},
) {
  if (accessConfig.get("token")) {
    headers.Authorization = `Bearer ${accessConfig.get("token")}`;
  }
  const response = await fetch(toURL(path), {
    method: "POST",
    headers: {
      "Content-Type":
        data instanceof URLSearchParams ? "application/x-www-form-urlencoded" : "application/json",
      ...headers,
    },
    body: data instanceof URLSearchParams ? data : JSON.stringify(data),
  });
  return formatResponse<ResponseType>(response);
}

export async function get(path: string, headers: Record<string, string> = {}) {
  if (accessConfig.get("token")) {
    headers.Authorization = `Bearer ${accessConfig.get("token")}`;
  }
  const response = await fetch(toURL(path), { headers });
  return formatResponse(response);
}

function toURL(path: string) {
  const apiBaseURL = new URL(API_BASE_URL.endsWith("/") ? API_BASE_URL : `${API_BASE_URL}/`);
  return new URL(path, apiBaseURL);
}

async function formatResponse<ResponseType = unknown>(response: Response) {
  return {
    isSuccess: response.ok,
    isError: !response.ok,
    status: response.status,
    statusText: response.statusText,
    data:
      response.headers.get("content-type") === "application/json"
        ? ((await response.json()) as ResponseType)
        : ((await response.text()) as ResponseType),
  };
}
