import type { EnpageTemplateConfig } from "~/shared/template-config";
import type { GenericPageConfig, PageContext } from "~/shared/page-config";
import type { ConfigEnv, Plugin } from "vite";
import type { GenericPageContext } from "~/shared/page-config";
import type { EnpageEnv } from "~/shared/env";
import virtual from "vite-plugin-virtual";
import { createFakeContext, fetchContext, getPageContext } from "./page-context";
import invariant from "~/shared/utils/invariant";

const virtualViteEntryServerId = "virtual:vite-entry-server";
const resolvedVirtualViteEntryServerId = `\0${virtualViteEntryServerId}`;

const virtualEnpagePageConfig = "virtual:enpage-page-config.json";
const resolvedVirtualEnpagePageConfig = `\0${virtualEnpagePageConfig}`;

const virtualFilesMap = new Map([
  [virtualViteEntryServerId, resolvedVirtualViteEntryServerId],
  [virtualEnpagePageConfig, resolvedVirtualEnpagePageConfig],
]);

export async function pluginVirtual(
  templateConfig: EnpageTemplateConfig,
  viteEnv: ConfigEnv,
  env: EnpageEnv,
) {
  const context = await getPageContext(templateConfig, viteEnv, env);
  if (!context) {
    return virtual();
  }

  return virtual({
    "virtual:vite-entry-server": `export { render } from "@enpage/sdk/builder/vite-entry-server";`,
    "virtual:enpage-page-config.json": JSON.stringify({
      attributes: templateConfig.attributes,
      datasources: templateConfig.datasources,
      data: context?.data,
      attr: context?.attr ?? {},
      templateManifest: templateConfig.manifest,
      bricks: context?.bricks ?? [],
      ssrManifest: {},
    } satisfies GenericPageConfig),
  });
}

/**
 * @todo migrate to https://github.com/patak-dev/vite-plugin-virtual
 * @deprecated
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
            bricks: templateConfig.bricks,
            // todo: add ssrManifest
            ssrManifest: {},
          } satisfies GenericPageConfig);
        }
      }
    },
  };
};
