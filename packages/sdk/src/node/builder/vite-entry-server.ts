import type { GenericPageContext } from "~/shared/page-context";
import type { GenericPageConfig } from "~/shared/page-config";
import invariant from "~/shared/utils/invariant";
import type { R2Bucket } from "@cloudflare/workers-types";
import type { ViteDevServer } from "vite";
import type { S3Client } from "~/server/common/node-s3-client";

export type RenderOptions = {
  pageConfig: GenericPageConfig;
  pageContext: GenericPageContext;
  s3Client?: S3Client | R2Bucket;
  vite?: ViteDevServer;
};

export async function render(url: URL, options: RenderOptions) {
  // when rendering server-side, we expect the page context to contain the SSR manifest
  // invariant(options.pageConfig.ssrManifest, "SSR manifest not found in page config.");

  const { pageConfig, pageContext, s3Client, vite } = options;
  const isProduction = process.env.NODE_ENV === "production" || process.env.NODE_ENV === "local-preview";
  let html = "";

  // fetch index.html from R2
  if (isProduction) {
    invariant(s3Client, "S3 client not found.");
    const indexObj = await s3Client.get(`sites/${url.hostname}/index.html`);
    invariant(indexObj, "Page not found in storage.");
    html = await indexObj.text();

    // Use the local index.html in dev mode
  } else {
    invariant(vite, "Vite dev server not found.");
    try {
      const mod = await vite.ssrLoadModule("virtual:enpage-template:index.html");
      html = mod.html;
      html = await vite.transformIndexHtml(url.pathname, html);
    } catch (e) {
      vite.ssrFixStacktrace(e as Error);
      throw e;
    }
  }

  // todo: adjust the state to match the current page
  const state: Window["__ENPAGE_STATE__"] = [pageContext, 0, 1, []];

  return {
    html,
    state,
  };
}
