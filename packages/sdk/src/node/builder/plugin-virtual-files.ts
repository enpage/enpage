import type { EnpageTemplateConfig } from "~/shared/template-config";
import type { GenericPageConfig } from "~/shared/page-config";
import type { ConfigEnv, Plugin } from "vite";
import { resolve } from "node:path";
import { readFileSync } from "node:fs";
import type { GenericPageContext } from "~/shared/page-context";
import type { EnpageEnv } from "~/shared/env";

const virtualIndexId = "virtual:enpage-template:index.html";
const resolvedVirtualIndexId = `\0${virtualIndexId}`;

const virtualViteEntryServerId = "virtual:vite-entry-server";
const resolvedVirtualViteEntryServerId = `\0${virtualViteEntryServerId}`;

const virtualEnpagePageConfig = "virtual:enpage-page-config.json";
const resolvedVirtualEnpagePageConfig = `\0${virtualEnpagePageConfig}`;

const virtualFilesMap = new Map([
  [virtualIndexId, resolvedVirtualIndexId],
  [virtualViteEntryServerId, resolvedVirtualViteEntryServerId],
  [virtualEnpagePageConfig, resolvedVirtualEnpagePageConfig],
]);

/**
 * @todo migrate to https://github.com/patak-dev/vite-plugin-virtual
 */
export const virtualFilesPlugin = (
  templateConfig: EnpageTemplateConfig,
  _viteEnv: ConfigEnv,
  env: EnpageEnv,
): Plugin => {
  let pageContext: GenericPageContext | undefined = undefined;

  return {
    name: "enpage:virtual-files",
    configResolved(config) {
      // @ts-ignore
      pageContext = config.enpageContext;
    },
    resolveId(id) {
      if (virtualFilesMap.has(id)) {
        return virtualFilesMap.get(id);
      }
    },
    load(id) {
      switch (id) {
        case resolvedVirtualIndexId: {
          const htmlPath = resolve(process.cwd(), "index.html");
          const htmlContent = readFileSync(htmlPath, "utf-8");
          // return htmlContent;
          // return { code: htmlContent };
          return `export const html = ${JSON.stringify(htmlContent)};`;
        }
        case resolvedVirtualViteEntryServerId: {
          return `export { render } from "@enpage/sdk/builder/vite-entry-server";`;
        }
        case resolvedVirtualEnpagePageConfig: {
          return JSON.stringify({
            attributes: templateConfig.attributes,
            datasources: templateConfig.datasources,
            data: pageContext?.data,
            attr: pageContext!.attr,
            templateManifest: templateConfig.manifest,
            // todo: add ssrManifest
            ssrManifest: {},
          } satisfies GenericPageConfig);
        }
      }
    },
  };
};
