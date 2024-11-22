export async function post<
  ResponseType extends CommonResponseType = CommonResponseType,
  ErrorType = { error: string; error_description?: string },
>(
  path: string,
  data: Record<string, unknown> | URLSearchParams,
  headers: Record<string, string> = {},
  method = "POST",
) {
  const response = await fetch(toURL(path), {
    method,
    headers: {
      "Content-Type":
        data instanceof URLSearchParams ? "application/x-www-form-urlencoded" : "application/json",
      ...headers,
    },
    body: data instanceof URLSearchParams ? data : JSON.stringify(data),
    credentials: "include",
  }).catch((error) => {
    console.error(`Fatal Error requesting API: ${error.message} (${error.cause.code})`);
    console.error(`Please check your internet connection and try again, or retry later.`);
    process.exit(1);
  });

  return formatResponse<ResponseType, ErrorType>(response);
}

export async function patch<
  ResponseType extends CommonResponseType = CommonResponseType,
  ErrorType = { error: string; error_description?: string },
>(path: string, data: Record<string, unknown> | URLSearchParams, headers: Record<string, string> = {}) {
  return post<ResponseType, ErrorType>(path, data, headers, "PATCH");
}

export async function get<ResponseType = unknown, ErrorType = { error: string; error_description?: string }>(
  path: string,
  headers: Record<string, string> = {},
) {
  const response = await fetch(toURL(path), { headers, method: "GET", credentials: "include" }).catch(
    (error) => {
      console.error(`Fatal Error requesting API: ${error.message} (${error.cause.code})`);
      console.error(`Please check your internet connection and try again, or retry later.`);
      process.exit(1);
    },
  );
  return formatResponse<ResponseType, ErrorType>(response);
}

function toURL(path: string) {
  const apiBaseURL = new URL(`${window.location.origin}/api/v1/`);
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
