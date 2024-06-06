import { useRunContext } from "./use-run-context";

export function useCssRegistry() {
  const { cssRegistry } = useRunContext();
  return cssRegistry;
}
