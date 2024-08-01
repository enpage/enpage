import chalk from "chalk";
import os from "node:os";
import type { Logger } from "vite";

export function displayServerUrls(port: number | string, logger: Logger): void {
  const localUrl = `http://localhost:${port}`;
  const networkUrls = getNetworkUrls(port);
  logger.info(`  ▸ Local:    ${chalk.cyan(localUrl)}`);
  for (const url of networkUrls) {
    logger.info(`  ▸ Network:  ${chalk.gray(url)}`);
  }
  logger.info("");
}

export function getNetworkUrls(port: number | string): string[] {
  const interfaces = os.networkInterfaces();
  const urls: string[] = [];

  for (const interfaceName in interfaces) {
    const networkInterfaces = interfaces[interfaceName];
    if (!networkInterfaces) continue;
    for (let i = 0; i < networkInterfaces.length; i++) {
      const networkInterface = networkInterfaces[i];
      // Skip over non-IPv4 and internal (i.e. 127.0.0.1) addresses
      if (networkInterface.family === "IPv4" && !networkInterface.internal) {
        urls.push(`http://${networkInterface.address}:${port} (${interfaceName})`);
      }
    }
  }

  return urls;
}
