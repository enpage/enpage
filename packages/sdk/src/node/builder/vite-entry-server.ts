import type { GenericPageContext } from "~/shared/page-context";
import type { GenericPageConfig } from "~/shared/page-config";
import invariant from "tiny-invariant";
import type { R2Bucket } from "@cloudflare/workers-types";

interface S3Client {
  get: (key: string) => Promise<Response>;
}

export async function render(
  url: URL,
  pageConfig: GenericPageConfig,
  pageContext: GenericPageContext,
  s3Client: S3Client | R2Bucket,
) {
  // when rendering server-side, we expect the page context to contain the SSR manifest
  invariant(pageConfig.ssrManifest, "SSR manifest not found in page context.");

  // fetch index.html from R2
  const indexObj = await s3Client.get(`sites/${url.hostname}/index.html`);
  invariant(indexObj, "Page html contents not found.");

  const html = await indexObj.text();

  // todo: adjust the state to match the current page
  const state: Window["__ENPAGE_STATE__"] = [pageContext, 0, 1, []];

  return {
    html,
    state,
  };
}
