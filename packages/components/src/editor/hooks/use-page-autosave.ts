import { useDebounceCallback } from "usehooks-ts";
import { updatePage } from "~/editor/utils/api/page.api";
import {
  useAttributesSubscribe,
  useBricksSubscribe,
  useDraft,
  useEditorMode,
  usePageInfo,
  usePagePathSubscribe,
  useThemeSubscribe,
  type DraftState,
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
  const pageConfig = usePageInfo();
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

export function useOnDraftChange(
  onChange?: (state: DraftState, pageInfo: ReturnType<typeof usePageInfo>) => void,
) {
  if (!onChange) return;
  const draft = useDraft();
  const pageConfig = usePageInfo();
  const triggerOnChange = useDebounceCallback(() => onChange(draft, pageConfig), AUTO_SAVE_MIN_INTERVAL);
  useBricksSubscribe(triggerOnChange);
  useAttributesSubscribe(triggerOnChange);
  usePagePathSubscribe(triggerOnChange);
  useThemeSubscribe(triggerOnChange);
}
