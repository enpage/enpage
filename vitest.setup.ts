import dotenv from "dotenv";
import { beforeAll, vi } from "vitest";

dotenv.config({
  path: ".env",
});

dotenv.config({
  path: ".env.local",
});

dotenv.config({
  path: ".env.test",
  override: true,
});

beforeAll(() => {
  if (process?.env) {
    for (const key in process.env) {
      if (typeof process.env[key] === "string") {
        vi.stubEnv(key, process.env[key]);
      }
    }
  }
});
