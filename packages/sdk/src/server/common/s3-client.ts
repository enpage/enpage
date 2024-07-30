import { AwsClient } from "aws4fetch";
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
