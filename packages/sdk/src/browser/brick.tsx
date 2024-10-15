import type { Brick, BricksContainer } from "~/shared/bricks";
import {
  forwardRef,
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
import { tx, style, css, apply } from "@twind/core";
import clsx from "clsx";
import { useEditor, useEditorEnabled } from "./use-editor";
import { MdDragHandle } from "react-icons/md";
import { useDndContext, useDraggable } from "@dnd-kit/core";
import { RxDragHandleDots2 } from "react-icons/rx";
import { isEqualWith } from "lodash-es";

const BrickComponent = ({
  brick,
  container,
  ...otherProps
}: { brick: Brick; container: BricksContainer; overlay?: boolean } & ComponentProps<"div">) => {
  // biome-ignore lint/suspicious/noExplicitAny: <explanation>
  let BrickModule: LazyExoticComponent<ComponentType<any>>;
  // const otherProps = {} as Record<string, unknown>;
  const { type, props } = brick;

  switch (type) {
    case "text":
      BrickModule = lazy(() => import(`./bricks/text`));
      break;
    case "text-with-title":
      BrickModule = lazy(() => import(`./bricks/text-with-title`));
      break;
    case "hero":
      BrickModule = lazy(() => import(`./bricks/hero`));
      break;
    case "image":
      BrickModule = lazy(() => import(`./bricks/image`));
      break;

    default:
      return <></>;
  }
  const { wrapper, ...rest } = props;

  return (
    <Suspense>
      <BrickModule {...rest} {...otherProps} brickId={brick.id} />
    </Suspense>
  );
};

const MemoBrickComponent = memo(BrickComponent, (prevProps, nextProps) => {
  const compared = isEqualWith(prevProps, nextProps, (objValue, othValue, key, _, __) => {
    if (key === "content") {
      // If the key is in our ignore list, consider it equal
      return true;
    }
    // Otherwise, use the default comparison
    return undefined;
  });
  return compared;
});

export default function DragabbleBrickWrapper({
  className,
  brick,
  brickIndex,
  container,
  containerIndex,
  placeholder,
  ...wrapperAttrs
}: {
  brick: Brick;
  brickIndex: number;
  container: BricksContainer;
  containerIndex: number;
  placeholder?: boolean;
} & ComponentProps<"div">) {
  const editor = useEditor();
  const BrickTag = (editor.enabled ? "button" : "div") as "div";

  const onClick = editor.enabled
    ? (e: MouseEvent<HTMLElement>) => {
        e.stopPropagation();
        editor.setSelectedBrick(brick);
      }
    : undefined;

  const { setNodeRef, attributes, listeners, transform, over, active } = useSortable({
    id: brick.id,
    disabled: !editor.enabled,
    data: {
      type: "brick",
      brick,
      brickIndex,
      bricksCount: container.bricks.length,
      containerIndex,
    },
    transition: {
      duration: 200, // milliseconds
      easing: "cubic-bezier(0.25, 0.1, 0.25, 1)",
    },
  });

  const style = {
    ...(over?.data.current?.type === "container"
      ? {}
      : over && active?.id === brick.id
        ? {
            backgroundColor: "#00000015",
            transform: CSS.Transform.toString(transform ? { ...transform } : null),
            transformOrigin: "top left",
          }
        : active && over
          ? {
              // Prevent scaling when not over
              transform: CSS.Transform.toString(transform ? { ...transform, scaleX: 1, scaleY: 1 } : null),
              transformOrigin: "top left",
            }
          : {}),
  };

  return (
    <BrickTag
      ref={setNodeRef}
      id={brick.id}
      style={style}
      {...wrapperAttrs}
      {...listeners}
      {...attributes}
      onClick={onClick}
      className={tx(
        // DO NOT put transition classes here, they will make it flickering when dragging ends
        "relative cursor-auto focus:cursor-grab group/brick",
        { "hover:(z-50 shadow-lg)": !(active?.id as string)?.startsWith("resize-handle") },
        getBrickWrapperClass(brick, containerIndex),
        // used when dragging the row
        placeholder && "opacity-10 grayscale",
      )}
    >
      {active?.id === brick.id ? (
        <BrickPlaceholder brick={brick} container={container} />
      ) : (
        <>
          <MemoBrickComponent brick={brick} container={container} />
          {!active && (
            <DraggableBrickResizeHanlde
              brick={brick}
              brickIndex={brickIndex}
              containerIndex={containerIndex}
              handleType="left"
            />
          )}
          {!active && brickIndex === container.bricks.length - 1 && (
            <DraggableBrickResizeHanlde
              brick={brick}
              brickIndex={brickIndex}
              containerIndex={containerIndex}
              handleType="right"
            />
          )}
        </>
      )}
    </BrickTag>
  );
}

function DraggableBrickResizeHanlde({
  brick,
  brickIndex,
  containerIndex,
  handleType,
}: { brick: Brick; brickIndex: number; containerIndex: number; handleType: "left" | "right" }) {
  // Drag resize handle
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: `resize-handle-${handleType}-${brick.id}`,
    data: { type: "resize-handle", brick, brickIndex, containerIndex },
  });

  const style = transform
    ? {
        transform: `translate3d(${transform.x}px, 0px, 0)`,
      }
    : undefined;

  return (
    <BrickResizeHandle
      ref={setNodeRef}
      id={`resize-handle-${handleType}-${brick.id}`}
      data-brick-id={brick.id}
      data-brick-index={brickIndex}
      data-brick-col-start={brick.position.colStart}
      data-brick-col-end={brick.position.colEnd}
      handleType={handleType}
      {...style}
      {...attributes}
      {...listeners}
    />
  );
}

export const BrickResizeHandle = forwardRef<
  HTMLDivElement,
  ComponentProps<"div"> & { overlay?: boolean; handleType: "left" | "right" }
>(({ className, overlay, handleType, ...attrs }, ref) => {
  return (
    <div
      ref={ref}
      {...attrs}
      className={tx(
        "group !cursor-col-resize absolute z-[9999] text-primary-400 w-2.5 rounded-sm items-center justify-center shadow-xl",
        // "group-hover:(border border-primary-400 text-primary-400)",
        "transition-opacity duration-200 group-hover:(bg-primary-300 opacity-70) hover:(!opacity-100)",
        {
          "hidden group-hover:(flex flex-col)": !overlay,
          "-right-1.5 top-[10%] bottom-[10%]": !overlay && handleType === "right",
          "-left-1.5 top-[10%] bottom-[10%]": !overlay && handleType === "left",
          "flex flex-col bg-primary-400": overlay,
        },
        className,
      )}
    >
      <RxDragHandleDots2 className="w-4 h-auto group-hover:inline hidden text-white drop-shadow-sm" />
    </div>
  );
});

export function BrickPlaceholder({ brick, container }: { brick: Brick; container: BricksContainer }) {
  return (
    /* Put the brick component so it takes its natural place but don't show it */
    <div className={tx("flex-1 shrink-0 opacity-0")}>
      <MemoBrickComponent brick={brick} container={container} />
    </div>
  );
}

export function BrickOverlay({
  brick,
  container,
  className,
  ...attrs
}: ComponentProps<"div"> & { brick: Brick; container: BricksContainer }) {
  return (
    <div
      className={tx(
        apply(
          "brick rounded overflow-hidden z-[9999] outline outline-primary-400 shadow-lg bg-white/40 cursor-grabbing",
          // "brick rounded overflow-hidden z-[9999] ring ring-primary-400 ring-opacity-80 ring-offset-3 shadow-lg bg-white/40",
        ),
        className,
        getBrickDefinedClass(brick),
      )}
      {...attrs}
    >
      <MemoBrickComponent brick={brick} container={container} />
    </div>
  );
}

export function getBrickWrapperClass(brick: Brick, containerIndex: number) {
  return clsx(
    // DO NOT put transition classes here, they will make it flickering when dragging ends
    getBrickDefinedClass(brick),
    css({
      gridTemplateColumns: "subgrid",
      gridTemplateRows: "subgrid",
      gridRow: `${containerIndex + 1} / span ${brick.position.rowSpan ?? 1}`,
      gridColumnStart: brick.position.colStart,
      gridColumnEnd: brick.position.colEnd,
    }),
  );
}

function getBrickDefinedClass(brick: Brick) {
  return [brick.wrapper.baseClasses, brick.wrapper.customClasses];
}
