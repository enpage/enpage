import { getNewSiteConfig } from "@upstart.gg/sdk/shared/page";
import testEnpageConfig from "~/test-config";
import { EditorWrapper } from "~/editor/components/EditorWrapper";
import { ClientOnly } from "~/shared/utils/client-only";
import Editor from "~/editor/components/Editor";

export default function App() {
  const siteConfig = getNewSiteConfig(testEnpageConfig);

  return (
    <ClientOnly>
      <EditorWrapper pageConfig={siteConfig.pages[0]} siteConfig={siteConfig.site} mode="local">
        <Editor />
      </EditorWrapper>
    </ClientOnly>
  );
}
