import { tx } from "@twind/core";
import { useCallback, useMemo, useRef, useState } from "react";
import type { Brick, BricksContainer } from "~/shared/bricks";
import Container, { ContainerList } from "./container";
import { useDraft, useEditorEnabled } from "./use-editor";
import { arraySwap, SortableContext, rectSwappingStrategy } from "@dnd-kit/sortable";
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
} from "@dnd-kit/core";
import { BrickOverlay } from "./brick";
import { createPortal } from "react-dom";

export default function Page(props: { bricks: BricksContainer[] }) {
  const editorEnabled = useEditorEnabled();
  const draft = useDraft();
  const sensors = [useSensor(PointerSensor)];
  const dragTypeRef = useRef<BricksContainer["type"] | Brick["type"]>("container");
  const [activeElement, setActiveElement] = useState<{ type: "container" | "brick"; id: string } | null>(
    null,
  );

  const containers = useMemo(() => {
    return editorEnabled ? draft.containers : props.bricks;
  }, [editorEnabled, props.bricks, draft.containers]);

  // const [activeContainerId, setActiveContainerId] = useState<string | null>(null);
  // const [activeBrickId, setActiveBrickId] = useState<string | null>(null);

  const getActiveElementData = useCallback(() => {
    if (!activeElement) {
      return null;
    }
    if (activeElement.type === "container") {
      return containers.find((ct) => ct.id === activeElement.id);
    }
    return containers.flatMap((ct) => ct.bricks).find((b) => b.props.id === activeElement.id);
  }, [activeElement, containers]);

  const handleDragEnd = (props: DragEndEvent) => {
    const { active, over } = props;
    if (!over || over.id === active.id) return;
    console.log("drag end", active, over);
    setActiveElement(null);
    if (active.data.current?.type === "container" && over?.data.current?.type === "container") {
      updateContainers(active, over);
    } else if (active.data.current?.type === "brick") {
    }
  };

  const handleDragOver = (e: DragOverEvent) => {
    const { active, over } = e;
    if (!over || over.id === active.id) return;
    console.log("drag over", e);
    // e.activatorEvent?.stopPropagation();
    if (active.data.current?.type === "container" && over?.data.current?.type === "container") {
      console.log("updating containers");
      updateContainers(active, over);
    }
  };

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
    console.log("drag start", e);
    if (e.active.data.current?.type === "container") {
      dragTypeRef.current = "container";
      setActiveElement({
        type: "container",
        id: e.active.id as string,
      });
    } else if (e.active.data.current?.type === "brick") {
      dragTypeRef.current = "brick";
      setActiveElement({
        type: "brick",
        id: e.active.id as string,
      });
    }
  };

  const sortableIds = useMemo(() => {
    return [
      ...containers.map((ct) => ct.id),
      ...containers.flatMap((ct) => ct.bricks.map((b) => b.props.id)),
    ];
  }, [containers]);

  // const sortableContainers = useMemo(() => {
  //   return containers.map((ct) => ct.id);
  // }, [containers]);

  // const sortableBrikcs = useMemo(() => {
  //   return containers.flatMap((ct) => ct.bricks.map((b) => b.props.id));
  // }, [containers]);

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

    // Compute other collisions
    return closestCorners({
      ...args,
      droppableContainers: elligibaleDroppables,
    });
  };

  return (
    // DndContext ofr the containers
    <DndContext
      sensors={sensors}
      collisionDetection={detectCollisions}
      // collisionDetection={closestCorners}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      onDragOver={handleDragOver}
    >
      <SortableContext items={sortableIds} strategy={rectSwappingStrategy}>
        <div
          className={tx(
            "mt-5 mx-auto flex flex-col gap-2 w-full md:max-w-[90%] xl:max-w-screen-lg transition-all duration-200",
          )}
        >
          <ContainerList containers={containers} />
        </div>
        {/* <p className={tx("mx-auto p-4")}>activeElement: {activeElement?.id}</p> */}
        {createPortal(
          <DragOverlay>
            {activeElement?.type === "container" && (
              <Container {...(getActiveElementData() as BricksContainer)} dragging={true} />
            )}
            {activeElement?.type === "brick" && <BrickOverlay {...(getActiveElementData() as Brick)} />}
          </DragOverlay>,
          document.body,
        )}
      </SortableContext>
    </DndContext>
  );
}
