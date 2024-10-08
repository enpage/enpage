import type { CloudflareWorkersPlatformInfo } from "@hattip/adapter-cloudflare-workers";
import type { NodePlatformInfo } from "@hattip/adapter-node";
import type { RequestContext } from "@hattip/compose";
import type { GenericPageConfig, GenericPageContext } from "~/shared/page-config";
import type { ViteDevServer } from "vite";
import { createS3Client, createLocalS3Client, type S3Client } from "./node-s3-client";
import type { R2Bucket } from "@cloudflare/workers-types";
import invariant from "~/shared/utils/invariant";
import { fetchDatasources } from "./fetch-datasources";
import { isCloudflare } from "./is-cloudflare";
import { getEnvironment } from "./getenv";
import type { EnpageEnv } from "~/shared/env";

export type PlatformInfo = CloudflareWorkersPlatformInfo | NodePlatformInfo;

interface RenderOptions {
  pageConfig: GenericPageConfig; // Replace 'any' with the actual type of pageConfig
  // pageContext: GenericPageContext;
  s3Client?: S3Client | R2Bucket; // Replace 'any' with the actual type of s3Client
  vite?: ViteDevServer; // Replace 'any' with the actual type from Vite
}

export default async function renderHandler(ctx: RequestContext<PlatformInfo>) {
  if (!ctx.locals.pageConfig) {
    throw new Response("Page config not found.", { status: 500 });
  }

  const { pageConfig } = ctx.locals;
  const env = getEnvironment(ctx);
  const url = new URL(ctx.request.url);
  const isProduction =
    env.NODE_ENV === "production" || env.NODE_ENV === "preview" || env.NODE_ENV === "local-preview";

  let render: typeof import("~/node/builder/vite-entry-server").render;
  if (isProduction) {
    render = (await import("~/node/builder/vite-entry-server")).render;
  } else {
    invariant(ctx.locals.vite, "Vite dev server not found.");
    render = (await ctx.locals.vite.ssrLoadModule("virtual:vite-entry-server")).render;
  }

  const renderOpts: RenderOptions = {
    pageConfig,
    s3Client: getS3Client(ctx, env),
    vite: ctx.locals.vite,
  };

  const body = await renderHtml(url, renderOpts, render);

  const policies = [
    "default-src 'self'",
    "frame-ancestors 'self' http://localhost:* https://enpage.co",
    "img-src 'self' data: https://cdn.enpage.co",
    "font-src 'self' https://*",
    "connect-src 'self' https://* ws://localhost:*",
    "frame-src 'self' https://*",
    "child-src 'self' https://*",
    "script-src 'self' 'unsafe-eval' 'unsafe-inline' https://cdn.enpage.co",
    "style-src 'self' 'unsafe-inline' https://cdn.enpage.co",
  ];

  return new Response(body, {
    headers: {
      "Content-Type": "text/html",
      "Content-Security-Policy": policies.join("; "),
    },
  });
}

function getS3Client(ctx: RequestContext<PlatformInfo>, env: EnpageEnv) {
  return env.NODE_ENV === "local-preview"
    ? createLocalS3Client(env)
    : env.NODE_ENV === "production" || env.NODE_ENV === "preview"
      ? isCloudflare(ctx)
        ? env.R2_SITES_BUCKET
        : createS3Client(env)
      : undefined;
}

async function renderHtml(
  url: URL,
  renderOpts: RenderOptions,
  render: typeof import("~/node/builder/vite-entry-server").render,
) {
  const { html, state } = await render(url, renderOpts);
  return html.replace(
    "/* ENPAGE_STATE_PLACEHOLDER_DONT_REMOVE */",
    `window.__ENPAGE_STATE__ = ${JSON.stringify(state)};`,
  );
}
