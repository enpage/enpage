import { useEditor, EditorContent, FloatingMenu, BubbleMenu, type EditorEvents } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit"; // define your extension array
import { tx } from "@twind/core";
import { useState, memo } from "react";
import { MdFormatBold } from "react-icons/md";
import { MdOutlineFormatItalic } from "react-icons/md";
import { MdStrikethroughS } from "react-icons/md";
import type { Brick } from "~/shared/bricks";
import { useDraft } from "../use-editor";

const extensions = [StarterKit];

type Props = {
  initialContent: string;
  onUpdate?: (e: EditorEvents["update"]) => void;
  enabled?: boolean;
  className?: string;
};

const TextEditor = ({ initialContent, onUpdate, className, enabled = true }: Props) => {
  const [editable, setEditable] = useState(enabled);
  const editor = useEditor({
    extensions,
    content: initialContent,
    onUpdate,
    // autofocus: false,
    editable,
    editorProps: {
      attributes: {
        class: tx("prose max-w-[100%] m-5 focus:outline-none", className),
      },
    },
  });

  const btnBase =
    "bg-gray-200 rounded text-sm px-1.5 py-1 hover:[&:not(.active)]:bg-primary-100 leading-none";
  const btnActive = "bg-primary-500 text-white active";

  return (
    <>
      <EditorContent onClick={() => setEditable(true)} editor={editor} className="outline-none" />
      <FloatingMenu editor={editor}>This is the floating menu</FloatingMenu>
      {editor && (
        <BubbleMenu editor={editor} tippyOptions={{ duration: 100 }}>
          <div className="bubble-menu h-10 flex gap-3 p-1 bg-primary-300 shadow-lg rounded">
            <div className="flex gap-1">
              <button
                type="button"
                onClick={() => editor.chain().focus().toggleBold().run()}
                className={tx(btnBase, editor.isActive("bold") && btnActive)}
              >
                <MdFormatBold className="w-5 h-5" />
              </button>
              <button
                type="button"
                onClick={() => editor.chain().focus().toggleItalic().run()}
                className={tx(btnBase, editor.isActive("italic") && btnActive)}
              >
                <MdOutlineFormatItalic className="w-5 h-5" />
              </button>
              <button
                type="button"
                onClick={() => editor.chain().focus().toggleStrike().run()}
                className={tx(btnBase, editor.isActive("strike") && btnActive)}
              >
                <MdStrikethroughS className="w-5 h-5" />
              </button>
            </div>
          </div>
        </BubbleMenu>
      )}
    </>
  );
};

export function createTextEditorUpdateHandler(brickId: Brick["id"], prop = "content") {
  const draft = useDraft();
  return (e: EditorEvents["update"]) => {
    const brick = draft.getBrick(brickId);
    if (!brick) {
      console.warn("No brick for update found for id", brickId);
      return;
    }
    draft.updateBrick(brickId, {
      props: {
        ...(brick?.props ?? {}),
        [prop]: e.editor.getHTML(),
      },
    });
  };
}

export default TextEditor;
