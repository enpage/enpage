import type { PageInfo } from "@upstart.gg/sdk/shared/page";
import { patch } from "./base-api";

export function updatePage(payload: Record<string, unknown>, pageInfo: PageInfo) {
  return patch(`/sites/${pageInfo.siteId}/pages/${pageInfo.id}/versions/latest`, payload)
    .then((res) => {
      console.log("Page version saved");
      console.log(res);
    })
    .catch((err) => {
      console.error("Error while updating page version");
      console.log(err);
    });
}
