import type { FieldProps } from "./types";
import { Text } from "@upstart.gg/style-system/system";
import { useDraft, useEditor } from "~/editor/hooks/use-editor";
import { tx } from "@upstart.gg/style-system/twind";
import type { MixedContent } from "@upstart.gg/sdk/shared/bricks/props/common";
import TextEditor from "~/shared/components/TextEditor";

const MixedContentField: React.FC<FieldProps<MixedContent>> = (props) => {
  const { onChange, title, currentValue, brickId } = props;
  const editor = useEditor();

  return (
    <div className="field field-mixed-content">
      {title && (
        <div className="flex items-center justify-between">
          <Text as="label" size="2" weight="medium">
            {title}
          </Text>
        </div>
      )}
      <div className={tx("relative")}>
        <TextEditor
          onUpdate={({ editor }) => {
            onChange({ ...currentValue, text: editor.getHTML() });
          }}
          discrete={editor.textEditMode !== "large"}
          brickId={brickId}
          initialContent={currentValue.text}
          menuPlacement="above-editor"
          richText={currentValue.richText}
          enabled
          className={tx("text-sm form-textarea focus:ring-0", {
            "flex-1 rounded rounded-t-none border-gray-300": editor.textEditMode === "large",
            "border-0": editor.textEditMode !== "large",
            "h-full": !!currentValue.richText,
            "max-h-10": !currentValue.richText,
          })}
        />
      </div>
    </div>
  );
};

export default MixedContentField;
