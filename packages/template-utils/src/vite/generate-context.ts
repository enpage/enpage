import type { EnpageTemplateConfig } from "./types";
import { createFakeContext } from "@enpage/sdk/dev-utils";
import { logger } from "./logger";

export function generateContext(cfg: EnpageTemplateConfig | null) {
  return {
    name: "enpage-generate-context",
    transformIndexHtml: {
      order: "pre" as const,
      handler: (html: string) => {
        if (!cfg?.datasources) {
          logger.warn("No datasources found in enpage.config. Skipping context generation.");
          return html;
        }
        const ctx = createFakeContext(cfg.datasources);
        const newHtml = html.replace("</body>", `<script>window._enpageCtx = ${JSON.stringify(ctx)}</script></body>`);
        return newHtml;
      },
    },
  };
}
