import type { Brick } from "~/shared/bricks";
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
import { tx, style, css, apply } from "./twind";
import { useAttributes, useDraft, useEditor, useEditorEnabled } from "./use-editor";
import { isEqualWith } from "lodash-es";
import { DropdownMenu, Button, IconButton, Portal } from "@enpage/style-system";
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
  translation?: {
    x: number;
    y: number;
  };
};

const BrickWrapper = forwardRef<HTMLDivElement, BrickWrapperProps>(
  ({ brick, style, className, onMouseDown, onMouseUp, onTouchEnd, children, translation, ...props }, ref) => {
    const editor = useEditor();
    const hasMouseMoved = useRef(false);
    const [initialTransation, setInitialTranslation] = useState(style?.transform);

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

    // override "transfrom" translate style when translation is passed. We should add the translation to the existing transform
    // if there is any
    if (translation && style?.transform) {
      // parse existing transform
      const existingTranslateValues = style.transform.match(/-?\d+/g);
      const existingTranslateX = parseFloat(existingTranslateValues?.[0] ?? "0");
      const existingTranslateY = parseFloat(existingTranslateValues?.[1] ?? "0");

      console.log("base trasnform", style.transform);
      console.log("existingTranslateX", existingTranslateX);
      console.log("existingTranslateY", existingTranslateY);

      // calculate new translate values
      const newTranslateX = existingTranslateX + translation.x;
      const newTranslateY = existingTranslateY + translation.y;

      // create new transform value
      const newTranslate = `translate(${newTranslateX}px, ${newTranslateY}px)`;

      console.log("newTranslate", newTranslate);

      style.transform = newTranslate;
    }

    return (
      <div
        data-translation={initialTransation}
        id={brick.id}
        style={style}
        className={tx(
          "brick group/brick flex select-none",
          "group-hover/page:(outline outline-dashed outline-upstart-100)",
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
        {translation && <span>FOOOO {JSON.stringify(translation)}</span>}
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
              {attributes.$tabletBreakpointEnabled && (
                <DropdownMenu.CheckboxItem
                  checked={!brick.position.tablet?.hidden}
                  onClick={(e) => e.stopPropagation()}
                  onCheckedChange={() => draft.toggleBrickVisibilityPerBreakpoint(brick.id, "tablet")}
                >
                  Tablet
                </DropdownMenu.CheckboxItem>
              )}
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
