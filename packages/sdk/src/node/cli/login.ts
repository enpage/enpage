import type { Logger } from "vite";
import Conf from "conf";
import { API_BASE_URL, CLI_PROJECT_NAME, CONF_USER_TOKEN_KEY, CLI_LOGIN_POLL_MAX_TRIES } from "./constants";

export async function pollForLogin(logger: Logger, state: string, triesCount = 0) {
  if (triesCount >= CLI_LOGIN_POLL_MAX_TRIES) {
    logger.error("Login timeout. Please try again.");
    process.exit(1);
  }
  // poll for login
  // if login is successful, save the token
  const pollUrl = new URL(
    `cli/login-state/${state}`,
    API_BASE_URL.endsWith("/") ? API_BASE_URL : `${API_BASE_URL}/`,
  );
  const response = await fetch(pollUrl, {
    keepalive: true,
    headers: {
      Accept: "application/json",
      "x-enpage-cli": "true",
    },
  });

  if (response.status === 200) {
    const data = await response.json<{
      token: string;
    }>();
    const cliConfig = new Conf({ projectName: CLI_PROJECT_NAME });
    cliConfig.set(CONF_USER_TOKEN_KEY, data.token);
    logger.info("Login successful!\n");
    process.exit(0);
  } else if (response.status >= 400) {
    logger.error("Login failed. Please try again.");
    process.exit(1);
  } else {
    // poll every 2 seconds
    setTimeout(pollForLogin, 3000, logger, state, triesCount + 1);
  }
}
