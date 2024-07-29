// <reference types="@cloudflare/workers-types" />
import type { CloudflareWorkersPlatformInfo } from "@hattip/adapter-cloudflare-workers";
import type { RequestContext } from "@hattip/compose";

export default function renderHandler(ctx: RequestContext<CloudflareWorkersPlatformInfo>) {
  // At this point we should have access to ctx.locals.pageContext
  // If not, this is an internal error
  if (!ctx.locals.pageContext) {
    throw new Response("Page context not found.", { status: 500 });
  }

  const { pathname } = new URL(ctx.request.url);

  // we need to use vite to render the page

  // 1. Retrieve index.html and ssr-manifest.json
  // 2. Import renderer from ./dist/server/entry-server.js

  if (pathname === "/") {
    return new Response("Hello from Hattip.");
  }
  if (pathname === "/about") {
    return new Response("This HTTP handler works in Node.js, Cloudflare Workers, and Fastly.");
  }
  return new Response("Not found.", { status: 404 });
}
