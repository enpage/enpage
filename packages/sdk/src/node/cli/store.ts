import type { CredentialsStore } from "./types";
import { CLI_PROJECT_NAME, OAUTH_ENDPOINT_USER_INFO } from "./constants";
import Conf from "conf";
import { get } from "./api";
import path from "node:path";
import crypto from "node:crypto";
import fs from "node:fs";
import { fileURLToPath } from "node:url";
import { getPackageManager } from "./utils";
import chalk from "chalk";

const __dirname = fileURLToPath(new URL(".", import.meta.url));
const key = getKey();
const accessStore = new Conf<CredentialsStore>({
  projectName: CLI_PROJECT_NAME,
  encryptionKey: key,
  clearInvalidConfig: true,
});

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
  const { isSuccess } = await get(OAUTH_ENDPOINT_USER_INFO);

  return isSuccess;
}

/**
 * Get access token or throw error if not found
 */
export function getTokenOrThrow() {
  const token = accessStore.get("access_token");
  if (!token) {
    const pkgCmd = getPackageManager();
    throw new Error(
      `Access token not found. Please run ${chalk.cyan(`${pkgCmd} run enpage:login`)} to authenticate.`,
    );
  }
  return token;
}

function findNearestNodeModules(): string | null {
  let currentDir = __dirname;
  while (currentDir !== path.parse(currentDir).root) {
    const nodeModulesPath = path.join(currentDir, "node_modules");
    if (fs.existsSync(nodeModulesPath)) {
      return nodeModulesPath;
    }
    currentDir = path.dirname(currentDir);
  }
  return null;
}

function getKey() {
  const nodeModulesPath = findNearestNodeModules();
  if (!nodeModulesPath) {
    console.log("Could not find nearest node_modules directory.");
    throw new Error("Could not find nearest node_modules directory.");
  }
  const tmpSecureStoreDir = path.join(nodeModulesPath, ".enpage-tmp");
  if (!fs.existsSync(tmpSecureStoreDir)) {
    console.log("Creating secure store directory...");
    fs.mkdirSync(tmpSecureStoreDir, { recursive: true, mode: 0o700 });
  }
  const keyPath = path.join(tmpSecureStoreDir, ".enpage-key");
  if (!fs.existsSync(keyPath)) {
    console.log("Generating secure store key...");
    const key = crypto.randomBytes(32).toString("hex");
    console.log("Writing secure store key to %s (%s)", keyPath, key);
    fs.writeFileSync(keyPath, key, { mode: 0o600, flush: true });
    return key;
  }
  const key = fs.readFileSync(keyPath, "utf8");
  console.log("Using secure store key from path %s", keyPath);
  console.log("Key: %s", key);
  return key;
}

export { accessStore };
