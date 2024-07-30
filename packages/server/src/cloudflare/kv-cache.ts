import { createStorage } from "unstorage";
import cloudflareKVBindingDriver from "unstorage/drivers/cloudflare-kv-binding";

export const kv = createStorage({
  driver: cloudflareKVBindingDriver({ binding: "SITES_CACHE" }),
});
