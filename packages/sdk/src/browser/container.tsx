import type { BricksContainer, ContainerVariant } from "~/shared/bricks";
import {
  useState,
  forwardRef,
  useEffect,
  type PropsWithChildren,
  useCallback,
  type CSSProperties,
} from "react";
import { useSortable } from "@dnd-kit/sortable";
import clsx from "clsx";
import { tx, apply, css } from "@twind/core";
import DragabbleBrickWrapper, { getBrickWrapperClass } from "./brick";
import { useDraft, useEditorEnabled } from "./use-editor";
import { CSS } from "@dnd-kit/utilities";
import { Menu, MenuButton, MenuItem, MenuItems, MenuSeparator } from "@headlessui/react";
import { IoSettingsOutline } from "react-icons/io5";
import { useDndContext } from "@dnd-kit/core";
import { generateId } from "./bricks/common";
import { PiArrowsOutLineVertical } from "react-icons/pi";

type ContainerProps = PropsWithChildren<
  {
    containerIndex: number;
    className?: string;
    style?: CSSProperties;
    overlay?: boolean;
    active?: boolean;
    placeholder?: boolean;
  } & { container: BricksContainer }
>;

export const Container = forwardRef<HTMLElement, ContainerProps>(
  ({ container, containerIndex, className, children, overlay, placeholder, ...props }, ref) => {
    const { active, over } = useDndContext();
    const { bricks, variant, id, hidden } = container;
    const containerBaseStyles = apply(
      "brick-container relative w-full transition-all duration-300",
      {
        "rounded z-[9999] ring ring-primary-200 ring-offset-4 shadow-xl bg-primary-500 bg-opacity-30":
          overlay,
        "hover:(rounded ring ring-primary-100 ring-offset-4)": !overlay && !placeholder && !hidden,
        // "bg-black/50 rounded": placeholder,
        "opacity-50 bg-gray-100 text-xs py-1 text-gray-600 text-center": hidden,
        "h-auto": !hidden && !props.style?.height,
      },
      overlay &&
        css({
          gridTemplateColumns: "repeat(12, 1fr)",
          gridTemplateRows: "auto",
        }),
      // !hidden && getContainerClasses(variant),
    );

    if (hidden) {
      return (
        <HiddenContainer
          ref={ref}
          id={id}
          className={clsx(tx(containerBaseStyles, className), "brick justify-center h-12")}
        />
      );
    }

    return (
      <section
        ref={ref}
        id={overlay ? `overlay-${id}` : id}
        className={tx(containerBaseStyles, className)}
        {...props}
      >
        {bricks.map((brick, brickIndex) => (
          <DragabbleBrickWrapper
            key={brick.id}
            className={tx(
              getBrickWrapperClass(brick, brickIndex, container.bricks.length, overlay ? 0 : containerIndex),
              placeholder && "opacity-10 grayscale",
            )}
            brick={brick}
            container={container}
            placeholder={placeholder}
          />
        ))}
        {children}
        {overlay && (
          /* repeat the container menu because it would disapear while dragging */
          <div
            className={tx(
              "absolute border-8 border-y-0 border-transparent transition-all duration-300 p-2 \
              group-hover:(opacity-100) -right-14 top-0 rounded-r overflow-hidden bg-gray-100 w-12 bottom-0 \
              flex flex-col gap-2 items-center justify-center",
            )}
          >
            <ContainerDragHandle forceVisible />
            <ContainerMenu
              forceVisible
              container={{ id, bricks, variant, type: "container" }}
              bricksCount={1}
            />
          </div>
        )}
      </section>
    );
  },
);

const HiddenContainer = forwardRef<HTMLElement, Pick<HTMLDivElement, "id" | "className">>(
  ({ className, id, ...props }, ref) => {
    const draft = useDraft();
    const [text, setText] = useState("Hidden container");
    const [over, setOver] = useState(false);

    useEffect(() => {
      setText(over ? "Click to show" : "Hidden container");
    }, [over]);

    return (
      <section
        ref={ref}
        id={id}
        className={className}
        onMouseOver={() => setOver(true)}
        onFocus={() => setOver(true)}
        onMouseLeave={() => setOver(false)}
        onBlur={() => setOver(false)}
        {...props}
      >
        <button type="button" onClick={() => draft.toggleContainerVisibility(id)}>
          {text}
        </button>
      </section>
    );
  },
);

export function SortableContainer(props: ContainerProps) {
  const { className, container, containerIndex, overlay: dragging } = props;
  // compute the effective container height once mounted
  const [containerHeight, setContainerHeight] = useState(0);
  const dndCtx = useDndContext();

  const { setNodeRef, setActivatorNodeRef, attributes, listeners, transition, transform, over, active } =
    useSortable({
      id: container.id,
      data: { type: "container" },
      transition: {
        duration: 250, // milliseconds
        easing: "cubic-bezier(0.25, 0.1, 0.25, 1)",
      },
    });

  const style = {
    transition,
    transform:
      dndCtx.over?.id === props.container.id
        ? CSS.Transform.toString(transform ? { ...transform, scaleY: 1 } : null)
        : CSS.Transform.toString(transform),
    // maintain a fixed height while dragging to avoid layout shift
    ...(dndCtx.active && containerHeight > 0
      ? { height: `${containerHeight}px`, minHeight: `${containerHeight}px` }
      : {}),
  };

  // Always update the container height when the container is mounted
  useEffect(() => {
    // const observer = new MutationObserver(() => {
    //   const el = document.getElementById(container.id);
    //   setContainerHeight(el?.offsetHeight ?? 0);
    // });

    // observer.observe(document.body, { childList: true, subtree: true });
    // return () => observer.disconnect();

    const el = document.getElementById(container.id);
    const tmt = setInterval(() => {
      setContainerHeight(el?.offsetHeight ?? 0);
    }, 333);
    return () => clearInterval(tmt);
  }, [container.id]);

  return (
    <Container
      ref={setNodeRef}
      className={tx(apply("relative touch-none group"), className)}
      placeholder={active?.data.current?.type === "container" && active?.id === container.id}
      style={style}
      containerIndex={containerIndex}
      container={container}
      {...attributes}
    >
      {!active && (
        /* Wrapper for container menu */
        <div
          className={tx(
            "absolute border-8 border-y-0 border-transparent transition-all duration-300 p-2 opacity-0 \
            group-hover:(opacity-100) hover:(!opacity-100) -right-14 -top-1 rounded overflow-hidden bg-gray-100 w-12 \
            flex flex-col gap-2 items-center justify-start",
          )}
        >
          <ContainerDragHandle {...listeners} ref={setActivatorNodeRef} />
          <ContainerMenu container={container} bricksCount={container.bricks.length} />
        </div>
      )}
    </Container>
  );
}

type ContainerListProps = {
  containers: BricksContainer[];
};

export function ContainerList(props: ContainerListProps) {
  const editorEnabled = useEditorEnabled();

  if (!editorEnabled) {
    return props.containers.map((container, index) => (
      <Container container={container} containerIndex={index} key={container.id} />
    ));
  }

  return props.containers.map((container, index) => (
    <SortableContainer container={container} containerIndex={index} key={container.id} />
  ));
}

type ContainerDragHandleProps = {
  forceVisible?: boolean;
};

const ContainerDragHandle = forwardRef<HTMLDivElement, ContainerDragHandleProps>(function ContainerDragHandle(
  { forceVisible, ...props },
  ref,
) {
  return (
    <div
      ref={ref}
      className={clsx(
        "container-handle",
        tx(
          "text-white shadow-sm transition-opacity duration-300 \
          -left-8 h-8 w-8 bg-primary-400 hover:bg-primary-500 rounded flex items-center justify-center cursor-grab",
          "group-hover:(opacity-70) hover:!opacity-100 border-2 border-primary-400 hover:border-primary-400 ",
          { "opacity-100": forceVisible },
        ),
      )}
      {...props}
    >
      <PiArrowsOutLineVertical className={tx("w-5 h-5 mx-auto select-none")} />
    </div>
  );
});

function computeNextVariant(variant: ContainerVariant): ContainerVariant | undefined {
  switch (variant) {
    case "full":
      return "1-1";
    case "1-1":
      return "1-1-1";
    case "1-1-1":
    case "1-1-2":
    case "1-2-1":
    case "2-1-1":
      return "1-1-1-1";
    case "1-2":
      return "1-1-2";
    case "2-1":
      return "1-2-1";
  }
}

type ContainerMenuProps = {
  container: BricksContainer;
  forceVisible?: boolean;
  bricksCount: number;
};

function ContainerMenu({ forceVisible, bricksCount, container }: ContainerMenuProps) {
  const draft = useDraft();

  const addColumn = useCallback(() => {
    const newVariant = computeNextVariant(container.variant);
    if (newVariant) {
      draft.updateContainer(container.id, {
        variant: newVariant,
        bricks: [
          ...container.bricks,
          {
            id: `brick-${generateId()}`,
            type: "text",
            props: {
              content: "New brick content",
            },
            wrapper: {},
          },
        ],
      });
    }
  }, [container, draft]);

  return (
    <Menu>
      <MenuButton
        className={clsx(
          "container-menu-button",
          tx(
            "text-white shadow-sm transition-opacity duration-300 \
            -left-8 h-8 w-8 bg-primary-400 hover:bg-primary-500 rounded flex items-center justify-center",
            "group-hover:(opacity-70) hover:!opacity-100 border-2 border-primary-400 hover:border-primary-400 ",
            { "opacity-100": forceVisible },
          ),
        )}
      >
        <IoSettingsOutline className={tx("w-5 h-5 mx-auto select-none")} />
      </MenuButton>
      <MenuItems
        anchor="bottom"
        className={tx(
          "bg-white min-w-[9rem] flex flex-col shadow-xl text-sm border border-gray-200 rounded overflow-hidden text-gray-700",
        )}
      >
        <MenuItem
          as="button"
          className={tx("px-2 py-1.5 block hover:bg-primary-100 text-left")}
          onClick={() => draft.toggleContainerVisibility(container.id)}
        >
          {container.hidden ? "Show" : "Hide"} container
        </MenuItem>
        <MenuItem
          as="button"
          className={tx("px-2 py-1.5 block hover:bg-primary-100 text-left")}
          onClick={() => draft.deleteContainer(container.id)}
        >
          Delete row
        </MenuItem>
        {bricksCount < 4 && (
          <>
            <MenuSeparator className={tx("my-1 h-px bg-gray-200")} />
            <MenuItem
              as="button"
              className={tx("px-2 py-1.5 block hover:bg-primary-100 text-left")}
              onClick={() => addColumn()}
            >
              Add column
            </MenuItem>
          </>
        )}
      </MenuItems>
    </Menu>
  );
}

export default Container;
