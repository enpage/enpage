import type { FieldProps } from "./types";
import { Text } from "@upstart.gg/style-system/system";
import { useTextEditMode } from "~/editor/hooks/use-editor";
import { tx } from "@upstart.gg/style-system/twind";
import type { MixedContent } from "@upstart.gg/sdk/shared/bricks/props/common";
import TextEditor from "~/shared/components/TextEditor";

const MixedContentField: React.FC<FieldProps<MixedContent>> = (props) => {
  const { onChange, title, currentValue, brickId } = props;
  const textEditMode = useTextEditMode();

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
          discrete={textEditMode !== "large"}
          brickId={brickId}
          initialContent={currentValue.text}
          menuPlacement="above-editor"
          richText={currentValue.richText}
          enabled
          className={tx("form-textarea focus:ring-0 h-full", {
            "flex-1 rounded rounded-t-none border-gray-300": textEditMode === "large",
            "border-0": textEditMode !== "large",
            // "h-full": !!currentValue.richText,
            // "min-h-12": !currentValue.richText,
          })}
        />
      </div>
    </div>
  );
};

export default MixedContentField;
