import { tx } from "@twind/core";
import { useCallback, useMemo, useRef, useState } from "react";
import type { Brick, BricksContainer } from "~/shared/bricks";
import Container, { ContainerList } from "./container";
import { useDraft, useEditorEnabled } from "./use-editor";
import {
  arraySwap,
  SortableContext,
  rectSwappingStrategy,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import {
  closestCenter,
  DndContext,
  DragOverlay,
  PointerSensor,
  useSensor,
  type DragStartEvent,
  type Active,
  type DragOverEvent,
  type Over,
  type DragEndEvent,
  closestCorners,
  type CollisionDetection,
  pointerWithin,
  rectIntersection,
  MeasuringFrequency,
  MeasuringStrategy,
} from "@dnd-kit/core";
import { BrickOverlay } from "./brick";
import { createPortal } from "react-dom";
import { useHotkeys } from "react-hotkeys-hook";

export default function Page(props: { bricks: BricksContainer[] }) {
  const editorEnabled = useEditorEnabled();
  const draft = useDraft();

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
  const dragTypeRef = useRef<BricksContainer["type"] | Brick["type"]>("container");
  const [activeElement, setActiveElement] = useState<{
    type: "container" | "brick";
    id: string;
    rect: DOMRect;
  } | null>(null);

  const containers = useMemo(() => {
    return editorEnabled ? draft.containers : props.bricks;
  }, [editorEnabled, props.bricks, draft.containers]);

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

  const handleDragEnd = (props: DragEndEvent) => {
    const { active, over } = props;
    setActiveElement(null);

    // Normally, the draft is already up to date because it is updated during drag move
    // But just in case, we update the draft here if there is a diff between active and over
    if (over && over.id !== active.id) {
      if (active.data.current?.type === "container" && over?.data.current?.type === "container") {
        updateContainers(active, over);
      } else if (active.data.current?.type === "brick" && over?.data.current?.type === "brick") {
        updateBricks(active, over);
      }
    }
    // save the changes
    draft.save();
  };

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
            bricks: ct.bricks.map((b) =>
              b.id === active.id
                ? overBrick
                : b.id === over.id
                  ? {
                      ...activeBrick,
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
    if (!e.active.data.current) return;
    const rect = document.getElementById(e.active.id as string)?.getBoundingClientRect() as DOMRect;
    dragTypeRef.current = e.active.data.current.type;
    setActiveElement({
      type: e.active.data.current.type,
      id: e.active.id as string,
      rect,
    });
  };

  const sortableIds = useMemo(() => {
    return [...containers.map((ct) => ct.id), ...containers.flatMap((ct) => ct.bricks.map((b) => b.id))];
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

  return (
    // DndContext ofr the containers
    <DndContext
      sensors={sensors}
      collisionDetection={detectCollisions}
      autoScroll
      // collisionDetection={closestCorners}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      onDragOver={handleDragOver}
    >
      <SortableContext
        items={sortableIds}
        strategy={activeElement?.type === "container" ? verticalListSortingStrategy : rectSwappingStrategy}
      >
        <div
          className={tx(
            "mt-5 mx-auto grid w-full md:max-w-[90%] xl:max-w-screen-xl transition-all duration-200",
            {
              "gap-y-1": activeElement?.type === "container",
            },
          )}
          style={{
            gridTemplateColumns: "repeat(12, 1fr)",
            gridTemplateRows: `repeat(${containers.length}, fit-content())`,
            gridAutoFlow: "row",
          }}
        >
          <ContainerList containers={containers} />
        </div>
        {/* <p className={tx("mx-auto p-4")}>activeElement: {JSON.stringify(activeElement)}</p> */}
        {/* <pre>{JSON.stringify(draft.containers, null, 2)}</pre> */}
        {createPortal(
          <DragOverlay>
            {activeElement?.type === "container" && (
              <Container
                container={getActiveElementData()?.container as BricksContainer}
                containerIndex={getActiveContainerIndex()}
                overlay={true}
                style={{ height: `${activeElement.rect.height}px`, width: `${activeElement.rect.width}px` }}
              />
            )}
            {activeElement?.type === "brick" && (
              <BrickOverlay {...(getActiveElementData() as { brick: Brick; container: BricksContainer })} />
            )}
          </DragOverlay>,
          document.body,
        )}
      </SortableContext>
    </DndContext>
  );
}
