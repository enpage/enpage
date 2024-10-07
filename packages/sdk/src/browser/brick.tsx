import type { Brick, ContainerVariant } from "~/shared/bricks";
import {
  lazy,
  memo,
  Suspense,
  type ComponentProps,
  type ComponentType,
  type LazyExoticComponent,
  type MouseEvent,
} from "react";
import { CSS } from "@dnd-kit/utilities";
import { useSortable } from "@dnd-kit/sortable";
import { tx, style, css } from "@twind/core";
import clsx from "clsx";
import { useEditor, useEditorEnabled } from "./use-editor";

const BrickComponent = ({ type, props }: Brick & { overlay?: boolean }) => {
  // biome-ignore lint/suspicious/noExplicitAny: <explanation>
  let BrickModule: LazyExoticComponent<ComponentType<any>>;
  switch (type) {
    case "text":
      BrickModule = lazy(() => import(`./bricks/text`));
      break;
    case "image":
      BrickModule = lazy(() => import(`./bricks/image`));
      break;
    case "text-with-title":
      BrickModule = lazy(() => import(`./bricks/text-with-title`));
      break;
    default:
      return <></>;
  }
  const { wrapper, ...rest } = props;

  return (
    <Suspense>
      <BrickModule {...rest} />
    </Suspense>
  );
};

const MemoBrickComponent = memo(BrickComponent);

export default function DragabbleBrickWrapper({
  className,
  brick,
  ...wrapperAttrs
}: { brick: Brick } & ComponentProps<"div">) {
  const editor = useEditor();

  const onClick = editor.enabled
    ? (e: MouseEvent<HTMLElement>) => {
        e.stopPropagation();
        editor.setSelectedBrick(brick);
      }
    : undefined;

  const { setNodeRef, attributes, listeners, transform, over, active } = useSortable({
    id: brick.id,
    data: { type: "brick" },
  });

  const style =
    over?.data.current?.type !== "container"
      ? {
          transform: CSS.Transform.toString(transform ? { ...transform, scaleX: 1, scaleY: 1 } : null),
        }
      : {};

  return (
    <div
      ref={setNodeRef}
      id={brick.id}
      style={style}
      {...wrapperAttrs}
      {...listeners}
      {...attributes}
      onClick={onClick}
      className={tx("brick", className)}
    >
      {active?.id === brick.id ? <BrickPlaceholder /> : <MemoBrickComponent {...brick} />}
    </div>
  );
}

// export default memo(DragabbleBrickWrapper);

export function BrickPlaceholder() {
  return (
    <div
      className={tx(
        "rounded overflow-hidden bg-black bg-opacity-10 h-full transition-all duration-200 flex-1",
      )}
    />
  );
}

export function BrickOverlay({ brick, className, ...attrs }: ComponentProps<"div"> & { brick: Brick }) {
  return (
    <div
      className={tx(
        "brick rounded overflow-hidden bg-primary-100 z-[9999] ring ring-primary-500 ring-opacity-80 ring-offset-3 \
        shadow-lg bg-primary-500 bg-opacity-50 transition-all duration-200",
        className,
      )}
      {...attrs}
    >
      <MemoBrickComponent {...brick} />
    </div>
  );
}

export function getBrickWrapperClass(brick: Brick, index: number, variant: ContainerVariant) {
  let colSpan = "md:col-span-1";
  if (
    (variant === "1-2" && index === 1) ||
    (variant === "2-1" && index === 0) ||
    (variant === "1-1-2" && index === 2) ||
    (variant === "1-2-1" && index === 1) ||
    (variant === "2-1-1" && index === 0)
  ) {
    colSpan = "md:col-span-2";
  } else if ((variant === "1-3" && index === 1) || (variant === "3-1" && index === 0)) {
    colSpan = "md:col-span-3";
  }
  return clsx(
    "hover:(ring ring-primary-400 rounded) min-h-full",
    colSpan,
    brick.wrapper?.baseClasses,
    brick.wrapper?.customClasses,
  );
}
