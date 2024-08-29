import type { EnpageCliCAccessConfigFile } from "./types";
import { CLI_PROJECT_NAME } from "./constants";
import Conf from "conf";

const accessConfig = new Conf<EnpageCliCAccessConfigFile>({ projectName: CLI_PROJECT_NAME });

export async function isLoggedIn(checkRemote = false): Promise<boolean> {
  const token = accessConfig.get("token");
  if (!token) {
    return false;
  }

  if (!checkRemote) {
    return true;
  }

  // Check if token is valid
  return true;
}

export { accessConfig };
