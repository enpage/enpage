import { EditorWrapper } from "@enpage/sdk/browser/EditorWrapper";
import type { GenericPageConfig } from "@enpage/sdk/shared/page-config";

export default function EnpageEditor({ pageConfig }: { pageConfig: GenericPageConfig }) {
  return <EditorWrapper config={pageConfig} />;
}
