import type { BricksContainer, ContainerVariant } from "~/shared/bricks";
import {
  useState,
  type ComponentProps,
  forwardRef,
  useEffect,
  useRef,
  type PropsWithChildren,
  useCallback,
  useMemo,
  type CSSProperties,
  memo,
} from "react";
import { useSortable, SortableContext, rectSwappingStrategy } from "@dnd-kit/sortable";
import clsx from "clsx";
import { tx, apply } from "@twind/core";
import DragabbleBrickWrapper from "./brick";
import { useDraft, useEditorEnabled } from "./use-editor";
import { CSS } from "@dnd-kit/utilities";
import { Menu, MenuButton, MenuItem, MenuItems, MenuSeparator } from "@headlessui/react";
import { CgArrowsV } from "react-icons/cg";
import { IoSettingsOutline } from "react-icons/io5";

type ContainerProps = PropsWithChildren<
  {
    className?: string;
    style?: CSSProperties;
    dragging?: boolean;
    active?: boolean;
    placeholder?: boolean;
  } & BricksContainer
>;

const MemoDynamicBrick = memo(DragabbleBrickWrapper);

export const Container = forwardRef<HTMLElement, ContainerProps>(
  ({ bricks, variant, className, id, children, dragging, placeholder, hidden, ...props }, ref) => {
    const containerBaseStyles = apply(
      "grid gap-2 relative w-full transition-all duration-300",
      {
        "z-[9999] ring ring-primary-500 ring-opacity-80 ring-offset-3 shadow-lg bg-primary-500 bg-opacity-50":
          dragging,
        "hover:ring hover:ring-primary-500 hover:ring-opacity-80 hover:shadow-lg hover:bg-primary-500 hover:bg-opacity-50":
          !dragging && !placeholder && !hidden,
        "bg-black bg-opacity-20 rounded": placeholder,
        "opacity-50 bg-gray-100 text-xs py-1 text-gray-600 text-center": hidden,
        "h-48": !hidden,
      },
      !hidden && getContainerClasses(variant),
    );

    if (hidden) {
      return (
        <section
          ref={ref}
          data-container-id={id}
          className={clsx(tx(containerBaseStyles, className), "brick")}
        >
          Hidden row
        </section>
      );
    }

    if (placeholder) {
      return <section ref={ref} data-container-id={id} className={tx(containerBaseStyles, className)} />;
    }

    return (
      <section ref={ref} data-container-id={id} className={tx(containerBaseStyles, className)} {...props}>
        {bricks.map((child, index) => (
          <MemoDynamicBrick
            key={child.props.id}
            className={tx(apply(getColClasses(index, variant)), child.props.className)}
            {...child}
          />
        ))}
        {children}
        {dragging && <ContainerDragHandle forceVisible />}
      </section>
    );
  },
);

export function SortableContainer(props: ContainerProps) {
  const { children, className, ...container } = props;
  const { setNodeRef, setActivatorNodeRef, attributes, listeners, transition, transform, over, active } =
    useSortable({
      id: props.id,
      data: { type: "container" },
      transition: {
        duration: 250, // milliseconds
        easing: "cubic-bezier(0.25, 0.1, 0.25, 1)",
      },
    });

  const style = {
    transition,
    transform: CSS.Transform.toString(transform),
  };

  return (
    <Container
      ref={setNodeRef}
      className={tx(apply("relative touch-none group"), className)}
      placeholder={active?.data.current?.type === "container" && over?.id === props.id}
      style={style}
      {...container}
      {...attributes}
    >
      {!active && <ContainerDragHandle {...listeners} ref={setActivatorNodeRef} />}
      {!active && <ContainerMenu container={container} bricksCount={container.bricks.length} />}
    </Container>
  );
}

type ContainerListProps = {
  containers: BricksContainer[];
};

export function ContainerList(props: ContainerListProps) {
  const editorEnabled = useEditorEnabled();

  if (!editorEnabled) {
    return props.containers.map((container) => <Container {...container} key={container.id} />);
  }

  return props.containers.map((container) => <SortableContainer {...container} key={container.id} />);
}

function getColClasses(index: number, variant: ContainerVariant) {
  let colSpan = "col-span-1";
  if (
    (variant === "1-2" && index === 1) ||
    (variant === "2-1" && index === 0) ||
    (variant === "1-1-2" && index === 2) ||
    (variant === "1-2-1" && index === 1) ||
    (variant === "2-1-1" && index === 0)
  ) {
    colSpan = "col-span-2";
  } else if ((variant === "1-3" && index === 1) || (variant === "3-1" && index === 0)) {
    colSpan = "col-span-3";
  }
  return clsx("bg-gray-200", colSpan);
}

function getContainerClasses(variant: ContainerVariant) {
  return {
    "grid-cols-1": variant === "full",
    "grid-cols-2": variant === "1-1",
    "grid-cols-3": variant === "1-1-1" || variant === "1-2" || variant === "2-1",
    "grid-cols-4":
      variant === "1-1-1-1" ||
      variant === "1-1-2" ||
      variant === "2-2" ||
      variant === "1-2-1" ||
      variant === "2-1-1",
  };
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
          "top-1/2 -translate-y-1/2 ",
          "text-white shadow-sm absolute transition-opacity duration-300 \
          -left-8 h-8 w-8 bg-primary-400 hover:bg-primary-500 opacity-0 rounded-l flex items-center justify-center cursor-grab",
          "group-hover:(opacity-100) hover:opacity-100 border-2 border-primary-400 hover:border-primary-400 ",
          { "opacity-100": forceVisible },
        ),
      )}
      {...props}
    >
      <CgArrowsV className={tx("w-5 h-5 mx-auto select-none")} />
    </div>
  );
});

type ContainerMenuProps = {
  container: BricksContainer;
  forceVisible?: boolean;
  bricksCount: number;
};

function computeNextVariant(variant: ContainerVariant): ContainerVariant | undefined {
  switch (variant) {
    case "full":
      return "1-1";
    case "1-1":
      return "1-1-1";
    case "1-1-1":
      return "1-1-1-1";
    case "1-2":
      return "1-1-2";
    case "2-1":
      return "1-2-1";
  }
}

function ContainerMenu({ forceVisible, bricksCount, container }: ContainerMenuProps) {
  const draft = useDraft();

  const addColumn = useCallback(() => {
    const newVariant = computeNextVariant(container.variant);
    if (newVariant) draft.updateContainer(container.id, { variant: newVariant });
  }, [container, draft]);

  return (
    <Menu>
      <MenuButton
        className={clsx(
          "container-menu-button",
          tx(
            "top-1/2 -translate-y-1/2 mt-10",
            "text-white shadow-sm absolute transition-opacity duration-300 \
            -left-8 h-8 w-8 bg-primary-400 hover:bg-primary-500 opacity-0 rounded-l flex items-center justify-center",
            "group-hover:(opacity-100) hover:opacity-100 border-2 border-primary-400 hover:border-primary-400 ",
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
