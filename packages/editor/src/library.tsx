import { EditorWrapper, type EditorWrapperProps } from "@enpage/sdk/browser/EditorWrapper";
import { ClientOnly } from "./utils/client-only";
import Editor from "./components/Editor";

export default function EditorComponent({ pageConfig, pages }: EditorWrapperProps) {
  return (
    <ClientOnly>
      <EditorWrapper pageConfig={pageConfig} pages={pages}>
        <Editor />
      </EditorWrapper>
    </ClientOnly>
  );
}
