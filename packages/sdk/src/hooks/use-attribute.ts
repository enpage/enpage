import { AttributesMap } from "@enpage/types";
import { useRunContext } from "./use-run-context";

export function useAttributes<Settings extends AttributesMap>() {
  const { attributes } = useRunContext<{}, Settings>();
  return attributes;
}

export function useAttribute<Settings extends AttributesMap>(
  key: keyof Settings,
): NonNullable<Settings[keyof Settings]["value"]> | undefined;

export function useAttribute<Settings extends AttributesMap>(
  key: keyof Settings,
  defaultValue: NonNullable<Settings[keyof Settings]["value"]>,
): NonNullable<Settings[keyof Settings]["value"]>;

export function useAttribute<Settings extends AttributesMap>(
  key: keyof Settings,
  defaultValue?: NonNullable<Settings[keyof Settings]["value"]>,
) {
  const attributes = useAttributes<Settings>();
  const attribute = attributes[key];

  if (attribute && "value" in attribute) {
    return attribute.value as NonNullable<Settings[typeof key]["value"]>;
  }

  if (defaultValue !== undefined) {
    return defaultValue;
  }

  return undefined;
}
