import { EditorWrapper, type EditorWrapperProps } from "./components/EditorWrapper";
import Editor from "./components/Editor";

export default function EditorComponent(props: EditorWrapperProps) {
  return (
    <EditorWrapper {...props}>
      <Editor />
    </EditorWrapper>
  );
}
