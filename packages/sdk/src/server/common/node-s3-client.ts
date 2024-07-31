import { AwsClient } from "aws4fetch";
import path from "node:path";
import { readFile, stat } from "node:fs/promises";
import type { EnpageEnv } from "~/shared/env";

export interface S3Client {
  get: (key: string) => Promise<Response>;
}

export function createS3Client(env: EnpageEnv): S3Client {
  const aws = new AwsClient({ accessKeyId: env.R2_ACCESS_KEY_ID, secretAccessKey: env.R2_SECRET_ACCESS_KEY });
  const url = new URL(`https://${env.R2_SITES_BUCKET_NAME}.r2.cloudflarestorage.com`);
  return {
    get(key: string) {
      return aws.fetch(new URL(`/${key}`, url).href);
    },
  };
}

export function createLocalS3Client(env: EnpageEnv): S3Client {
  return {
    get(key: string) {
      const base = path.join(process.cwd(), ".enpage", "dist");
      const parts = key.split("/");
      if (parts.includes("..") || parts.includes("~")) {
        return Promise.resolve(new Response("Invalid key"));
      }
      const file = path.join(base, ...parts.slice(2));
      console.log("requested file", file);
      // create new response from file
      return stat(file)
        .then(() =>
          readFile(file).then((buffer) => {
            return new Response(buffer);
          }),
        )
        .catch(() => {
          return new Response("File not found", { status: 404 });
        });
    },
  };
}
