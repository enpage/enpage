import type { Brick } from "~/shared/bricks";
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

const BrickComponent = ({ brick, ...otherProps }: { brick: Brick } & ComponentProps<"div">) => {
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

// function BrickWrapper({
//   className,
//   brick,
//   brickIndex,
//   placeholder,
//   ...wrapperAttrs
// }: {
//   brick: Brick;
//   brickIndex: number;
//   placeholder?: boolean;
// } & ComponentProps<"div">) {
//   const editor = useEditor();

//   const onClick = editor.enabled
//     ? (e: MouseEvent<HTMLElement>) => {
//         console.log("selecting brick", brick.id);
//         e.stopPropagation();
//         editor.setSelectedBrick(brick);
//       }
//     : undefined;

//   return (
//     <div
//       id={brick.id}
//       {...wrapperAttrs}
//       onClick={onClick}
//       className={tx(
//         // DO NOT put transition classes here, they will make it flickering when dragging ends
//         "relative cursor-auto focus:cursor-grab group/brick text-left",
//         // used when dragging the row
//         placeholder && "opacity-10 grayscale",
//       )}
//     >
//       <MemoBrickComponent brick={brick} />
//     </div>
//   );
// }

type BrickWrapperProps = ComponentProps<"div"> & {
  brick: Brick;
};

const BrickWrapper = forwardRef<HTMLDivElement, BrickWrapperProps>(
  ({ brick, style, className, onMouseDown, onMouseUp, onTouchEnd, children, ...props }, ref) => {
    const editor = useEditor();
    const onClick = editor.enabled
      ? (e: MouseEvent<HTMLElement>) => {
          const target = e.target as HTMLElement;
          if (target.matches(".react-resizable-handle")) {
            console.log("ignoring click on resizable handle", target);
            return;
          }
          console.log("selecting brick", brick.id, e);
          e.stopPropagation();
          editor.setSelectedBrick(brick);
        }
      : undefined;

    return (
      <div
        id={brick.id}
        style={style}
        className={tx(
          "brick group/brick flex select-none",
          "group-hover/page:(outline outline-dashed outline-upstart-100)",
          className,
          !!brick.props.brickPadding && `brick-p-${brick.props.brickPadding}`,
        )}
        ref={ref}
        // onClick={onClick}
        onMouseDown={onMouseDown}
        onMouseUp={onMouseUp}
        onTouchEnd={onTouchEnd}
      >
        <MemoBrickComponent brick={brick} />
        {children} {/* Make sure to include children to add resizable handle */}
      </div>
    );
  },
);

const BrickWrapperMemo = memo(BrickWrapper);
export default BrickWrapperMemo;

// function DraggableBrickResizeHanlde({
//   brick,
//   brickIndex,
//   containerIndex,
//   handleType,
// }: { brick: Brick; brickIndex: number; containerIndex: number; handleType: "left" | "right" }) {
//   // Drag resize handle
//   const { attributes, listeners, setNodeRef, transform } = useDraggable({
//     id: `resize-handle-${handleType}-${brick.id}`,
//     data: { type: "resize-handle", brick, brickIndex, containerIndex },
//   });

//   const style = transform
//     ? {
//         transform: `translate3d(${transform.x}px, 0px, 0)`,
//       }
//     : undefined;

//   return (
//     <BrickResizeHandle
//       ref={setNodeRef}
//       id={`resize-handle-${handleType}-${brick.id}`}
//       data-brick-id={brick.id}
//       data-brick-index={brickIndex}
//       data-brick-col-start={brick.position.colStart}
//       data-brick-col-end={brick.position.colEnd}
//       handleType={handleType}
//       {...style}
//       {...attributes}
//       {...listeners}
//     />
//   );
// }

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

// export const BrickResizeHandle = forwardRef<
//   HTMLDivElement,
//   ComponentProps<"div"> & { overlay?: boolean; handleType: "left" | "right" }
// >(({ className, overlay, handleType, ...attrs }, ref) => {
//   return (
//     <div
//       ref={ref}
//       {...attrs}
//       className={tx(
//         "group !cursor-col-resize absolute z-[9999] text-upstart-400 w-2.5 rounded-sm items-center justify-center shadow-xl",
//         // "group-hover:(border border-upstart-400 text-upstart-400)",
//         "transition-opacity duration-200 group-hover:(bg-upstart-300 opacity-70) hover:(!opacity-100)",
//         {
//           "hidden group-hover:(flex flex-col)": !overlay,
//           "-right-1.5 top-[10%] bottom-[10%]": !overlay && handleType === "right",
//           "-left-1.5 top-[10%] bottom-[10%]": !overlay && handleType === "left",
//           "flex flex-col bg-upstart-400": overlay,
//         },
//         className,
//       )}
//     >
//       <RxDragHandleDots2 className="w-4 h-auto group-hover:inline hidden text-white drop-shadow-sm" />
//     </div>
//   );
// });

// export function BrickPlaceholder({ brick, container }: { brick: Brick; container: BricksContainer }) {
//   return (
//     /* Put the brick component so it takes its natural place but don't show it */
//     <div className={tx("flex-1 shrink-0 opacity-0")}>
//       <MemoBrickComponent brick={brick} container={container} />
//     </div>
//   );
// }
