import { Dialog } from "@enpage/style-system";
import { useEditor } from "~/hooks/use-editor";

export default function ModalSearchImage() {
  const editor = useEditor();
  return (
    <Dialog.Root
      defaultOpen
      onOpenChange={(open) => {
        if (!open) {
          editor.hideModal();
          // Do something when the dialog is closed
        }
      }}
    >
      <Dialog.Content maxWidth="60dvw">
        <Dialog.Title>Search images</Dialog.Title>
        <Dialog.Description size="2" mb="4">
          Make changes to your profile.
        </Dialog.Description>
      </Dialog.Content>
    </Dialog.Root>
  );
}
