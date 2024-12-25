import {
  type Attributes,
  defineAttributes,
  resolveAttributes,
  type AttributesResolved,
  defaultAttributesSchema,
  attr,
} from "./attributes";
import { brickSchema, type Brick } from "./bricks";
import invariant from "./utils/invariant";
import { themeSchema, type Theme } from "./theme";
import { type TProperties, Type, type Static, TSchema, type TObject } from "@sinclair/typebox";
import { datasourcesMap, type DatasourcesMap, type DatasourcesResolved } from "./datasources/types";
import { manifestSchema, type TemplateManifest } from "./manifest";
import type { JSONSchemaType } from "ajv";

export function defineConfig(config: TemplateConfig): ResolvedTemplateConfig {
  return {
    attributes: config.attributes ?? {},
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

export type ResolvedTemplateConfig = TemplateConfig & Required<Pick<TemplateConfig, "attributes">>;

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

export type SiteConfig = {
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
  A extends ResolvedTemplateConfig["attributes"],
  B extends Brick[],
> = PageInfo &
  SiteConfig & {
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

    theme: Theme;
  };

export type GenericPageConfig = PageConfig<DatasourcesMap, ResolvedTemplateConfig["attributes"], Brick[]>;
export type GenericPageContext = Omit<GenericPageConfig, "attributes" | "siteAttributes">;

export function getNewPageConfig(
  templateConfig: TemplateConfig,
  options: Pick<GenericPageConfig, "id" | "label"> & { siteId: string; siteLabel: string; hostname: string },
  path = "/",
): GenericPageConfig {
  const bricks = templateConfig.pages.find((p) => p.path === path)?.bricks;
  invariant(bricks, `createPageConfigFromTemplateConfig: No bricks found for path ${path}`);

  return {
    ...options,
    siteId: options.siteId,
    label: options.siteLabel,
    hostname: options.hostname,

    pagesMap: templateConfig.pages.map((p) => ({
      id: crypto.randomUUID(),
      label: p.label,
      path: p.path,
      tags: p.tags,
    })),

    path,
    datasources: templateConfig.datasources,

    attr: resolveAttributes(templateConfig.attributes),
    bricks,
    theme: templateConfig.themes[0],

    // for now, we just copy the site attributes to the page attributes
    siteAttributes: templateConfig.attributes,
    attributes: templateConfig.attributes,
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
    attributes: templateConfig.attributes,
    datasources: templateConfig.datasources,
    themes: templateConfig.themes,
  };

  const pages = templateConfig.pages.map((p) =>
    getNewPageConfig(
      templateConfig,
      { siteId: site.id, siteLabel: site.label, id: crypto.randomUUID(), label: p.label, hostname },
      p.path,
    ),
  );

  return { site, pages };
}

export type NewSiteConfig = ReturnType<typeof getNewSiteConfig>;

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
