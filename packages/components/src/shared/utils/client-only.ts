import { useEffect, useState, type ComponentProps } from "react";

export function ClientOnly({ children }: Pick<ComponentProps<"div">, "children">) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);
  if (!mounted) {
    return null;
  }
  return children;
}
