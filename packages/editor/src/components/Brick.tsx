import type { Brick } from "@enpage/sdk/shared/bricks";
import {
  forwardRef,
  lazy,
  memo,
  Suspense,
  useEffect,
  useRef,
  useState,
  type ComponentProps,
  type ComponentType,
  type LazyExoticComponent,
  type MouseEvent,
} from "react";
import { tx, style, css, apply } from "@enpage/style-system/twind";
import { useAttributes, useDraft, useEditor, useEditorEnabled } from "../hooks/use-editor";
import { isEqualWith } from "lodash-es";
import { DropdownMenu, Button, IconButton, Portal } from "@enpage/style-system";
import { BiDotsVerticalRounded } from "react-icons/bi";

const BrickText = lazy(() => import("../bricks/text"));
const BrickHero = lazy(() => import("../bricks/hero"));
const BrickImage = lazy(() => import("../bricks/image"));

// biome-ignore lint/suspicious/noExplicitAny: <explanation>
const bricksMap: Record<string, LazyExoticComponent<ComponentType<any>>> = {
  text: BrickText,
  hero: BrickHero,
  image: BrickImage,
};

const BrickComponent = ({ brick, ...otherProps }: { brick: Brick } & ComponentProps<"div">) => {
  const BrickModule = bricksMap[brick.type];

  if (!BrickModule) {
    return null;
  }

  const { wrapper, ...rest } = brick.props;

  return (
    <Suspense>
      <BrickModule id={brick.id} {...rest} {...otherProps} textEditable={true} />
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

type BrickWrapperProps = ComponentProps<"div"> & {
  brick: Brick;
};

const BrickWrapper = forwardRef<HTMLDivElement, BrickWrapperProps>(
  ({ brick, style, className, onMouseDown, onMouseUp, onTouchEnd, children }, ref) => {
    const editor = useEditor();
    const hasMouseMoved = useRef(false);

    const onClick = (e: MouseEvent<HTMLElement>) => {
      const target = e.target as HTMLElement;
      if (
        hasMouseMoved.current ||
        target.matches(".react-resizable-handle") ||
        !target.matches(".brick") ||
        !target.closest(".brick")
      ) {
        return;
      }
      e.stopPropagation();
      editor.setSelectedBrick(brick);
      hasMouseMoved.current = false;
    };

    // used to translate groups of bricks
    // if (translation && style) {
    //   style.transform = mergeTranslations(
    //     originalTranslation,
    //     `translate(${translation.x}px, ${translation.y}px)`,
    //   );
    // }

    return (
      <div
        id={brick.id}
        style={style}
        className={tx(
          "brick group/brick flex select-none",
          "group-hover/page:(outline outline-dashed outline-upstart-100)",
          "hover:z-[9999] hover:shadow-lg",
          className,
          css({
            "&.selected": {
              outline: "2px dotted var(--violet-8) !important",
            },
          }),
        )}
        ref={ref}
        onClick={onClick}
        onMouseDown={(e) => {
          hasMouseMoved.current = false;
          onMouseDown?.(e);
        }}
        onMouseUp={(e) => {
          onMouseUp?.(e);
          setTimeout(() => {
            hasMouseMoved.current = false;
          }, 150);
        }}
        onMouseMove={() => {
          hasMouseMoved.current = true;
        }}
        onTouchEnd={onTouchEnd}
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
  const attributes = useAttributes();

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