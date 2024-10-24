import { tx, css } from "./twind";
import { useCallback, useEffect, useMemo, useRef, useState, type DOMAttributes } from "react";
import { GRID_COLS, type Brick, type BricksContainer } from "~/shared/bricks";
import Container, { ContainerList } from "./container";
import { useDraft, useEditor, useEditorEnabled } from "./use-editor";
import { useOnClickOutside, useScrollLock } from "usehooks-ts";
import {
  arraySwap,
  SortableContext,
  rectSwappingStrategy,
  verticalListSortingStrategy,
  horizontalListSortingStrategy,
} from "@dnd-kit/sortable";
import {
  DndContext,
  DragOverlay,
  PointerSensor,
  useSensor,
  type DragStartEvent,
  type Active,
  type DragOverEvent,
  type Over,
  type DragEndEvent,
  type CollisionDetection,
  pointerWithin,
  rectIntersection,
  type Modifier,
  type DragMoveEvent,
} from "@dnd-kit/core";
import { restrictToHorizontalAxis, restrictToVerticalAxis, createSnapModifier } from "@dnd-kit/modifiers";
import { BrickOverlay, BrickResizeHandle } from "./brick";
import { createPortal } from "react-dom";
import { useHotkeys } from "react-hotkeys-hook";

export default function Page(props: { initialContainers?: BricksContainer[]; onMount?: () => void }) {
  const editorEnabled = useEditorEnabled();
  const editor = useEditor();
  const draft = useDraft();
  const pageRef = useRef<HTMLDivElement>(null);
  const resizingRef = useRef<{
    brickId: Brick["id"];
    resizeBy: number;
    handle: "left" | "right";
  } | null>(null);

  const [gridColSize, setGridColSize] = useState(1280 / 12);
  const { lock, unlock } = useScrollLock({
    autoLock: false,
  });

  useOnClickOutside(pageRef, (e) => {
    const event = e as MouseEvent;
    const elementAtPoint = document.elementFromPoint(event.clientX, event.clientY) as HTMLElement;
    if (
      !elementAtPoint.closest("[data-radix-popper-content-wrapper]") &&
      !elementAtPoint.closest("#floating-panel")
    ) {
      console.info("deselecting brick because user clicked outside");
      editor.deselectBrick();
    }
  });

  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(() => {
    // compute the grid col size from the pageRef width / 12
    if (pageRef.current) {
      setGridColSize(pageRef.current.clientWidth / 12);
      props.onMount?.();
    }
  }, []);

  useHotkeys("mod+c", () => {
    // let the browser handle the copy event
    const sel = window.getSelection();
    if (!sel?.rangeCount) {
      console.log("mod+c pressed");
    }
  });

  const sensors = [
    useSensor(PointerSensor, {
      activationConstraint: {
        // Require pointer to move by 5 pixels before activating draggable
        // Allows nested onClicks/buttons/interactions to be accessed
        distance: 5,
      },
    }),
  ];

  const dragTypeRef = useRef<BricksContainer["type"] | Brick["type"] | "resize-handle">("container");

  const [activeElement, setActiveElement] = useState<{
    type: "container" | "brick" | "resize-handle";
    id: string;
    rect?: DOMRect;
    attributes: Record<string, string>;
  } | null>(null);

  const containers = useMemo(() => {
    return editorEnabled ? draft.containers : props.initialContainers ?? [];
  }, [editorEnabled, props.initialContainers, draft.containers]);

  const snapToGrid: Modifier = useCallback(
    ({ transform }) => {
      return {
        x: Math.round(transform.x / gridColSize) * gridColSize,
        y: 0,
        scaleX: transform.scaleX,
        scaleY: 1,
      };
    },
    [gridColSize],
  );

  const restrictToBounds: Modifier = useCallback(
    ({ transform }) => {
      if (!activeElement) {
        return transform;
      }

      const brickId = activeElement.id.replace(/resize-handle-(left|right)-/, "");
      const isLeftHandle = activeElement.id.includes("left");

      // we want to restrict dragging the resize handle up to the previous or next brick
      // for this, we have to find the related prev and next brick

      // first find which container the activeElement belongs to
      const container = containers.find((ct) => ct.bricks.some((b) => b.id === brickId));
      if (!container) {
        return transform;
      }

      // find the activeElement brick index
      const activeBrick = container.bricks.find((b) => b.id === brickId);
      const activeBrickIndex = container.bricks.findIndex((b) => b.id === brickId);

      if (!activeBrick || activeBrickIndex === -1) {
        return transform;
      }

      // find the prev and next bricks
      const prevBrick = container.bricks[activeBrickIndex - 1];
      const nextBrick = container.bricks[activeBrickIndex + 1];

      // get the end column index of the prev brick
      const currentCol = isLeftHandle ? activeBrick.position.colStart : activeBrick.position.colEnd;

      const minCol = isLeftHandle
        ? prevBrick?.position.colStart
          ? prevBrick.position.colStart + 1
          : 1
        : activeBrick?.position.colStart + 1;

      // get the start column index of the next brick
      const maxCol = isLeftHandle
        ? activeBrick.position.colEnd - 1
        : nextBrick
          ? nextBrick.position.colEnd - 1
          : GRID_COLS + 1;

      // get delta from current col to the min and max cols
      const minColDelta = (minCol - currentCol) * gridColSize;
      const maxColDelta = (maxCol - currentCol) * gridColSize;
      const computedCol = Math.round(transform.x / GRID_COLS) * GRID_COLS;

      return {
        ...transform,
        x: Math.max(minColDelta, Math.min(maxColDelta, computedCol)),
        y: 0,
      };
    },
    [containers, activeElement, gridColSize],
  );

  const getActiveElementData = useCallback(() => {
    if (!activeElement) {
      return null;
    }
    if (activeElement.type === "container") {
      return {
        container: containers.find((ct) => ct.id === activeElement.id),
      };
    }
    for (const container of containers) {
      const brick = container.bricks.find((b) => b.id === activeElement.id);
      if (brick) {
        return { brick, container };
      }
    }
  }, [activeElement, containers]);

  const getActiveContainerIndex = useCallback(() => {
    if (!activeElement) {
      return 0;
    }
    return containers.findIndex((ct) => ct.id === activeElement.id) ?? 0;
  }, [activeElement, containers]);

  const handleDragEnd = useCallback(
    (props: DragEndEvent) => {
      unlock();
      const { active, over } = props;

      setActiveElement(null);

      if (resizingRef.current) {
        const brickId = resizingRef.current?.brickId;
        const isLeftHandle = resizingRef.current?.handle === "left";

        // first find which container the activeElement belongs to
        const container = containers.find((ct) => ct.bricks.some((b) => b.id === brickId))!;
        const activeBrickIndex = container.bricks.findIndex((b) => b.id === brickId)!;
        const activeBrick = container.bricks.find((b) => b.id === brickId)!;
        const nextBrick = container.bricks[activeBrickIndex + 1];
        const prevBrick = container.bricks[activeBrickIndex - 1];

        const minCol = prevBrick?.position.colStart ? prevBrick.position.colStart + 1 : isLeftHandle ? 1 : 2;
        const minColDelta = isLeftHandle
          ? -(activeBrick.position.colStart - minCol)
          : -(activeBrick.position.colEnd - minCol);

        const maxCol = nextBrick ? nextBrick.position.colEnd - 1 : GRID_COLS + 1;
        const maxColDelta = isLeftHandle
          ? maxCol - activeBrick.position.colStart
          : maxCol - activeBrick.position.colEnd;

        const resizeBy =
          resizingRef.current.resizeBy < 0
            ? Math.max(minColDelta, resizingRef.current.resizeBy)
            : Math.min(resizingRef.current.resizeBy, maxColDelta);

        if (isLeftHandle) {
          draft.updateContainer(container.id, {
            bricks: container.bricks.map((b, index) =>
              index === activeBrickIndex
                ? { ...b, position: { ...b.position, colStart: b.position.colStart + resizeBy } }
                : index === activeBrickIndex - 1
                  ? { ...b, position: { ...b.position, colEnd: b.position.colEnd + resizeBy } }
                  : b,
            ),
          });
        } else {
          draft.updateContainer(container.id, {
            bricks: container.bricks.map((b, index) =>
              index === activeBrickIndex
                ? { ...b, position: { ...b.position, colEnd: b.position.colEnd + resizeBy } }
                : index === activeBrickIndex + 1
                  ? { ...b, position: { ...b.position, colStart: b.position.colStart + resizeBy } }
                  : b,
            ),
          });
        }

        resizingRef.current = null;
        // save the changes
        draft.save();

        return;
      }

      // Normally, the draft is already up to date because it is updated during drag move
      // But just in case, we update the draft here if there is a diff between active and over
      if (over && over.id !== active.id) {
        if (active.data.current?.type === "container" && over?.data.current?.type === "container") {
          updateContainers(active, over);
        } else if (active.data.current?.type === "brick" && over?.data.current?.type === "brick") {
          updateBricks(active, over);
        }
        // save the changes
        draft.save();
      }
    },
    [containers, draft, unlock],
  );

  const handleDragMove = useCallback(
    (e: DragMoveEvent) => {
      const handleId = `${e.active.id}`;
      // only handle the drag move event for resize handles
      if (handleId.startsWith("resize-handle")) {
        const delta = e.delta.x;
        const brickId = handleId.replace(/resize-handle-(left|right)-/, "");
        const resizing = Math.round(delta / gridColSize);
        resizingRef.current = {
          brickId,
          resizeBy: resizing,
          handle: handleId.includes("left") ? "left" : "right",
        };
      }
    },
    [gridColSize],
  );

  const handleDragOver = (e: DragOverEvent) => {
    const { active, over } = e;

    if (!over) {
      return;
    }

    // e.activatorEvent?.stopPropagation();
    if (active.data.current?.type === "brick" && active.data.current?.type === over?.data.current?.type) {
      // update the activeElement rect by the overed element rect
      const overRect = (
        active.id === over.id
          ? over.rect
          : document.getElementById(over.id as string)?.getBoundingClientRect()
      ) as DOMRect;

      setActiveElement((prev) => {
        if (!prev) return prev;
        return {
          ...prev,
          rect: overRect,
        };
      });
    }
  };

  const updateBricks = useCallback(
    (active: Active, over: Over, temporary = false) => {
      const allBricks = containers.flatMap((ct) => ct.bricks);

      // find the container id of the active and over
      const activeContainer = containers.find((ct) => ct.bricks.some((b) => b.id === active.id));
      const overContainer = containers.find((ct) => ct.bricks.some((b) => b.id === over.id));

      // find active and over bricks
      const activeBrick = allBricks.find((b) => b.id === active.id);
      const overBrick = allBricks.find((b) => b.id === over.id);

      if (!overBrick || !activeBrick || !activeContainer || !overContainer) {
        console.log("could not find active or over brick or container");
        return;
      }

      // swap bricks
      const newContainers = containers.map((ct) => {
        if (ct.id === activeContainer.id || ct.id === overContainer.id) {
          return {
            ...ct,
            // switch the brick positions
            bricks: ct.bricks.map((b) =>
              b.id === active.id
                ? { ...overBrick, position: activeBrick.position }
                : b.id === over.id
                  ? {
                      ...activeBrick,
                      position: overBrick.position,
                      placeholder: temporary,
                    }
                  : b,
            ),
          };
        }

        return ct;
      });

      draft.setContainers(newContainers);
    },
    [containers, draft],
  );

  const updateContainers = useCallback(
    (active: Active, over: Over) => {
      if (active.id !== over.id) {
        const oldIndex = containers.findIndex((item) => item.id === active.id);
        const newIndex = containers.findIndex((item) => item.id === over.id);
        const newItems = arraySwap(containers, oldIndex, newIndex);
        draft.setContainers(newItems);
      }
    },
    [containers, draft],
  );

  const handleDragStart = (e: DragStartEvent) => {
    lock();
    if (!e.active.data.current) return;

    dragTypeRef.current = e.active.data.current.type;

    const el = document.getElementById(e.active.id as string);

    setActiveElement({
      type: e.active.data.current.type,
      id: e.active.id as string,
      rect: el?.getBoundingClientRect() as DOMRect,
      attributes: el?.dataset as Record<string, string>,
    });
  };

  const sortableIds = useMemo(() => {
    return [
      ...containers.map((ct) => ct.id),
      ...containers.flatMap((ct) => ct.bricks.map((b) => b.id)),
      ...containers.flatMap((ct) => ct.bricks.map((b) => `resize-handle-left-${b.id}`)),
      ...containers.flatMap((ct) => ct.bricks.map((b) => `resize-handle-right-${b.id}`)),
    ];
  }, [containers]);

  const detectCollisions: CollisionDetection = (props) => {
    const { droppableContainers, ...args } = props;
    const elligibaleDroppables = droppableContainers.filter(({ id }) =>
      id.toString().startsWith(dragTypeRef?.current || ""),
    );

    // First, let's see if there are any collisions with the pointer
    const pointerCollisions = pointerWithin({
      ...args,
      droppableContainers: elligibaleDroppables,
    });

    // Collision detection algorithms return an array of collisions
    if (pointerCollisions.length > 0) {
      return pointerCollisions;
    }

    const rectIntersectionCollisions = rectIntersection({
      ...args,
      droppableContainers: elligibaleDroppables,
    });

    // Collision detection algorithms return an array of collisions
    if (rectIntersectionCollisions.length > 0) {
      return rectIntersectionCollisions;
    }

    return [];
  };

  const strategy = useMemo(() => {
    return activeElement?.type === "container"
      ? verticalListSortingStrategy
      : activeElement?.type === "resize-handle"
        ? horizontalListSortingStrategy
        : rectSwappingStrategy;
  }, [activeElement]);

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={detectCollisions}
      autoScroll
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      onDragOver={handleDragOver}
      onDragMove={handleDragMove}
    >
      <SortableContext items={sortableIds} strategy={strategy}>
        <div
          id="page-container"
          data-upstart-theme={draft.previewTheme ?? draft.theme}
          className={tx("min-h-[100dvh] w-full max-w-full @container")}
        >
          <div
            id="page"
            ref={pageRef}
            className={tx(
              "max-sm:(flex flex-col gap-y-1) mx-auto w-full md:max-w-[90%] xl:max-w-screen-xl md:(grid grid-cols-12 grid-flow-row)",
            )}
          >
            <ContainerList containers={containers} />
          </div>
        </div>
        {createPortal(
          <DragOverlay
            className={dragTypeRef.current === "resize-handle" ? "transition-all duration-200" : undefined}
            dropAnimation={dragTypeRef.current === "resize-handle" ? { duration: 0 } : undefined}
            modifiers={
              activeElement?.type === "container"
                ? [restrictToVerticalAxis]
                : activeElement?.type === "brick"
                  ? []
                  : activeElement?.type === "resize-handle"
                    ? [restrictToHorizontalAxis, snapToGrid, restrictToBounds]
                    : undefined
            }
          >
            {activeElement?.type === "container" && (
              <Container
                container={getActiveElementData()?.container as BricksContainer}
                containerIndex={getActiveContainerIndex()}
                overlay
                style={{ height: `${activeElement.rect!.height}px`, width: `${activeElement.rect!.width}px` }}
              />
            )}
            {activeElement?.type === "brick" && (
              <BrickOverlay
                {...(getActiveElementData() as { brick: Brick; container: BricksContainer })}
                style={{
                  height: `${activeElement.rect!.height}px`,
                  minHeight: `${activeElement.rect!.height}px`,
                }}
              />
            )}
            {activeElement?.type === "resize-handle" && (
              <BrickResizeHandle
                overlay
                style={{ height: `${activeElement.rect!.height}px`, width: `${activeElement.rect!.width}px` }}
                handleType={activeElement.id.includes("left") ? "left" : "right"}
              />
            )}
          </DragOverlay>,
          document.body,
        )}
      </SortableContext>
    </DndContext>
  );
}
