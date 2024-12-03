import { OAUTH_ENDPOINT_USER_INFO } from "./constants";
import { accessStore } from "./store";

export async function isLoggedIn(checkRemote = false): Promise<boolean> {
  const token = accessStore.get("access_token");
  const expiration = accessStore.get("expires_at");

  if (!token) {
    return false;
  }

  if (expiration && expiration < Date.now()) {
    console.log("Seems like your token expired...");
    return false;
  }

  if (!checkRemote) {
    return true;
  }

  // Check if token is valid

  // import dynamically "./api" to avoid circular dependency
  const { get } = await import("./api");
  const { isSuccess } = await get(OAUTH_ENDPOINT_USER_INFO);

  return isSuccess;
}
