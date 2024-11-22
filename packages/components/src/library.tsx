import { EditorWrapper, type EditorWrapperProps } from "./editor/components/EditorWrapper";
import Editor from "./editor/components/Editor";

export default function EditorComponent(props: EditorWrapperProps) {
  return (
    <EditorWrapper {...props}>
      <Editor />
    </EditorWrapper>
  );
}

export * as testConfig from "./test-enpage.config";
