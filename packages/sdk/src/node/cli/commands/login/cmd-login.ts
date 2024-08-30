import chalk from "chalk";
import { confirm } from "@inquirer/prompts";
import open from "open";
import { CLI_LOGIN_CLIENT_ID, OAUTH_ENDPOINT_DEVICE_CODE, OAUTH_ENDPOINT_TOKEN } from "../../constants";
import { post } from "../../api";
import { logger } from "~/node/shared/logger";
import type { ArgOpts, CommonOptions } from "../../types";
import { accessStore } from "../../store";

export async function pollForLogin(deviceCode: string) {
  while (true) {
    const body = new URLSearchParams({
      grant_type: "device_code",
      device_code: deviceCode,
      client_id: CLI_LOGIN_CLIENT_ID,
    });
    const tokenResponse = await post<DeviceCodeTokenSuccessResponse, DeviceCodeTokenErrorResponse>(
      OAUTH_ENDPOINT_TOKEN,
      body,
    );
    const { data, isSuccess } = tokenResponse;

    if (isSuccess) {
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

export async function login({ options }: ArgOpts<CommonOptions>) {
  logger.info(`Logging in to Enpage...\n`);

  const { isError, data } = await post<DeviceCodeResponse>(OAUTH_ENDPOINT_DEVICE_CODE, {
    client_id: CLI_LOGIN_CLIENT_ID,
    scope: "profile,templates:publish",
  });

  if (isError) {
    logger.error("Failed to get device code. Please try again.");
    logger.error(`Error: ${data.error_description ?? data.error}`);
    process.exit(1);
  }

  const { verification_uri, device_code } = data;

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
  const loginData = await pollForLogin(device_code);

  if (!loginData) {
    logger.error("Login failed. Please try again.");
    process.exit(1);
  }

  accessStore.set({
    ...loginData,
    ...(loginData.expires_in ? { expires_at: Date.now() + loginData.expires_in * 1000 } : {}),
  });
  logger.info("Login successful!\n");
  process.exitCode = 0;
}

interface DeviceCodeResponse {
  device_code: string;
  user_code: string;
  verification_uri: string;
  verification_uri_complete?: string; // Optional as per RFC 8628
  expires_in: number;
  interval?: number; // Optional as per RFC 8628
}

// Union type for the response

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
