import { useDraft, useEditor } from "../hooks/use-editor-store";
import Modal from "./Modal";

export function Settings() {
  const editor = useEditor();

  if (!editor.settingsVisible) {
    return null;
  }

  return (
    <Modal
      panelClassName="md:max-w-xl lg:max-w-2xl xl:max-w-5xl"
      title="Foo"
      dismissable
      primaryAction="Close"
      onClosed={() => editor.setSettingsVisible(false)}
    >
      <p>Hello Gérard</p>
    </Modal>
  );
}
