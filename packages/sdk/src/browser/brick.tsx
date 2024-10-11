import type { Brick, BricksContainer, ContainerVariant } from "~/shared/bricks";
import {
  lazy,
  memo,
  Suspense,
  useEffect,
  type ComponentProps,
  type ComponentType,
  type CSSProperties,
  type LazyExoticComponent,
  type MouseEvent,
} from "react";
import { CSS } from "@dnd-kit/utilities";
import { useSortable } from "@dnd-kit/sortable";
import { tx, style, css, apply } from "@twind/core";
import clsx from "clsx";
import { useEditor, useEditorEnabled } from "./use-editor";

const GRID_COLS = 12;

const BrickComponent = ({
  brick: { type, props },
  container,
  ...otherProps
}: { brick: Brick; container: BricksContainer; overlay?: boolean } & ComponentProps<"div">) => {
  // biome-ignore lint/suspicious/noExplicitAny: <explanation>
  let BrickModule: LazyExoticComponent<ComponentType<any>>;
  // const otherProps = {} as Record<string, unknown>;

  switch (type) {
    case "text":
      BrickModule = lazy(() => import(`./bricks/text`));
      otherProps.contentEditable = true;
      break;
    case "text-with-title":
      BrickModule = lazy(() => import(`./bricks/text-with-title`));
      otherProps.contentEditable = true;
      break;
    case "hero":
      BrickModule = lazy(() => import(`./bricks/hero`));
      otherProps.contentEditable = true;
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
      <BrickModule {...rest} {...otherProps} />
    </Suspense>
  );
};

const MemoBrickComponent = memo(BrickComponent);

export default function DragabbleBrickWrapper({
  className,
  brick,
  container,
  placeholder,
  ...wrapperAttrs
}: { brick: Brick; container: BricksContainer; placeholder?: boolean } & ComponentProps<"div">) {
  const editor = useEditor();

  const onClick = editor.enabled
    ? (e: MouseEvent<HTMLElement>) => {
        e.stopPropagation();
        editor.setSelectedBrick(brick);
      }
    : undefined;

  const { setNodeRef, attributes, listeners, transform, over, active } = useSortable({
    id: brick.id,
    data: {
      type: "brick",
      brick,
      brickIndex: container.bricks.findIndex((b) => b.id === brick.id),
      bricksCount: container.bricks.length,
    },
  });

  const style = {
    ...(over?.data.current?.type === "container"
      ? {}
      : over && active?.id === brick.id
        ? {
            backgroundColor: "#00000015",
            transform: CSS.Transform.toString(transform),
            transformOrigin: "top left",
          }
        : {
            // Prevent scaling when not over
            transform: CSS.Transform.toString(transform ? { ...transform, scaleX: 1, scaleY: 1 } : null),
            transformOrigin: "top left",
          }),
  };

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
      {active?.id === brick.id || placeholder ? (
        <BrickPlaceholder brick={brick} container={container} style={style} />
      ) : (
        <MemoBrickComponent brick={brick} container={container} />
      )}
    </div>
  );
}

// export function BrickWrapper({ brick, className }: { brick: Brick } & ComponentProps<"div">) {
//   return (
//     <div className={tx("brick", className)}>
//       <MemoBrickComponent brick={brick} />
//     </div>
//   );
// }

export function BrickPlaceholder({
  brick,
  container,
  style,
}: { brick: Brick; container: BricksContainer; style: CSSProperties }) {
  // console.log("over", over);
  // console.log("brick", brick);
  return (
    <div className={tx("rounded flex-1 shrink-0 transition-all duration-200 opacity-0")}>
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
          "brick rounded overflow-hidden z-[9999] ring ring-primary-500 ring-opacity-80 ring-offset-3 \
        shadow-lg transition-all duration-200 bg-white/40",
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

export function getBrickWrapperClass(
  brick: Brick,
  brickIndex: number,
  bricksCount: number,
  containerIndex: number,
) {
  return clsx(
    "hover:(ring ring-primary-400 rounded) transition-all duration-300",
    getBrickDefinedClass(brick),
    css({
      gridTemplateColumns: "subgrid",
      gridTemplateRows: "subgrid",
      gridRow: `${containerIndex + 1} / span ${brick.wrapper.rowSpan ?? 1}`,
      gridColumnStart: computeColStart(brick, brickIndex, bricksCount),
      gridColumnEnd: computeColEnd(brick, brickIndex, bricksCount),
    }),
  );
}

/**
 * Compute the brick column start index based on the the brick index in a 12-column grid.
 * @param brick
 * @param brickIndex
 * @param container
 */
function computeColStart(brick: Brick, brickIndex: number, bricksCount: number) {
  if (brick.wrapper.colStart) {
    return brick.wrapper.colStart;
  }

  const colStart = (GRID_COLS / bricksCount) * brickIndex + 1;

  return colStart;
}

/**
 * Compute the brick column end index based on the the brick index in a 12-column grid.
 *
 * @param brick
 * @param brickIndex
 * @param container
 */
function computeColEnd(brick: Brick, brickIndex: number, bricksCount: number) {
  if (brick.wrapper.colSpan) {
    return `span ${brick.wrapper.colSpan}`;
  }
  // check if the brick is the last one in the container
  if (brickIndex === bricksCount - 1) {
    return -1;
  }

  const colEnd = (GRID_COLS / bricksCount) * (brickIndex + 1) + 1;
  return colEnd;
}

function getBrickDefinedClass(brick: Brick) {
  return [brick.wrapper.baseClasses, brick.wrapper.customClasses];
}
