import {
  type Attributes,
  resolveAttributes,
  type AttributesResolved,
  defaultAttributesSchema,
} from "./attributes";
import { brickSchema, type Brick } from "./bricks";
import invariant from "./utils/invariant";
import { themeSchema, type Theme } from "./theme";
import { Type, type Static } from "@sinclair/typebox";
import { datasourcesMap, type DatasourcesMap, type DatasourcesResolved } from "./datasources/types";
import { manifestSchema, type TemplateManifest } from "./manifest";
import type { JSONSchemaType } from "ajv";
import { customAlphabet } from "nanoid";

const nanoid = customAlphabet("1234567890abcdefghijklmnopqrstuvwxyz", 7);

export function defineConfig(config: TemplateConfig): TemplateConfig {
  return {
    attributes: config.attributes,
    manifest: config.manifest,
    pages: config.pages.map((p) => ({
      ...p,
      tags: p.tags ?? [],
    })),
    themes: config.themes,
    ...(config.datasources ? { datasources: config.datasources } : {}),
  };
}

export type TemplateConfig = {
  /**
   * The template manifest and settings
   */
  manifest: TemplateManifest;
  /**
   * The attributes declared for the template
   */
  attributes: JSONSchemaType<Attributes>;
  /**
   * The datasources declared for the template
   */
  datasources?: DatasourcesMap;
  /**
   * The Pages
   */
  pages: TemplatePage[];
  /**
   * The themes declared by the site.
   */
  themes: Theme[];
};

export type PagesMapEntry = {
  id: string;
  label: string;
  path: string;
  tags: string[];
};

export type PageInfo = {
  /**
   * The page id.
   */
  id: string;
  /**
   * Pathname to the page
   */
  path: string;
  /**
   * Label of the page
   */
  label: string;
};

export type SiteInfo = {
  siteId: string;
  /**
   * Map of all pages in the site.
   */
  pagesMap: PagesMapEntry[];
  /**
   * Hostname of the site
   */
  hostname: string;
  /**
   * Label of the site
   */
  siteLabel: string;

  siteAttributes: JSONSchemaType<Attributes>;
};

/**
 * The Page config represents the page configuration (datasources, attributes, etc)
 */
export type PageConfig<
  D extends DatasourcesMap,
  A extends TemplateConfig["attributes"],
  B extends Brick[],
> = PageInfo & {
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
   * Site+Page attributes.
   */
  attributes: A;
  /**
   * Resolved attributes for the page.
   */
  attr: AttributesResolved;
  bricks: B;

  tags: string[];

  // theme: Theme;
};

export type GenericPageConfig = PageConfig<DatasourcesMap, TemplateConfig["attributes"], Brick[]>;
export type GenericPageContext = Omit<GenericPageConfig, "attributes" | "siteAttributes">;

export function getNewPageConfig(templateConfig: TemplateConfig, path = "/"): GenericPageConfig {
  const pageConfig = templateConfig.pages.find((p) => p.path === path);
  invariant(pageConfig, `createPageConfigFromTemplateConfig: No page config found for path ${path}`);

  const bricks = pageConfig.bricks;
  const attr = resolveAttributes(templateConfig.attributes);

  return {
    id: crypto.randomUUID(),
    label: pageConfig.label,
    tags: pageConfig.tags,
    path,
    attr,
    bricks,
    attributes: templateConfig.attributes,
  } satisfies GenericPageConfig;
}

export type SiteConfig = {
  id: string;
  label: string;
  hostname: string;
  attributes: JSONSchemaType<Attributes>;
  datasources?: DatasourcesMap;
  themes: Theme[];
  theme: Theme;
  pagesMap: PagesMapEntry[];
};

/**
 * Creates the necessary config for a new site based on the given template.
 * Returns an object with property "site" and "pages", which should be used to create the site and pages in db.
 * A temporary hostname is generated for the site.
 */
export function getNewSiteConfig(
  templateConfig: TemplateConfig,
  options: { label: string } = { label: "New site" },
) {
  const id = crypto.randomUUID();
  const hostname = `${nanoid()}.upstart.gg`;
  const pages = templateConfig.pages.map((p) => getNewPageConfig(templateConfig, p.path));

  const site = {
    id,
    label: options.label,
    hostname,
    attributes: templateConfig.attributes,
    datasources: templateConfig.datasources,
    themes: templateConfig.themes,
    theme: templateConfig.themes[0],
    pagesMap: pages.map((p) => ({
      id: crypto.randomUUID(),
      label: p.label,
      path: p.path,
      tags: p.tags,
    })),
  } satisfies SiteConfig;

  return { site, pages };
}

export type SiteAndPagesConfig = ReturnType<typeof getNewSiteConfig>;

export const templatePageSchema = Type.Object({
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

export type DefinedTemplatePage = Static<typeof definedTemplatePage>;

export const templateSchema = Type.Object(
  {
    manifest: manifestSchema,
    themes: Type.Array(themeSchema),
    datasources: Type.Optional(datasourcesMap),
    attributes: Type.Optional(defaultAttributesSchema),
    pages: Type.Array(definedTemplatePage),
  },
  {
    title: "Template schema",
    description: "The template configuration schema",
  },
);

export type Template = Static<typeof templateSchema>;
