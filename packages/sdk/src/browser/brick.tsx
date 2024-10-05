import type { Brick } from "~/shared/bricks";
import {
  lazy,
  memo,
  Suspense,
  type ComponentProps,
  type ComponentType,
  type LazyExoticComponent,
} from "react";
import { CSS } from "@dnd-kit/utilities";
import { useDraggable } from "@dnd-kit/core";
import { useSortable } from "@dnd-kit/sortable";
import { tx } from "@twind/core";

const BrickComponent = ({ type, props }: Brick & { overlay?: boolean }) => {
  // biome-ignore lint/suspicious/noExplicitAny: <explanation>
  let BrickModule: LazyExoticComponent<ComponentType<any>>;
  switch (type) {
    case "text":
      BrickModule = lazy(() => import(`./bricks/text`));
      break;
    case "image":
      BrickModule = lazy(() => import(`./bricks/image`));
      break;
    case "text-with-title":
      BrickModule = lazy(() => import(`./bricks/text-with-title`));
      break;
    default:
      return <></>;
  }
  return (
    <Suspense>
      <BrickModule {...props} />
    </Suspense>
  );
};

const MemoBrickComponent = memo(BrickComponent);

export default function DragabbleBrickWrapper({
  type,
  props,
  ...wrapperAttrs
}: Brick & ComponentProps<"div">) {
  const { setNodeRef, attributes, listeners, transform, over, active } = useSortable({
    id: props.id,
    data: { type: "brick" },
  });
  const style =
    over?.data.current?.type !== "container"
      ? {
          transform: CSS.Transform.toString(transform ? { ...transform, scaleX: 1, scaleY: 1 } : null),
        }
      : {};

  return (
    <div ref={setNodeRef} style={style} {...wrapperAttrs} {...listeners} {...attributes}>
      <MemoBrickComponent type={type} props={props} />
    </div>
  );
}

export function BrickOverlay({ type, props }: Brick) {
  return (
    <div className={tx("shadow bg-primary-100")}>
      <MemoBrickComponent type={type} props={props} />
    </div>
  );
}
