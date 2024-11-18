import type { defineDataSources } from "./datasources";
import type { defineAttributes } from "./attributes";
import type { defineManifest } from "./manifest";
import type { definePages } from "./page";

export type EnpageTemplateConfig = {
  /**
   * The template manifest and settings
   */
  manifest: ReturnType<typeof defineManifest>;
  /**
   * The attributes declared for the template
   */
  attributes: ReturnType<typeof defineAttributes>;
  /**
   * The datasources declared for the template
   */
  datasources?: ReturnType<typeof defineDataSources>;
  /**
   * The blocks declared for the template
   */
  // bricks: ReturnType<typeof defineBricks>;
  pages: ReturnType<typeof definePages>;
};
