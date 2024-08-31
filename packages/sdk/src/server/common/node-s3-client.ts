import { AwsClient } from "aws4fetch";
import path from "node:path";
import { readFile, stat } from "node:fs/promises";
import type { EnpageEnv } from "~/shared/env";
import { getBuildDirectories } from "../node/path-utils";

export interface S3Client {
  get: (key: string) => Promise<Response>;
}

export function createS3Client(env: EnpageEnv): S3Client {
  const aws = new AwsClient({
    accessKeyId: env.R2_ACCESS_KEY_ID,
    secretAccessKey: env.R2_SECRET_ACCESS_KEY,
    region: "auto",
  });
  const url = new URL(`https://${env.R2_SITES_BUCKET_NAME}.r2.cloudflarestorage.com`);
  return {
    get(key: string) {
      return aws.fetch(new URL(`/${key}`, url).href);
    },
  };
}

export function createLocalS3Client(env: EnpageEnv): S3Client {
  const { dist } = getBuildDirectories();
  return {
    get(key: string) {
      const parts = key.split("/");
      if (parts.includes("..") || parts.includes("~")) {
        return Promise.resolve(new Response("Invalid key"));
      }
      const file = path.join(dist, ...parts.slice(2));
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
