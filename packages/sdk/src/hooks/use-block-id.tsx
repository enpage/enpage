import { useRef } from "react";
import { nanoid } from "nanoid";

/**
 * Generate a unique block id, if not provided
 */
export function useBlockId(id: string | undefined, prefix = "enpage-block-") {
  const uuid = useRef(id ?? prefix + nanoid(7));
  return uuid.current;
}
