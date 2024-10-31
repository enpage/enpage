import { useEffect, useRef, useState, useCallback, useMemo, type ComponentType, type RefObject } from "react";
import { debounce } from "lodash-es";
import { keyframes, tx } from "./twind";

const blurFade = keyframes`
  0% {
    opacity: 1;
  }
  20% {
    opacity:0;
  }
  70% {
    opacity:0;
  }
  100% {
    opacity: 1;
  }
`;

// More specific type for the inner ref
interface WithInnerRef {
  innerRef: RefObject<HTMLDivElement>;
}

// Generic type for composed props with better constraints
type ComposedProps<Config> = Omit<Config, keyof WithInnerRef> & {
  className?: string;
  width?: number;
  defaultWidth?: number;
  debounceTime?: number;
};

export default function WidthProvideRGL<Config>(
  ComposedComponent: ComponentType<Config & WithInnerRef>,
): ComponentType<ComposedProps<Config>> {
  return function WidthProvider({
    className,
    defaultWidth = 1280,
    debounceTime = 400,
    ...rest
  }: ComposedProps<Config>) {
    const [width, setWidth] = useState(defaultWidth);
    const [resizing, setResizing] = useState(false);
    const elementRef = useRef<HTMLDivElement>(null);

    // set a setReszing(false) debounced function
    const setResizingDebounced = useCallback(
      debounce(() => setResizing(false), debounceTime),
      [],
    );

    useEffect(() => {
      // oberve the width of the element
      const observer = new ResizeObserver((entries) => {
        setResizing(true);
        setWidth(entries[0].contentRect.width);
        setResizingDebounced();
      });

      observer.observe(elementRef.current!);

      return () => observer.disconnect();
    }, [setResizingDebounced]);

    const componentProps: Config & WithInnerRef & { width: number } = {
      ...(rest as Config),
      className,
      width,
      innerRef: elementRef,
    };

    return <ComposedComponent {...componentProps} />;
  };
}
