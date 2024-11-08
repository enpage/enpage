import { memo, type FunctionComponent, type ForwardRefExoticComponent } from "react";
import { isEqualWith } from "lodash-es";

// biome-ignore lint/suspicious/noExplicitAny: <explanation>
export function memoizeWithout<T extends ForwardRefExoticComponent<any>>(
  Component: T,
  without: string | string[],
) {
  without = Array.isArray(without) ? without : [without];
  return memo(Component, (prevProps, nextProps) => {
    // !WARN: keep unused args because lodash do not pass the "key" when following args are not present
    const compared = isEqualWith(prevProps, nextProps, (objValue, othValue, key, _, __) => {
      if (key && without.includes(key.toString())) {
        // If the key is in our ignore list, consider it equal
        return true;
      }
      // Otherwise, use the default comparison
      return undefined;
    });
    return compared;
  });
}
