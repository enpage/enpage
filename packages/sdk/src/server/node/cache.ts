import { createStorage } from "unstorage";
import memoryDriver from "unstorage/drivers/memory";
import fsLiteDriver from "unstorage/drivers/fs-lite";

export const memoryCache = createStorage({
  driver: memoryDriver(),
});

export const fsCache = createStorage({
  driver: fsLiteDriver({ base: "/tmp" }),
});
