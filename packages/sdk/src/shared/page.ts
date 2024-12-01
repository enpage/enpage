import type { DatasourcesMap, DatasourcesResolved } from "./datasources";
import { defineAttributes, resolveAttributes, type AttributesResolved } from "./attributes";
import { brickSchema, type Brick } from "./bricks";
import type { TemplateConfig, ResolvedTemplateConfig } from "./template";
import invariant from "./utils/invariant";
import type { Theme } from "./theme";
import { Type, type Static } from "@sinclair/typebox";

export type PagesMapEntry = {
  id: string;
  label: string;
  path: string;
  tags: string[];
};

/**
 * The Page config represents the page configuration (datasources, attributes, etc)
 */
export type PageConfig<
  D extends DatasourcesMap,
  A extends ResolvedTemplateConfig["attributes"],
  B extends Brick[],
> = {
  /**
   * The page id.
   */
  id: string;
  siteId: string;
  /**
   * Pathname to the page
   */
  path: string;
  /**
   * Label of the page
   */
  label: string;
  /**
   * Hostname of the site
   */
  hostname: string;

  /**
   * Map of all pages in the site.
   */
  pagesMap: PagesMapEntry[];
  /**
   * Data sources manifests for the page. Undefined if no data sources are defined.
   */
  datasources?: D;
  /**
   * Resolved static data sources for the page.
   * Undefined if no data sources are defined.
   */
  data?: D extends DatasourcesMap ? DatasourcesResolved<D> : undefined;

  /**
   * Page attributes.
   */
  attributes: A;
  /**
   * Resolved attributes for the page.
   */
  attr: AttributesResolved;
  bricks: B;

  theme: Theme;
};

export type GenericPageConfig = PageConfig<DatasourcesMap, ResolvedTemplateConfig["attributes"], Brick[]>;

export type GenericPageContext = Omit<GenericPageConfig, "attributes">;

export function getPageConfig(
  templateConfig: TemplateConfig,
  options: Pick<GenericPageConfig, "id" | "siteId" | "label" | "hostname">,
  path = "/",
): GenericPageConfig {
  const bricks = templateConfig.pages.find((p) => p.path === path)?.bricks;
  invariant(bricks, `createPageConfigFromTemplateConfig: No bricks found for path ${path}`);

  if (!templateConfig.attributes) {
    templateConfig.attributes = defineAttributes({});
  }

  return {
    ...options,
    pagesMap: templateConfig.pages.map((p) => ({
      id: crypto.randomUUID(),
      label: p.label,
      path: p.path,
      tags: p.tags,
    })),
    path,
    datasources: templateConfig.datasources,
    attributes: templateConfig.attributes,
    attr: resolveAttributes(templateConfig.attributes),
    bricks,
    theme: templateConfig.themes[0],
  } satisfies GenericPageConfig;
}

/**
 * Creates the necessary config for a new site based on the given template.
 * Returns an object with property "site" and "pages", which should be used to create the site and pages in db.
 * A temporary hostname is generated for the site, corresponding to the site id.
 */
export function getNewSiteConfig(
  templateConfig: TemplateConfig,
  options: Pick<GenericPageConfig, "label"> = { label: "New site" },
) {
  const siteId = crypto.randomUUID();
  const hostname = `${siteId}.upstart.gg`;

  const site = {
    id: siteId,
    label: options.label,
    hostname,
  };

  const pages = templateConfig.pages.map((p) =>
    getPageConfig(
      templateConfig,
      { siteId: site.id, id: crypto.randomUUID(), label: p.label, hostname },
      p.path,
    ),
  );

  return { site, pages };
}

const templatePageSchema = Type.Object({
  label: Type.String(),
  path: Type.String(),
  bricks: Type.Array(brickSchema),
  tags: Type.Array(Type.String()),
});

export type TemplatePage = Static<typeof templatePageSchema>;

export const definedTemplatePage = Type.Composite([
  Type.Omit(templatePageSchema, ["tags"]),
  Type.Object({
    tags: Type.Optional(Type.Array(Type.String())),
  }),
]);

type DefinedTemplatePage = Static<typeof definedTemplatePage>;

export function definePages(pages: DefinedTemplatePage[]): TemplatePage[] {
  return pages.map((p) => ({
    ...p,
    tags: p.tags ?? [],
  }));
}
