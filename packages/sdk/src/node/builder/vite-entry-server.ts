import type { PageContext } from "~/shared/context";
import invariant from "tiny-invariant";
import type { R2Bucket } from "@cloudflare/workers-types";

interface S3Client {
  get: (key: string) => Promise<string>;
}

// biome-ignore lint/suspicious/noExplicitAny: <explanation>
export async function render(url: URL, pageContext: PageContext<any, any>, s3Client: R2Bucket) {
  // when rendering server-side, we expect the page context to contain the SSR manifest
  invariant(pageContext.ssrManifest, "SSR manifest not found in page context.");

  // fetch index.html from R2
  const indexObj = await s3Client.get(`sites/${url.hostname}/index.html`);
  invariant(indexObj, "Page html contents not found.");

  const html = await indexObj.text();

  // transform the html using vite
}
