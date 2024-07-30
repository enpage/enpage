import cfwAdapterStatic, { type CloudflareWorkersPlatformInfo } from "@hattip/adapter-cloudflare-workers";
import cfwAdapter from "@hattip/adapter-cloudflare-workers/no-static";
import renderHandler from "../common/render-handler";
import pageConfigHdl from "./page-config-handler";
import { compose, type RequestHandler } from "@hattip/compose";

/**
 * Create a fetch handler for Cloudflare Workers.
 *
 * @example
 * ```typescript
 * import createFetchHandler from "@enpage/server/cloudflare";
 * import pageInfoHandler from "./page-info-handler"; // Your page info handler
 *
 * export default {
 *  fetch: createFetchHandler(pageInfoHandler)
 * };
 * ```
 *
 * @param pageConfigHandler Handler in charge of fetching page info & data.
 * @param renderHandler Handler in charge of rendering pages. Defaults to enpageHandler.
 * @param useStatic Whether to use static adapter or not. Defaults to false.
 *
 * @see https://github.com/hattipjs/hattip/tree/main/packages/adapter/adapter-cloudflare-workers
 */
export default function createFetchHandler(
  useStatic = false,
  pageConfigHandler: RequestHandler<CloudflareWorkersPlatformInfo> = pageConfigHdl,
  renderingHandler: RequestHandler<CloudflareWorkersPlatformInfo> = renderHandler,
) {
  const handler = compose(pageConfigHandler, renderingHandler);
  return useStatic ? cfwAdapterStatic(handler) : cfwAdapter(handler);
}
