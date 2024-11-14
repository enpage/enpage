import { createPageConfigSampleFromTemplateConfig } from "@enpage/sdk/shared/page";
import * as testEnpageConfig from "./test-enpage.config";
import type { EnpageTemplateConfig } from "@enpage/sdk/shared/template-config";
import { EditorWrapper } from "~/components/EditorWrapper";
import { ClientOnly } from "./utils/client-only";
import Editor from "./components/Editor";

export default function App() {
  const pageConfig = createPageConfigSampleFromTemplateConfig(testEnpageConfig as EnpageTemplateConfig);
  const testPages = [
    {
      label: "Page 1",
      id: "page-1",
      siteId: "site-1",
    },
    {
      label: "Page 2",
      id: "page-2",
      siteId: "site-1",
    },
  ];
  return (
    <ClientOnly>
      <EditorWrapper pageConfig={pageConfig} pages={testPages} mode="local">
        <Editor />
      </EditorWrapper>
    </ClientOnly>
  );
}
