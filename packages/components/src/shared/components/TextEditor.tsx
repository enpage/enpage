import { useEditor as useTextEditor, EditorContent, type EditorEvents, type Editor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit"; // define your extension array
import TextAlign from "@tiptap/extension-text-align";
import { Select, ToggleGroup } from "@upstart.gg/style-system/system";
import { tx } from "@upstart.gg/style-system/twind";
import { useState, useRef, useEffect } from "react";
import {
  MdFormatBold,
  MdFormatAlignCenter,
  MdFormatAlignJustify,
  MdFormatAlignLeft,
  MdFormatAlignRight,
} from "react-icons/md";
import { MdOutlineFormatItalic } from "react-icons/md";
import { MdStrikethroughS } from "react-icons/md";
import type { Brick } from "@upstart.gg/sdk/shared/bricks";
import { useEditor } from "~/editor/hooks/use-editor";

const extensions = [
  StarterKit,
  TextAlign.configure({
    types: ["heading", "paragraph"],
  }),
];

type Props = {
  initialContent: string;
  onUpdate?: (e: EditorEvents["update"]) => void;
  enabled?: boolean;
  className?: string;
  brickId: Brick["id"];
};

const toolbarBtnCls =
  "first:rounded-l last:rounded-r text-sm px-2 hover:[&:not([data-state=on])]:bg-upstart-100 leading-none data-[state=on]:(bg-upstart-500 text-white)";

const TextEditor = ({ initialContent, onUpdate, className, brickId, enabled = false }: Props) => {
  const mainEditor = useEditor();
  const [editable, setEditable] = useState(enabled);
  const editor = useTextEditor({
    extensions,
    content: initialContent,
    onUpdate,
    immediatelyRender: false,
    // autofocus: false,
    editable,
    editorProps: {
      attributes: {
        class: tx("max-w-[100%] focus:outline focus:outline-offset-2", className),
      },
    },
  });

  useEffect(() => {
    const onFocus = () => {
      console.log("text focus");
      mainEditor.setIsEditingText(brickId);
    };

    const onBlur = () => {
      console.log("text blur");
      mainEditor.setIsEditingText(false);
      setEditable(false);
    };

    editor?.on("focus", onFocus);
    editor?.on("blur", (e) => {
      if ((e.event.target as HTMLElement)?.matches(".tiptap")) return;
      onBlur();
    });

    return () => {
      editor?.off("focus", onFocus);
      editor?.off("blur", onBlur);
    };
  }, [editor, mainEditor, brickId]);

  return (
    <>
      <EditorContent
        onDoubleClick={(e) => {
          e.preventDefault();
          setEditable(true);
          setTimeout(() => {
            editor?.view.focus();
          }, 200);
        }}
        editor={editor}
        className="outline-none"
      />
      {editor && editable && <MenuBar brickId={brickId} editor={editor} />}
      {/* <FloatingMenu editor={editor}>This is the floating menu</FloatingMenu>
      {editor && (
        <BubbleMenu editor={editor} tippyOptions={{ duration: 100 }}>
          <div className="bubble-menu h-10 flex gap-3 p-1 bg-upstart-300 shadow-lg rounded">
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
      )} */}
    </>
  );
};

const menuBarClass = tx(
  "z-[900] text-gray-800 h-10 flex gap-3 p-1 bg-gradient-to-t from-upstart-700/75 to-upstart-400/75 \
  shadow-lg rounded-b fixed top-[59px] left-1/2 -translate-x-1/2 text-sm backdrop-blur transition-all duration-100",
  // "z-[900] text-gray-800 h-10 flex gap-3 p-1 bg-gradient-to-t from-upstart-400/75 to-upstart-200/75 \
  // shadow-lg rounded absolute -top-11 left-1/2 -translate-x-1/2 text-sm backdrop-blur transition-all duration-100",
);

const MenuBar = ({ editor, brickId }: { editor: Editor; brickId: Brick["id"] }) => {
  const ref = useRef<HTMLDivElement>(null);
  const mainEditor = useEditor();

  return (
    <div
      ref={ref}
      className={tx(
        "z-[900] text-gray-800 h-10 flex gap-3 p-1 bg-gradient-to-t from-upstart-400/75 to-upstart-200/75 \
        shadow-lg rounded absolute -top-11 left-1/2 -translate-x-1/2 text-sm backdrop-blur transition-all duration-100",
        {
          "scale-90 opacity-0 hidden": mainEditor.selectedBrick?.id !== brickId,
        },
      )}
    >
      <ButtonGroup>
        <TextSizeSelect editor={editor} />
      </ButtonGroup>
      <TextStyleButtonGroup editor={editor} />
      <TextAlignButtonGroup editor={editor} />
    </div>
  );
};

function TextAlignButtonGroup({ editor }: { editor: Editor }) {
  return (
    <ToggleGroup.Root
      className="inline-flex space-x-px divide-x divide-upstart-300 rounded bg-upstart-200 shadow-sm"
      type="single"
      value={editor.isActive("textAlign") ? editor.getAttributes("textAlign").alignment : undefined}
      aria-label="Text align"
    >
      <ToggleGroup.Item
        className={tx(toolbarBtnCls)}
        value="left"
        onClick={() => editor.chain().focus().setTextAlign("left").run()}
      >
        <MdFormatAlignLeft className="w-5 h-5" />
      </ToggleGroup.Item>
      <ToggleGroup.Item
        className={tx(toolbarBtnCls)}
        value="center"
        onClick={() => editor.chain().focus().setTextAlign("center").run()}
      >
        <MdFormatAlignCenter className="w-5 h-5" />
      </ToggleGroup.Item>
      <ToggleGroup.Item
        className={tx(toolbarBtnCls)}
        value="right"
        onClick={() => editor.chain().focus().setTextAlign("right").run()}
      >
        <MdFormatAlignRight className="w-5 h-5" />
      </ToggleGroup.Item>
      <ToggleGroup.Item
        className={tx(toolbarBtnCls)}
        value="justify"
        onClick={() => editor.chain().focus().setTextAlign("justify").run()}
      >
        <MdFormatAlignJustify className="w-5 h-5" />
      </ToggleGroup.Item>
    </ToggleGroup.Root>
  );
}

function TextStyleButtonGroup({ editor }: { editor: Editor }) {
  return (
    <ToggleGroup.Root
      className="inline-flex space-x-px divide-x divide-upstart-300 rounded bg-upstart-200 shadow-sm"
      type="multiple"
      value={
        [
          editor.isActive("bold") ? "bold" : undefined,
          editor.isActive("italic") ? "italic" : undefined,
          editor.isActive("strike") ? "strike" : undefined,
        ].filter(Boolean) as string[]
      }
      aria-label="Text style"
    >
      <ToggleGroup.Item
        className={tx(toolbarBtnCls)}
        value="bold"
        onClick={() => editor.chain().focus().toggleBold().run()}
      >
        <MdFormatBold className="w-5 h-5" />
      </ToggleGroup.Item>
      <ToggleGroup.Item
        className={tx(toolbarBtnCls)}
        value="italic"
        onClick={() => editor.chain().focus().toggleItalic().run()}
      >
        <MdOutlineFormatItalic className="w-5 h-5" />
      </ToggleGroup.Item>
      <ToggleGroup.Item
        className={tx(toolbarBtnCls)}
        value="strike"
        onClick={() => editor.chain().focus().toggleStrike().run()}
      >
        <MdStrikethroughS className="w-5 h-5" />
      </ToggleGroup.Item>
    </ToggleGroup.Root>
  );
}

function ButtonGroup({ children, gap = "gap-0" }: { children: React.ReactNode; gap?: string }) {
  return <div className={tx("flex relative", gap)}>{children}</div>;
}

type TextSizeSelectProps = {
  editor: Editor;
};

function TextSizeSelect({ editor }: TextSizeSelectProps) {
  return (
    <Select.Root
      defaultValue={
        editor.isActive("heading")
          ? editor.getAttributes("heading").level?.toString()
          : editor.isActive("code")
            ? "code"
            : "paragraph"
      }
      onValueChange={(level) => {
        if (level === "code") {
          editor.chain().focus().toggleCode().run();
        } else if (level === "paragraph") {
          editor.chain().focus().setParagraph().run();
        } else {
          // @ts-ignore
          editor.chain().focus().toggleHeading({ level: +level }).run();
        }
      }}
    >
      <Select.Trigger variant="surface" color="violet" />
      <Select.Content position="popper">
        <Select.Group>
          <Select.Label>Headings</Select.Label>
          {[1, 2, 3, 4, 5].map((level) => (
            <Select.Item value={level.toString()} key={`level-${level}`}>
              Title {level}
            </Select.Item>
          ))}
        </Select.Group>
        <Select.Separator />
        <Select.Group>
          <Select.Label>Text</Select.Label>
          <Select.Item value="paragraph">Paragraph</Select.Item>
          <Select.Item value="code">Code</Select.Item>
        </Select.Group>
      </Select.Content>
    </Select.Root>
  );
}

export default TextEditor;
