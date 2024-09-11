import { logger } from "../shared/logger";
import { API_BASE_URL } from "./constants";
import { accessStore } from "./store";

type SuccessResponseWrapper<T> = {
  isSuccess: true;
  isError: false;
  status: number;
  statusText: string;
  data: T;
};

type ErrorResponseWrapper<E> = {
  isSuccess: false;
  isError: true;
  status: number;
  statusText: string;
  data: E;
};

type ResponseWrapper<T, E> = SuccessResponseWrapper<T> | ErrorResponseWrapper<E>;

type CommonResponseType = {
  success: boolean;
};

/**
 *
 * @param pathOrUrl
 * @param data
 * @returns
 */
export async function post<
  ResponseType extends CommonResponseType = CommonResponseType,
  ErrorType = { error: string; error_description?: string },
>(path: string, data: Record<string, unknown> | URLSearchParams, headers: Record<string, string> = {}) {
  if (accessStore.get("access_token")) {
    headers.Authorization = `Bearer ${accessStore.get("access_token")}`;
  }
  const response = await fetch(toURL(path), {
    method: "POST",
    headers: {
      "Content-Type":
        data instanceof URLSearchParams ? "application/x-www-form-urlencoded" : "application/json",
      ...headers,
    },
    body: data instanceof URLSearchParams ? data : JSON.stringify(data),
  }).catch((error) => {
    logger.error(`Fatal Error requesting API: ${error.message} (${error.cause.code})`);
    logger.error(`Please check your internet connection and try again, or retry later.`);
    process.exit(1);
  });

  return formatResponse<ResponseType, ErrorType>(response);
}

export async function get<ResponseType = unknown, ErrorType = { error: string; error_description?: string }>(
  path: string,
  headers: Record<string, string> = {},
) {
  if (accessStore.get("access_token")) {
    headers.Authorization = `Bearer ${accessStore.get("access_token")}`;
  }
  const response = await fetch(toURL(path), { headers, method: "GET" }).catch((error) => {
    logger.error(`Fatal Error requesting API: ${error.message} (${error.cause.code})`);
    logger.error(`Please check your internet connection and try again, or retry later.`);
    process.exit(1);
  });
  return formatResponse<ResponseType, ErrorType>(response);
}

function toURL(path: string) {
  const apiBaseURL = new URL(API_BASE_URL.endsWith("/") ? API_BASE_URL : `${API_BASE_URL}/`);
  return new URL(path, apiBaseURL);
}

async function formatResponse<SuccessType, ErrorType>(
  response: Response,
): Promise<ResponseWrapper<SuccessType, ErrorType>> {
  const data = response.headers.get("content-type")?.startsWith("application/json")
    ? ((await response.json()) as ResponseType)
    : ((await response.text()) as ResponseType);

  if (response.ok) {
    return {
      isSuccess: true,
      isError: false,
      status: response.status,
      statusText: response.statusText,
      data: data as SuccessType,
    };
  } else {
    return {
      isSuccess: false,
      isError: true,
      status: response.status,
      statusText: response.statusText,
      data: data as ErrorType,
    };
  }
}
