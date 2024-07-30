import type { CloudflareWorkersPlatformInfo } from "@hattip/adapter-cloudflare-workers";
import type { NodePlatformInfo } from "@hattip/adapter-node";
import type { RequestContext } from "@hattip/compose";
import type { EnpageEnv } from "~/shared/env";
import type { GenericPageContext } from "~/shared/page-context";
import type { DatasourceGenericResolved, DatasourceManifestMap } from "~/shared//datasources";
import { MAX_LIVE_DATASOURCES } from "./constants";
import type { GenericPageConfig } from "~/shared/page-config";
import type { ViteDevServer } from "vite";
import { createS3Client, type S3Client } from "./s3-client";
import type { R2Bucket } from "@cloudflare/workers-types";
import invariant from "tiny-invariant";

type PlatformInfo = CloudflareWorkersPlatformInfo | NodePlatformInfo;

interface RenderOptions {
  pageConfig: GenericPageConfig; // Replace 'any' with the actual type of pageConfig
  pageContext: GenericPageContext;
  s3Client?: S3Client | R2Bucket; // Replace 'any' with the actual type of s3Client
  vite?: ViteDevServer; // Replace 'any' with the actual type from Vite
}

async function fetchDatasources(datasources: DatasourceManifestMap, pageContext: GenericPageContext) {
  let count = 0;
  const fetchPromises = Object.entries(datasources).map(async ([key, datasource]) => {
    if (datasource.provider === "http-json" && count < MAX_LIVE_DATASOURCES) {
      count++;
      try {
        const res = await fetch(datasource.url);
        if (res.ok) {
          pageContext.data ??= {};
          // biome-ignore lint/suspicious/noExplicitAny: <explanation>
          pageContext.data[key] = (await res.json()) as DatasourceGenericResolved<any>;
        }
      } catch (error) {
        console.error(`Error fetching datasource ${key}:`, error);
      }
    }
  });

  await Promise.all(fetchPromises);

  if (count >= MAX_LIVE_DATASOURCES) {
    console.warn(`Exceeded maximum number of live datasources (${MAX_LIVE_DATASOURCES}).`);
  }
}

async function performRender(
  url: URL,
  renderOpts: RenderOptions,
  render: typeof import("~/node/builder/vite-entry-server").render,
) {
  const { html, state } = await render(url, renderOpts);
  return html.replace("// ENPAGE_STATE_PLACEHOLDER", `window.__ENPAGE_STATE__ = ${JSON.stringify(state)};`);
}

function getEnvironment(ctx: RequestContext<PlatformInfo>): EnpageEnv {
  return isCloudflare(ctx) ? (ctx.platform.env as EnpageEnv) : (process.env as unknown as EnpageEnv);
}

function isCloudflare(
  ctx: RequestContext<PlatformInfo>,
): ctx is RequestContext<CloudflareWorkersPlatformInfo> {
  return "name" in ctx.platform && ctx.platform.name === "cloudflare-workers";
}

export default async function renderHandler(ctx: RequestContext<PlatformInfo>) {
  if (!ctx.locals.pageConfig) {
    throw new Response("Page config not found.", { status: 500 });
  }

  const env = getEnvironment(ctx);
  const url = new URL(ctx.request.url);
  const isProduction = env.NODE_ENV === "production" || env.NODE_ENV === "preview";

  if (isProduction && !ctx.locals.pageConfig.ssrManifest) {
    throw new Response("SSR manifest not found.", { status: 500 });
  }

  const pageContext: GenericPageContext = {
    attributes: ctx.locals.pageConfig.attributes,
    data: ctx.locals.pageConfig.data ?? {},
  };

  await fetchDatasources(ctx.locals.pageConfig.datasources, pageContext);

  let render: typeof import("~/node/builder/vite-entry-server").render;
  if (isProduction) {
    render = (await import("~/node/builder/vite-entry-server")).render;
  } else {
    invariant(ctx.locals.vite, "Vite dev server not found.");
    render = (await ctx.locals.vite.ssrLoadModule("virtual:vite-entry-server")).render;
  }

  const renderOpts: RenderOptions = {
    pageConfig: ctx.locals.pageConfig,
    pageContext,
    s3Client: isProduction ? (isCloudflare(ctx) ? env.R2_SITES_BUCKET : createS3Client(env)) : undefined,
    vite: ctx.locals.vite,
  };

  const body = await performRender(url, renderOpts, render);

  return new Response(body, {
    headers: {
      "Content-Type": "text/html",
    },
  });
}
