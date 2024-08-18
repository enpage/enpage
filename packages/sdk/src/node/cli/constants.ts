export const CLI_PROJECT_NAME = "enpage-cli";
export const CONF_USER_TOKEN_KEY = "token";
export const CLI_LOGIN_POLL_INTERVAL = 3000; // seconds
export const CLI_LOGIN_POLL_MAX_TIME = 3; // minutes
export const CLI_LOGIN_POLL_MAX_TRIES = (CLI_LOGIN_POLL_MAX_TIME * 60 * 1000) / CLI_LOGIN_POLL_INTERVAL;
export const API_BASE_URL = process.env.PUBLIC_ENPAGE_API_BASE_URL ?? "https://api.enpage.co/v1";
export const DEFAULT_UPLOAD_MAX_CONCURRENCY = 5;
