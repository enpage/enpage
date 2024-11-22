import type { Brick } from "@upstart.gg/sdk/shared/bricks";
import { forwardRef, memo, useRef, useState, type ComponentProps, type MouseEvent } from "react";
import { tx } from "@upstart.gg/style-system/twind";
import { useDraft, useEditor } from "../hooks/use-editor";
import { isEqualWith } from "lodash-es";
import { DropdownMenu, IconButton, Portal } from "@upstart.gg/style-system";
import { BiDotsVerticalRounded } from "react-icons/bi";
import BaseBrick from "~/shared/components/BaseBrick";
import { useBrickWrapperStyle } from "~/shared/hooks/use-brick-style";

const MemoBrickComponent = memo(BaseBrick, (prevProps, nextProps) => {
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

type BrickWrapperProps = ComponentProps<"div"> & {
  brick: Brick;
};

const BrickWrapper = forwardRef<HTMLDivElement, BrickWrapperProps>(
  ({ brick, style, className, children }, ref) => {
    const editor = useEditor();
    const hasMouseMoved = useRef(false);
    const wrapperClass = useBrickWrapperStyle({ brick, editable: true, className });

    const onClick = (e: MouseEvent<HTMLElement>) => {
      const target = e.currentTarget as HTMLElement;
      if (hasMouseMoved.current || target.matches(".react-resizable-handle") || !target.matches(".brick")) {
        return;
      }
      // e.stopPropagation();
      editor.setSelectedBrick(brick);
      hasMouseMoved.current = false;
    };

    return (
      <div
        id={brick.id}
        data-x="0"
        data-y="0"
        data-position={JSON.stringify(brick.position[editor.previewMode])}
        style={style}
        className={wrapperClass}
        ref={ref}
        onClick={onClick}
        onMouseDown={(e) => {
          hasMouseMoved.current = false;
        }}
        onMouseUp={(e) => {
          setTimeout(() => {
            hasMouseMoved.current = false;
          }, 100);
        }}
        onMouseMove={() => {
          hasMouseMoved.current = true;
        }}
      >
        <MemoBrickComponent brick={brick} />
        <BrickOptionsButton brick={brick} />
        {children} {/* Make sure to include children to add resizable handle */}
      </div>
    );
  },
);

const BrickWrapperMemo = memo(BrickWrapper);
export default BrickWrapperMemo;

function BrickOptionsButton({ brick }: { brick: Brick }) {
  const [open, setOpen] = useState(false);
  const draft = useDraft();
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
              "nodrag transition-all duration-300 group/button bg-upstart-600 group-hover/brick:!opacity-100 \
              active:!opacity-100 focus:!flex focus-within:!opacity-100 !bg-upstart-200/75 \
              hover:!bg-upstart-300 !px-0.5",
            )}
          >
            <BiDotsVerticalRounded className="w-6 h-6 text-upstart-500 group-hover/button:text-upstart-600" />
          </IconButton>
        </div>
      </DropdownMenu.Trigger>
      <Portal>
        {/* The "nodrag" class is here to prevent the grid manager
            from handling click event coming from the menu items.
            We still need to stop the propagation for other listeners. */}
        <DropdownMenu.Content className="nodrag">
          <DropdownMenu.Item
            shortcut="⌘D"
            onClick={(e) => {
              e.stopPropagation();
              draft.duplicateBrick(brick.id);
            }}
          >
            Duplicate
          </DropdownMenu.Item>
          <DropdownMenu.Sub>
            <DropdownMenu.SubTrigger>Visible on</DropdownMenu.SubTrigger>
            <DropdownMenu.SubContent>
              <DropdownMenu.CheckboxItem
                checked={!brick.position.mobile?.hidden}
                onClick={(e) => e.stopPropagation()}
                onCheckedChange={() => draft.toggleBrickVisibilityPerBreakpoint(brick.id, "mobile")}
              >
                Mobile
              </DropdownMenu.CheckboxItem>

              <DropdownMenu.CheckboxItem
                checked={!brick.position.desktop?.hidden}
                onClick={(e) => e.stopPropagation()}
                onCheckedChange={() => draft.toggleBrickVisibilityPerBreakpoint(brick.id, "desktop")}
              >
                Desktop
              </DropdownMenu.CheckboxItem>
            </DropdownMenu.SubContent>
          </DropdownMenu.Sub>
          <DropdownMenu.Separator />
          <DropdownMenu.Item
            shortcut="⌫"
            color="red"
            onClick={(e) => {
              e.stopPropagation();
              draft.deleteBrick(brick.id);
            }}
          >
            Delete
          </DropdownMenu.Item>
        </DropdownMenu.Content>
      </Portal>
    </DropdownMenu.Root>
  );
}
