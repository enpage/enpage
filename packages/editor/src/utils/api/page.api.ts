import type { GenericPageConfig } from "@enpage/sdk/shared/page";
import { patch } from "./base-api";

export function updatePage(payload: Record<string, unknown>, pageConfig: GenericPageConfig) {
  return patch(`/sites/${pageConfig.siteId}/pages/${pageConfig.id}/versions/latest`, payload)
    .then((res) => {
      console.log("Page version saved");
      console.log(res);
    })
    .catch((err) => {
      console.error("Error while updating page version");
      console.log(err);
    });
}
