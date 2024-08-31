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
  for (const key in process.env) {
    // @ts-ignore
    vi.stubEnv(key, process.env[key]);
  }
});
