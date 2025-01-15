import type { FieldProps } from "@rjsf/utils";
import { getDefaultRegistry } from "@rjsf/core";
import { SegmentedControl } from "@upstart.gg/style-system/system";
import { tx } from "@upstart.gg/style-system/twind";
const {
  fields: { AnyOfField },
} = getDefaultRegistry();

export function MyAnyOfField(props: FieldProps) {
  const {
    options,
    idSchema: { $id: id },
    schema: { title },
    currentValue,
  } = props;
  console.log("USING ANYOF FIELD", props);

  const onChange = (value: string) => {};

  const opts = options as FieldProps[];

  return (
    <>
      {title && (
        <h3 className="text-sm font-medium bg-upstart-100 dark:bg-dark-600 px-2 py-1 sticky top-0 z-[999] -mx-3">
          {title}
        </h3>
      )}

      <SegmentedControl.Root
        onValueChange={onChange}
        defaultValue={currentValue}
        size="1"
        className="w-full !max-w-full mt-2"
        radius="full"
      >
        {opts
          .filter((o) => !o["ui:hidden-option"])
          .map((option, index) => (
            <SegmentedControl.Item
              key={`${id}_${index}`}
              value={option.const}
              className={tx("[&_.rt-SegmentedControlItemLabel]:px-1")}
            >
              {option.title}
            </SegmentedControl.Item>
          ))}
      </SegmentedControl.Root>
      {options.map((option: any, index: number) => (
        <div key={`${id}_${index}`}>{option.title}</div>
      ))}
    </>
  );
}
