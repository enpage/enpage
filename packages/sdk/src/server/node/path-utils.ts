import { join } from "node:path";
import { existsSync } from "node:fs";

export function getBuildDirectories() {
  const rootDist = join(process.cwd(), "dist");
  const clientDist = join(rootDist, "client");
  const dist = existsSync(clientDist) ? clientDist : rootDist;
  const assets = join(dist, "assets");
  return { dist, assets };
}
