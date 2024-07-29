import type { AdapterRequestContext } from "@hattip/core";

const handler = <P>(context: AdapterRequestContext<P>) => {
  const { pathname } = new URL(context.request.url);

  // 1. Check cache

  // 2. Get site info from environment variables

  // 3. Fetch data from API if needed

  // 4. Render page

  // 5. Cache response

  // 6. Return response

  if (pathname === "/") {
    return new Response("Hello from Hattip.");
  }
  if (pathname === "/about") {
    return new Response("This HTTP handler works in Node.js, Cloudflare Workers, and Fastly.");
  }
  return new Response("Not found.", { status: 404 });
};

export default handler;
