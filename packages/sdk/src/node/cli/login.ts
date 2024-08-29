import type { Logger } from "vite";
import Conf from "conf";
import { nanoid } from "nanoid";
import chalk from "chalk";
import { confirm } from "@inquirer/prompts";
import open from "open";
import {
  CLI_PROJECT_NAME,
  CLI_LOGIN_CLIENT_ID,
  API_BASE_URL,
  OAUTH_ENDPOINT_DEVICE_CODE,
  OAUTH_ENDPOINT_TOKEN,
} from "./constants";
import { post } from "./api";

export async function pollForLogin(deviceCode: string, logger: Logger, state: string) {
  while (true) {
    const body = new URLSearchParams({
      grant_type: "device_code",
      device_code: deviceCode,
      client_id: CLI_LOGIN_CLIENT_ID,
    });
    const tokenResponse = await post<DeviceCodeTokenResponse>(OAUTH_ENDPOINT_TOKEN, body);
    const { data, isSuccess } = tokenResponse;

    if (isDeviceCodeTokenSuccessResponse(data)) {
      return data;
    }

    if (data.error === "authorization_pending") {
      await new Promise((resolve) => setTimeout(resolve, 5000));
    } else {
      // other error handling
      logger.error(`Error while polling for login: ${data.error_description ?? data.error}`);
      return false;
    }
  }
}

export async function performLogin(logger: Logger) {
  const id = nanoid(100);
  const tokenEndpoint = "oauth/token";

  logger.info(`Logging in to Enpage...\n`);

  const deviceCodeResponse = await fetch(OAUTH_ENDPOINT_DEVICE_CODE, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      client_id: CLI_LOGIN_CLIENT_ID,
      scope: "profile,templates:publish",
    }),
  });

  const deviceCodeData = await deviceCodeResponse.json<DeviceCodeResponse>().catch((e) => {
    logger.error(`Error while parsing DeviceCodeResponse: ${e.message}`);
    process.exit(1);
  });

  if (isDeviceCodeSuccessResponse(deviceCodeData) === false) {
    logger.error("Failed to get device code. Please try again.");
    logger.error(`Error: ${deviceCodeData.error_description ?? deviceCodeData.error}`);
    process.exit(1);
  }

  const { verification_uri, device_code } = deviceCodeData;

  const confirmed = await confirm({
    message: `Would you like to open the login page in your browser?`,
    default: true,
  }).catch((e) => {
    process.exit(0);
  });

  if (confirmed) {
    open(verification_uri);
  } else {
    logger.info(`\nPlease visit the following URL to login:\n  ${verification_uri}\n`);
  }

  logger.info(chalk.gray("\nWaiting for login...\n"));
  const loginData = await pollForLogin(device_code, logger, id);

  if (!loginData) {
    logger.error("Login failed. Please try again.");
    process.exit(1);
  }

  const cliConfig = new Conf<typeof loginData>({ projectName: CLI_PROJECT_NAME });
  cliConfig.set(loginData);
  logger.info("Login successful!\n");
  process.exit(0);
}

interface DeviceCodeSuccessResponse {
  device_code: string;
  user_code: string;
  verification_uri: string;
  verification_uri_complete?: string; // Optional as per RFC 8628
  expires_in: number;
  interval?: number; // Optional as per RFC 8628
}

// Error response type
interface DeviceCodeErrorResponse {
  error: string;
  error_description?: string;
  error_uri?: string;
}

// Union type for the response
type DeviceCodeResponse = DeviceCodeSuccessResponse | DeviceCodeErrorResponse;

function isDeviceCodeSuccessResponse(response: DeviceCodeResponse): response is DeviceCodeSuccessResponse {
  return "device_code" in response;
}

interface DeviceCodeTokenSuccessResponse {
  access_token: string;
  token_type: string;
  expires_in?: number;
  refresh_token?: string;
  scope?: string;
}

// Error response type for token request
interface DeviceCodeTokenErrorResponse {
  error: "authorization_pending" | "slow_down" | "access_denied" | "expired_token" | string;
  error_description?: string;
  error_uri?: string;
}

// Union type for the token response
type DeviceCodeTokenResponse = DeviceCodeTokenSuccessResponse | DeviceCodeTokenErrorResponse;

// Type guard to check if the response is a success response
function isDeviceCodeTokenSuccessResponse(
  response: DeviceCodeTokenResponse,
): response is DeviceCodeTokenSuccessResponse {
  return "access_token" in response;
}
