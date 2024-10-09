import type { GenericPageConfig, GenericPageContext } from "~/shared/page-config";
import invariant from "~/shared/utils/invariant";
import type { R2Bucket } from "@cloudflare/workers-types";
import type { ViteDevServer } from "vite";
import type { S3Client } from "~/server/common/node-s3-client";
import { promises as fs } from "node:fs";
import { join } from "node:path";

export type RenderOptions = {
  pageConfig: GenericPageConfig;
  s3Client?: S3Client | R2Bucket;
  vite?: ViteDevServer;
};

export async function render(url: URL, options: RenderOptions) {
  const { pageConfig, s3Client, vite } = options;
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
      const indexContents = await fs.readFile(join(process.cwd(), "index.html"), "utf-8");
      // html = mod.html;
      html = await vite.transformIndexHtml(url.pathname, indexContents);
    } catch (e) {
      vite.ssrFixStacktrace(e as Error);
      throw e;
    }
  }

  // todo: adjust the state to match the current page
  const { attr, data, bricks } = pageConfig;
  const state: Window["__ENPAGE_STATE__"] = {
    ctx: { attr, data, bricks },
    pageIndex: 0,
  };

  return {
    html,
    state,
  };
}
