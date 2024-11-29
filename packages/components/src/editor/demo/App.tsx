import { createSiteConfigFromTemplateConfig, type GenericPageConfig } from "@upstart.gg/sdk/shared/page";
import * as testEnpageConfig from "~/test-config";
import { EditorWrapper } from "~/editor/components/EditorWrapper";
import { ClientOnly } from "~/shared/utils/client-only";
import Editor from "~/editor/components/Editor";

export default function App() {
  const siteConfig = createSiteConfigFromTemplateConfig(testEnpageConfig);
  const pageConfig: GenericPageConfig = {
    ...siteConfig,
    id: crypto.randomUUID(),
    siteId: crypto.randomUUID(),
    label: "My site",
    hostname: "localhost",
  };
  return (
    <ClientOnly>
      <EditorWrapper pageConfig={pageConfig} mode="local">
        <Editor />
      </EditorWrapper>
    </ClientOnly>
  );
}
