import cfwAdapterStatic, { type CloudflareWorkersPlatformInfo } from "@hattip/adapter-cloudflare-workers";
import cfwAdapter from "@hattip/adapter-cloudflare-workers/no-static";
import enpageHandler from "../shared/render-handler";
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
 * @param pageInfoHandler Handler in charge of fetching page info & data.
 * @param renderHandler Handler in charge of rendering pages. Defaults to enpageHandler.
 * @param useStatic Whether to use static adapter or not. Defaults to false.
 *
 * @see https://github.com/hattipjs/hattip/tree/main/packages/adapter/adapter-cloudflare-workers
 */
export default function createFetchHandler(
  pageInfoHandler: RequestHandler<CloudflareWorkersPlatformInfo>,
  renderHandler: RequestHandler<CloudflareWorkersPlatformInfo> = enpageHandler,
  useStatic = false,
) {
  const handler = compose(pageInfoHandler, renderHandler);
  return useStatic ? cfwAdapterStatic(handler) : cfwAdapter(handler);
}
