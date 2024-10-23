import type { Brick, BricksContainer } from "~/shared/bricks";
import {
  forwardRef,
  lazy,
  memo,
  Suspense,
  useEffect,
  useState,
  type ComponentProps,
  type ComponentType,
  type LazyExoticComponent,
  type MouseEvent,
  type PropsWithChildren,
} from "react";
import { CSS } from "@dnd-kit/utilities";
import { useSortable } from "@dnd-kit/sortable";
import { tx, style, css, apply } from "./twind";
import { useEditor, useEditorEnabled } from "./use-editor";
import { useDraggable } from "@dnd-kit/core";
import { RxDragHandleDots2 } from "react-icons/rx";
import { isEqualWith } from "lodash-es";
import { SlOptionsVertical } from "react-icons/sl";
import { DropdownMenu, Button, IconButton } from "@radix-ui/themes";
import { BiDotsVerticalRounded } from "react-icons/bi";

const BrickText = lazy(() => import("./bricks/text"));
const BrickTextWithTitle = lazy(() => import("./bricks/text-with-title"));
const BrickHero = lazy(() => import("./bricks/hero"));
const BrickImage = lazy(() => import("./bricks/image"));

// biome-ignore lint/suspicious/noExplicitAny: <explanation>
const bricksMap: Record<string, LazyExoticComponent<ComponentType<any>>> = {
  text: BrickText,
  "text-with-title": BrickTextWithTitle,
  hero: BrickHero,
  image: BrickImage,
};

const BrickComponent = ({
  brick,
  container,
  ...otherProps
}: { brick: Brick; container: BricksContainer } & ComponentProps<"div">) => {
  const BrickModule = bricksMap[brick.type];
  const { wrapper, ...rest } = brick.props;

  return (
    <Suspense>
      <BrickModule id={brick.id} {...rest} {...otherProps} />
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

const DragabbleBrickWrapperMemo = memo(DragabbleBrickWrapper);
export default DragabbleBrickWrapperMemo;

function DragabbleBrickWrapper({
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

  const onClick = editor.enabled
    ? (e: MouseEvent<HTMLElement>) => {
        e.stopPropagation();
        editor.setSelectedBrick(brick);
      }
    : undefined;

  const { setNodeRef, attributes, listeners, transform, over, active } = useSortable({
    id: brick.id,
    disabled: !editor.enabled || editor.isEditingTextForBrickId === brick.id,
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
            transform: CSS.Transform.toString(transform),
            transformOrigin: "top left",
          }
        : active && over
          ? {
              // Prevent scaling when not over
              transform: CSS.Transform.toString(transform),
              transformOrigin: "top left",
            }
          : {}),
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
      className={tx(
        // DO NOT put transition classes here, they will make it flickering when dragging ends
        "relative cursor-auto focus:cursor-grab group/brick text-left",
        {
          "hover:(outline outline-upstart-200 outline-dotted)": !((active?.id as string) ?? "")?.startsWith(
            "resize-handle",
          ),
        },
        getBrickWrapperClass(brick, containerIndex),
        // used when dragging the row
        placeholder && "opacity-10 grayscale",
        { "&>*:opacity-0 opacity-80": over?.id === brick.id },
      )}
    >
      {active?.id === brick.id ? (
        <BrickPlaceholder brick={brick} container={container} />
      ) : (
        <>
          <MemoBrickComponent brick={brick} container={container} />
          <BrickOptionsButton brick={brick} />
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
    </div>
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

function BrickOptionsButton({ brick }: { brick: Brick }) {
  const [open, setOpen] = useState(false);

  return (
    <DropdownMenu.Root onOpenChange={setOpen}>
      <DropdownMenu.Trigger>
        <div className={tx("absolute right-1.5 top-1")}>
          <IconButton
            onClickCapture={(e) => {
              console.log("btn click", e);
            }}
            variant="soft"
            size="1"
            radius="small"
            className={tx(
              {
                "!opacity-0": !open,
              },
              "transition-all duration-300 group/button bg-upstart-600 group-hover/brick:!opacity-100 active:!opacity-100 focus:!flex focus-within:!opacity-100 !bg-upstart-200/75 hover:!bg-upstart-300 !px-0.5",
            )}
          >
            <BiDotsVerticalRounded className="w-6 h-6 text-upstart-500 group-hover/button:text-upstart-600" />
          </IconButton>
        </div>
      </DropdownMenu.Trigger>
      <DropdownMenu.Content>
        <DropdownMenu.Item
          onClick={(e) => {
            e.stopPropagation();
            console.log("Edit", brick);
          }}
        >
          Resize
        </DropdownMenu.Item>
        <DropdownMenu.Item shortcut="⌘ D">Duplicate</DropdownMenu.Item>
        <DropdownMenu.Separator />
        <DropdownMenu.Item shortcut="⌘ N">Archive</DropdownMenu.Item>

        <DropdownMenu.Sub>
          <DropdownMenu.SubTrigger>More</DropdownMenu.SubTrigger>
          <DropdownMenu.SubContent>
            <DropdownMenu.Item>Move to project…</DropdownMenu.Item>
            <DropdownMenu.Item>Move to folder…</DropdownMenu.Item>

            <DropdownMenu.Separator />
            <DropdownMenu.Item>Advanced options…</DropdownMenu.Item>
          </DropdownMenu.SubContent>
        </DropdownMenu.Sub>

        <DropdownMenu.Separator />
        <DropdownMenu.Item>Share</DropdownMenu.Item>
        <DropdownMenu.Item>Add to favorites</DropdownMenu.Item>
        <DropdownMenu.Separator />
        <DropdownMenu.Item shortcut="⌘ ⌫" color="red">
          Delete
        </DropdownMenu.Item>
      </DropdownMenu.Content>
    </DropdownMenu.Root>
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
        "group !cursor-col-resize absolute z-[9999] text-upstart-400 w-2.5 rounded-sm items-center justify-center shadow-xl",
        // "group-hover:(border border-upstart-400 text-upstart-400)",
        "transition-opacity duration-200 group-hover:(bg-upstart-300 opacity-70) hover:(!opacity-100)",
        {
          "hidden group-hover:(flex flex-col)": !overlay,
          "-right-1.5 top-[10%] bottom-[10%]": !overlay && handleType === "right",
          "-left-1.5 top-[10%] bottom-[10%]": !overlay && handleType === "left",
          "flex flex-col bg-upstart-400": overlay,
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
          "brick rounded overflow-hidden z-[9999] outline outline-upstart-400 shadow-lg bg-white/40 cursor-grabbing transition-all duration-150",
          // "brick rounded overflow-hidden z-[9999] ring ring-upstart-400 ring-opacity-80 ring-offset-3 shadow-lg bg-white/40",
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
  return tx(
    "brick",
    // DO NOT put transition classes here, they will make it flickering when dragging ends
    getBrickDefinedClass(brick),
    // mobile
    "block",
    // large screen
    `@md:(grid grid-cols-subgrid grid-rows-subgrid row-start-${containerIndex + 1} col-start-${brick.position.colStart} col-end-${brick.position.colEnd})`,
  );
}

function getBrickDefinedClass(brick: Brick) {
  return [
    // test of transitions - remove if flickering
    "transition-all duration-300 ease-in-out",

    // end test
    apply(brick.wrapper.baseClasses),
    apply(brick.wrapper.customClasses),
    brick.props.brickRounding as string,
    brick.props.brickPadding ? `brick-p-${brick.props.brickPadding}` : null,
  ];
}
