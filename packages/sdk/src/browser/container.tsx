import type { BricksContainer } from "~/shared/bricks";
import {
  useState,
  forwardRef,
  useEffect,
  type PropsWithChildren,
  useCallback,
  type CSSProperties,
  memo,
} from "react";
import { useSortable } from "@dnd-kit/sortable";
import clsx from "clsx";
import { tx, apply, css, tw } from "./twind";
import DragabbleBrickWrapper from "./brick";
import { useDraft, useEditorEnabled } from "./use-editor";
import { CSS } from "@dnd-kit/utilities";
import { Menu, MenuButton, MenuItem, MenuItems, MenuSeparator } from "@headlessui/react";
import { IoSettingsOutline } from "react-icons/io5";
import { useDndContext } from "@dnd-kit/core";
import { PiArrowsOutLineVertical } from "react-icons/pi";

type ContainerProps = PropsWithChildren<
  {
    containerIndex: number;
    className?: string;
    style?: CSSProperties;
    overlay?: boolean;
    active?: boolean;
    placeholder?: boolean;
    resizing?: boolean;
  } & { container: BricksContainer }
>;

export const Container = forwardRef<HTMLElement, ContainerProps>(
  ({ container, containerIndex, className, children, overlay, placeholder, resizing, ...props }, ref) => {
    const { bricks, id, hidden } = container;
    const containerBaseStyles = apply(
      "brick-container relative transition-all duration-100 max-sm:(flex flex-col gap-y-1)",

      {
        "rounded z-[9999] ring ring-primary-200 ring-offset-4 shadow-xl bg-primary-500 bg-opacity-30":
          overlay,
        "hasChildMenudHover:(rounded outline outline-2 outline-primary-200/70 outline-offset-4 outline-dashed z-50)":
          !overlay && !placeholder && !hidden && !resizing,

        // "bg-black/50 rounded": placeholder,
        "opacity-50 bg-gray-100 text-xs py-1 text-gray-600 text-center": hidden,
        "h-auto": !hidden && !props.style?.height,
      },
      // Overlays are rendered outside the main page (outside the grid), so we need to set the grid here
      overlay &&
        css({
          gridTemplateColumns: "repeat(12, 1fr)",
          gridTemplateRows: "auto",
        }),
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
            brick={brick}
            container={container}
            brickIndex={brickIndex}
            containerIndex={containerIndex}
            placeholder={placeholder}
          />
        ))}
        {children}
        {overlay && (
          /* repeat the container menu because it would disapear while dragging */
          <div
            className={tx(
              "absolute border-8 border-y-0 border-transparent p-2 opacity-0 \
            group-hover:(opacity-100) hover:(!opacity-100) -right-14 -top-1 rounded overflow-hidden bg-gray-100 w-12 \
            flex flex-col gap-2 items-center justify-start",
            )}
          >
            <ContainerDragHandle forceVisible />
            <ContainerMenu forceVisible container={{ id, bricks, type: "container" }} bricksCount={1} />
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

const SortableContainerMemo = memo(SortableContainer);

function SortableContainer(props: ContainerProps) {
  const { className, container, containerIndex } = props;
  // compute the effective container height once mounted
  const [containerHeight, setContainerHeight] = useState<number | "auto">("auto");

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
      over?.id === props.container.id
        ? CSS.Transform.toString(transform ? { ...transform, scaleY: 1 } : null)
        : CSS.Transform.toString(transform),
    // maintain a fixed height while dragging to avoid layout shift
    ...(active ? { height: `${containerHeight === "auto" ? "auto" : `${containerHeight}px`}` } : {}),
  };

  // Always update the container height when the container is mounted
  useEffect(() => {
    const el = document.getElementById(container.id);
    const tmt = setInterval(() => {
      if (el?.offsetHeight) setContainerHeight(el?.offsetHeight ?? 0);
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
      resizing={active?.id.toString().startsWith("resize-handle")}
      {...attributes}
    >
      {!active && (
        /* Wrapper for container menu */
        <div
          className={tx(
            "container-menu-wrapper absolute border-8 border-y-0 border-transparent duration-200 p-2 opacity-0 \
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
    <SortableContainerMemo container={container} containerIndex={index} key={container.id} />
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

type ContainerMenuProps = {
  container: BricksContainer;
  forceVisible?: boolean;
  bricksCount: number;
};

function ContainerMenu({ forceVisible, bricksCount, container }: ContainerMenuProps) {
  const draft = useDraft();

  // biome-ignore lint/correctness/useExhaustiveDependencies: not important
  const addColumn = useCallback(() => {
    // todo: implement addColumn
    // const newVariant = computeNextVariant(container.variant);
    // if (newVariant) {
    //   draft.updateContainer(container.id, {
    //     variant: newVariant,
    //     bricks: [
    //       ...container.bricks,
    //       {
    //         id: `brick-${generateId()}`,
    //         type: "text",
    //         props: {
    //           content: "New brick content",
    //         },
    //         wrapper: {},
    //         position: {
    //           //todo: compute the correct colStart and colEnd
    //           colStart: container.bricks.length,
    //           colEnd: container.bricks.length + 1,
    //         },
    //       },
    //     ],
    //   });
    // }
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
          "bg-white min-w-[9rem] z-[9999] flex flex-col shadow-xl text-sm border border-gray-200 rounded overflow-hidden text-gray-700",
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
