import { EditorWrapper, type EditorWrapperProps } from "@enpage/sdk/browser/EditorWrapper";
import Editor from "./components/Editor";

export default function EditorComponent({ pageConfig, pages }: EditorWrapperProps) {
  return (
    <EditorWrapper pageConfig={pageConfig} pages={pages}>
      <Editor />
    </EditorWrapper>
  );
}
