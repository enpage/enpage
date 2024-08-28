export const CLI_PROJECT_NAME = "enpage-cli";
export const CONF_USER_TOKEN_KEY = "token";
export const CLI_LOGIN_POLL_INTERVAL = 3000; // seconds
export const CLI_LOGIN_CLIENT_ID =
  process.env.PUBLIC_ENPAGE_OAUTH_CLIENT_ID ?? "50000000-0000-0000-0000-000000000001";
export const CLI_LOGIN_POLL_MAX_TIME = 3; // minutes
export const CLI_LOGIN_POLL_MAX_TRIES = (CLI_LOGIN_POLL_MAX_TIME * 60 * 1000) / CLI_LOGIN_POLL_INTERVAL;
export const API_BASE_URL = process.env.PUBLIC_ENPAGE_API_BASE_URL ?? "https://api.enpage.co/v1";
export const FRONTEND_BASE_URL = process.env.PUBLIC_ENPAGE_FRONTEND_BASE_URL ?? "https://enpage.co";
export const DEFAULT_UPLOAD_MAX_CONCURRENCY = 5;
