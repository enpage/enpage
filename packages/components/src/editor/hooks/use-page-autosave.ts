import { useDebounceCallback } from "usehooks-ts";
import { updatePage } from "~/editor/utils/api/page.api";
import {
  useAttributesSubscribe,
  useBricksSubscribe,
  useDraft,
  useEditorMode,
  usePageConfig,
  usePagePathSubscribe,
  useThemeSubscribe,
} from "./use-editor";

const AUTO_SAVE_MIN_INTERVAL = 3000; // Auto save every N seconds

const noop = async () => {
  console.log("Skip saving page in local mode");
  return false;
};
type UpdatePageParams = Parameters<typeof updatePage>;

export function usePageAutoSave() {
  const draft = useDraft();
  const editorMode = useEditorMode();
  const pageConfig = usePageConfig();
  const doUpdatePage = useDebounceCallback(
    editorMode === "remote"
      ? (...args: UpdatePageParams) => {
          updatePage(...args)
            .then(() => {
              draft.setLastSaved(new Date());
              draft.setDirty(false);
            })
            .catch(() => {
              console.error("Error while updating page");
            });
        }
      : noop,
    AUTO_SAVE_MIN_INTERVAL,
  );

  useBricksSubscribe(async (bricks) => {
    console.debug("Bricks have changed, updating page version");
    draft.setDirty(true);
    doUpdatePage({ elements: bricks }, pageConfig);
  });
  useAttributesSubscribe((attributes) => {
    console.debug("Attributes have changed, updating page version");
    draft.setDirty(true);
    doUpdatePage({ attributes }, pageConfig);
  });
  usePagePathSubscribe((path) => {
    console.debug("pagePath has changed, updating page version");
    draft.setDirty(true);
    doUpdatePage({ path }, pageConfig);
  });
  useThemeSubscribe((theme) => {
    console.debug("theme has changed, updating page version");
    draft.setDirty(true);
    doUpdatePage({ theme }, pageConfig);
  });
}
