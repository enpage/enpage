import { EditorWrapper, type EditorWrapperProps } from "./components/EditorWrapper";
import Editor from "./components/Editor";

export default function EditorComponent({ pageConfig, pages }: EditorWrapperProps) {
  return (
    <EditorWrapper pageConfig={pageConfig} pages={pages}>
      <Editor />
    </EditorWrapper>
  );
}
