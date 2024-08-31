export const CLI_PROJECT_NAME = "enpage-cli";
export const CLI_LOGIN_POLL_INTERVAL = 5000; // seconds
export const CLI_LOGIN_CLIENT_ID =
  process.env.PUBLIC_ENPAGE_OAUTH_CLIENT_ID ?? "50000000-0000-0000-0000-000000000001";
export const API_BASE_URL = process.env.PUBLIC_ENPAGE_API_BASE_URL ?? "https://api.enpage.co";
export const FRONTEND_BASE_URL = process.env.PUBLIC_ENPAGE_FRONTEND_BASE_URL ?? "https://enpage.co";
export const DEFAULT_UPLOAD_MAX_CONCURRENCY = 10;

export const OAUTH_ENDPOINT_DEVICE_CODE = "oauth/devicecode";
export const OAUTH_ENDPOINT_TOKEN = "oauth/token";
export const OAUTH_ENDPOINT_USER_INFO = "oauth/userinfo";

export const API_ENDPOINT_REGISTER_TEMPLATE = "v1/templates";
