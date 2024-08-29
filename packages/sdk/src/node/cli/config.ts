import type { EnpageCliCAccessConfigFile } from "./types";
import { CLI_PROJECT_NAME, OAUTH_ENDPOINT_USER_INFO } from "./constants";
import Conf from "conf";
import { get } from "./api";

const accessConfig = new Conf<EnpageCliCAccessConfigFile>({ projectName: CLI_PROJECT_NAME });

export async function isLoggedIn(checkRemote = false): Promise<boolean> {
  const token = accessConfig.get("token");
  const expiration = accessConfig.get("expires_in");

  if (!token || (expiration && expiration < Date.now() / 1000)) {
    return false;
  }

  if (!checkRemote) {
    return true;
  }

  // Check if token is valid
  const { isSuccess } = await get(OAUTH_ENDPOINT_USER_INFO);
  return isSuccess;
}

export { accessConfig };
