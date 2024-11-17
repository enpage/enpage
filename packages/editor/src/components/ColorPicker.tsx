import type React from "react";
import { useCallback, useMemo, useState, type ChangeEvent } from "react";
import {
  chroma,
  colorAdjustmentBaseValues,
  getColorsSuggestions,
  colorAdjustmentsLuminous,
  colorAdjustmentsSubdued,
  type ColorAdjustment,
  type ColorType,
  type ElementColorType,
  generateVariantClasses,
} from "@enpage/sdk/themes/color-system";
import { tx } from "@enpage/style-system/twind";
import { Button, TextField, Text, Select } from "@enpage/style-system";
import { useColorAdjustment, useEditor, useTheme } from "~/hooks/use-editor";
import invariant from "@enpage/sdk/shared/utils/invariant";

interface BaseColorPickerProps {
  colorType: ColorType;
  initialValue?: number | string;
  onChange?: (color: string, oklabValues: number[]) => void;
  steps?: number;
}

const BaseColorPicker: React.FC<BaseColorPickerProps> = ({
  colorType,
  initialValue = 120,
  steps = 81, // Default to 81 colors
  onChange = () => {},
}) => {
  const theme = useTheme();
  const editor = useEditor();
  const colorAdjustment = useColorAdjustment();

  const { lightness, saturation } = useMemo(
    () => colorAdjustmentBaseValues[colorAdjustment][colorType],
    [colorAdjustment, colorType],
  );

  const generateColor = useCallback(
    (hue: number) => {
      try {
        const color = chroma.hsl(hue, saturation / 100, lightness / 100);
        const oklabValues = color.oklab();
        return {
          color: color.hex(),
          oklabValues,
        };
      } catch (error) {
        console.error(`Error generating color for hue: ${hue}`, error);
        return {
          color: "#000000",
          oklabValues: [lightness / 100, 0, 0],
        };
      }
    },
    [lightness, saturation],
  );

  const initialColor = generateColor(
    typeof initialValue === "string" ? chroma(initialValue).hsl()[0] : initialValue,
  );
  const [selectedColor, setSelectedColor] = useState(initialColor.color);
  const suggestions = colorType === "primary" ? [] : getColorsSuggestions(theme.colors.primary, theme);

  const colors = useMemo(() => {
    const spacing = 360 / steps;
    const hues = Array.from({ length: steps }, (_, i) => i * spacing);
    return hues.map((hue) => generateColor(hue));
  }, [generateColor, steps]);

  const suggestedColors = useMemo(() => {
    return suggestions.map(generateColor);
  }, [generateColor, suggestions]);

  // Handle color selection
  const handleColorSelect = (color: string, oklabValues: number[]) => {
    setSelectedColor(color);
    onChange(color, oklabValues);
  };
  return (
    <div>
      <Text as="p" size="2" color="gray" className="!capitalize !font-medium">
        {colorType} color
      </Text>
      <Select.Root
        defaultValue={colorAdjustment}
        size="1"
        onValueChange={(adjustment) => {
          editor.setColorAdjustment(adjustment as ColorAdjustment);
        }}
      >
        <Select.Trigger className="!w-full !mt-2" />
        <Select.Content>
          <Select.Group>
            <Select.Label>Luminous styles</Select.Label>
            {colorAdjustmentsLuminous.map((option) => (
              <Select.Item key={option} value={option}>
                <span className="capitalize">{option} palette</span>
              </Select.Item>
            ))}
          </Select.Group>
          <Select.Group>
            <Select.Label>Subdued styles</Select.Label>
            {colorAdjustmentsSubdued.map((option) => (
              <Select.Item key={option} value={option}>
                <span className="capitalize">{option} palette</span>
              </Select.Item>
            ))}
          </Select.Group>
        </Select.Content>
      </Select.Root>
      {/* Color circles */}
      <div className="flex flex-wrap gap-1.5 mt-3">
        {colors.map((color, i) => (
          <button
            type="button"
            key={i}
            className="w-6 h-6 rounded-full transition-transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-blue-500"
            style={{
              background: color.color,
              boxShadow: selectedColor === color.color ? `0 0 0 2px white, 0 0 0 4px ${color.color}` : "none",
            }}
            onClick={() => handleColorSelect(color.color, color.oklabValues)}
            aria-label={`Select color ${color.color}`}
          />
        ))}
      </div>

      {/* Current color display */}
      <div className="flex items-center gap-3 p-2 bg-gray-100 rounded mt-3">
        <div className="w-8 h-8 rounded-md shadow-sm" style={{ background: selectedColor }} />
        <code className="text-sm font-mono">{selectedColor}</code>
      </div>

      <form
        className="group mt-2"
        onSubmit={(e) => {
          e.preventDefault();
          const color = new FormData(e.currentTarget).get("customColor") as string;
          invariant(color, "Color is required");
          handleColorSelect(color, chroma(color).oklab());
        }}
      >
        <div className={tx("flex text-sm gap-x-1")}>
          {colorType !== "primary" && (
            <div className="flex flex-col items-start justify-start gap-y-1 flex-shrink basis-1/2">
              <Text color="gray">Suggestions:</Text>
              <div className="gap-1">
                {suggestedColors.map((suggestion) => (
                  <button
                    key={suggestion.color}
                    type="button"
                    className="w-6 h-6 mr-1 rounded-full transition-transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    style={{ backgroundColor: suggestion.color }}
                    onClick={() => handleColorSelect(suggestion.color, chroma(suggestion.color).oklab())}
                  />
                ))}
              </div>
            </div>
          )}
          <div className="flex flex-col gap-y-1 items-start justify-start basis-1/2">
            <Text color="gray">Use a custom color</Text>
            <div className="flex gap-x-1">
              <TextField.Root
                required
                name="customColor"
                placeholder="#123456"
                size="1"
                className="w-20"
                pattern="#[0-9a-fA-F]{6}"
                maxLength={7}
              />
              <Button
                size="1"
                variant="soft"
                className="mr-2 group-invalid:pointer-events-none group-invalid:opacity-60"
                type="submit"
              >
                Save
              </Button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default BaseColorPicker;

type ElementColor =
  | {
      hex: string;
    }
  | {
      hsl: string;
    }
  | {
      oklch: [number, number, number, number?];
    }
  | {
      linearGradient: string;
    }
  | {
      repeatingLinearGradient: string;
    }
  | {
      radialGradient: string;
    }
  | {
      repeatingRadialGradient: string;
    }
  | {
      conicGradient: string;
    }
  | {
      repeatingConicGradient: string;
    };

interface ElementColorPickerProps {
  elementColorType: ElementColorType;
  initialValue?: string;
  onChange?: (color: string, oklabValues: number[]) => void;
}

export const ElementColorPicker: React.FC<ElementColorPickerProps> = ({
  initialValue,
  elementColorType,
  onChange = () => {},
}) => {
  if (elementColorType === "page-background") {
    const colors = ["primary", "secondary", "accent", "neutral"];
    const shades = ["50", "100", "200"];

    const variants = {
      "surface-primary": generateVariantClasses("surface", "primary"),
      "surface-secondary": generateVariantClasses("surface", "secondary"),
      "surface-neutral": generateVariantClasses("surface", "neutral"),

      "faded-primary": generateVariantClasses("faded", "primary"),
      "faded-secondary": generateVariantClasses("faded", "secondary"),
      "faded-neutral": generateVariantClasses("faded", "neutral"),

      "glazed-primary": generateVariantClasses("glazed", "primary"),
      "glazed-secondary": generateVariantClasses("glazed", "secondary"),
      "glazed-neutral": generateVariantClasses("glazed", "neutral"),

      "soft-primary": generateVariantClasses("soft", "primary"),
      "soft-secondary": generateVariantClasses("soft", "secondary"),
      "soft-neutral": generateVariantClasses("soft", "neutral"),
    } as const;
    return (
      <div className="grid grid-cols-3 gap-3">
        {colors.flatMap((color) =>
          shades
            .map((shade) => `${color}-${shade}`)
            .map((colorShade) => (
              <button
                type="button"
                key={colorShade}
                className={tx(
                  "flex-1 h-8 w-8 rounded-full outline  outline-gray-200",
                  `bg-${colorShade} hover:outline-gray-300`,
                )}
                onClick={() => {
                  const color = `var(--color-${colorShade})`;
                  onChange(color, []);
                }}
              />
            )),
        )}
        <button
          type="button"
          onClick={() => {
            onChange("#ffffff", []);
          }}
          className="flex-1 h-6 col-span-3 text-xs rounded-lg
          outline outline-gray-200 hover:outline-gray-300 bg-white"
        >
          White
        </button>
      </div>
    );
  }
  return <div>Element color picker "{elementColorType}"</div>;
};
