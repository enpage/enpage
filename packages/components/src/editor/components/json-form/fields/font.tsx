import Select, { type GroupProps, type GroupHeadingProps, type Props } from "react-select";
import { tx, css } from "@upstart.gg/style-system/twind";
import { useMemo, useState } from "react";
import googleFonts from "../../../utils/fonts.json";
import { useTheme } from "~/editor/hooks/use-editor";
import { fontStacks } from "@upstart.gg/sdk/shared/theme";

type FontPickerProps = {
  initialValue: string;
  onChange: (value: string) => void;
  options: { value: string; label: string }[];
};

export function useFonts() {
  const ggFonts = useMemo(() => googleFonts.map((font: string) => ({ value: font, label: font })), []);
  const theme = useTheme();
  const genericFonts = fontStacks.map((font) => ({ value: `stack:${font.value}`, label: font.label }));
  const customFonts = theme.customFonts?.map((font) => ({ value: `custom:${font}`, label: font.name })) ?? [];
  const allFonts = useMemo(
    () => [
      ...(customFonts.length ? [{ group: "Theme Fonts", options: customFonts }] : []),
      {
        group: "Generic Fonts",
        options: genericFonts,
      },
      {
        group: "Google Fonts",
        options: ggFonts,
      },
    ],
    [ggFonts, genericFonts, customFonts],
  );
  return allFonts;
}

const GroupHeading = ({ data }: GroupHeadingProps<unknown, false>) => {
  // @ts-ignore
  return <div className="px-2 py-1 text-xs bg-gray-200 text-gray-600">{data.group}</div>;
};

export default function FontPicker({ initialValue, onChange, options }: FontPickerProps) {
  const [selected, setSelected] = useState(initialValue);
  const allFonts = useFonts();
  const classNames: Props["classNames"] = {
    control: (state) =>
      !state.isFocused
        ? tx("outline-none bg-white rounded !min-h-full border border-gray-300")
        : tx("outline-none bg-white rounded !min-h-full border border-gray-300"),
    valueContainer: () => tx("bg-white px-2.5"),
    placeholder: () => tx("text-sm bg-white"),
    input: () =>
      tx(
        "text-sm outline-none !focus:outline-none !focus-within:outline-none [&>input]:focus:ring-0 [&>input]:focus-within:ring-0",
      ),
    container: () => tx("text-sm h-8"),
    menu: () => tx("text-sm bg-white shadow-2xl rounded py-1"),
    menuList: () =>
      css({
        scrollbarColor: "var(--violet-4) var(--violet-2)",
        scrollBehavior: "smooth",
        scrollbarWidth: "thin",
        "&:hover": {
          scrollbarColor: "var(--violet-7) var(--violet-3)",
        },
      }),
    loadingMessage(props) {
      return tx("text-sm py-2");
    },
    indicatorsContainer: () => tx("text-sm pr-1.5 font-normal scale-75"),

    option: (state) =>
      state.isSelected
        ? tx("bg-upstart-100 px-2 py-1.5")
        : tx("bg-white px-2 py-1.5 hover:(bg-upstart-600 text-white)"),
  };

  return (
    <Select
      unstyled
      value={selected}
      onChange={(e) => {
        setSelected(e as string);
        onChange(e as string);
      }}
      classNames={classNames}
      components={{ GroupHeading }}
      // @ts-ignore
      options={allFonts}
    />
  );
}
