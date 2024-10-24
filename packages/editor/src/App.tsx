import { createPageConfigFromTemplateConfig } from "@enpage/sdk/shared/page-config";
import * as testEnpageConfig from "./test-enpage.config";
import type { EnpageTemplateConfig } from "@enpage/sdk/shared/template-config";
import { EditorWrapper } from "@enpage/sdk/browser/EditorWrapper";
import { ClientOnly } from "./utils/client-only";
import Editor from "./components/Editor";

export default function App() {
  const pageConfig = createPageConfigFromTemplateConfig(testEnpageConfig as EnpageTemplateConfig);
  return (
    <ClientOnly>
      {/* <EditorWrapper config={pageConfig} /> */}
      <EditorWrapper config={pageConfig}>
        <Editor />
      </EditorWrapper>
    </ClientOnly>
  );
}
