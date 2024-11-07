import { useEffect, useRef, useState, type ComponentType, type RefObject } from "react";

// More specific type for the inner ref
interface WithInnerRef {
  innerRef: RefObject<HTMLDivElement>;
}

// Generic type for composed props with better constraints
type ComposedProps<Config> = Omit<Config, keyof WithInnerRef> & {
  className?: string;
  width?: number;
  defaultWidth?: number;
  onWidthChange?: (width: number) => void;
};

export default function WidthProvideRGL<Config>(
  ComposedComponent: ComponentType<Config & WithInnerRef>,
): ComponentType<ComposedProps<Config>> {
  return function WidthProvider({
    className,
    defaultWidth = 1280,
    onWidthChange,
    ...rest
  }: ComposedProps<Config>) {
    const [width, setWidth] = useState(defaultWidth);
    const elementRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
      // oberve the width of the element
      const observer = new ResizeObserver((entries) => {
        const newWidth = entries[0].contentRect.width;
        setWidth(newWidth);
        onWidthChange?.(newWidth);
      });
      observer.observe(elementRef.current!);
      return () => observer.disconnect();
    }, [onWidthChange]);

    const componentProps: Config & WithInnerRef & { width: number } = {
      ...(rest as Config),
      className,
      width,
      innerRef: elementRef,
    };

    return <ComposedComponent {...componentProps} />;
  };
}
