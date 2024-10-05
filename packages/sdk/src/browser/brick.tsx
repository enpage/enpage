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

function DragabbleBrickWrapper({ type, props, ...wrapperAttrs }: Brick & ComponentProps<"div">) {
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
    <div ref={setNodeRef} id={props.id} style={style} {...wrapperAttrs} {...listeners} {...attributes}>
      <MemoBrickComponent type={type} props={props} />
    </div>
  );
}

export default memo(DragabbleBrickWrapper);

export function BrickPlaceholder({ type, props, ...attrs }: ComponentProps<"div"> & Brick) {
  return (
    <div
      className={tx(
        "rounded overflow-hidden bg-primary-100 z-[9999] ring ring-primary-500 ring-opacity-80 ring-offset-3 shadow-lg bg-primary-500 bg-opacity-50",
      )}
      {...attrs}
    />
  );
}

export function BrickOverlay({ type, props, ...attrs }: ComponentProps<"div"> & Brick) {
  return (
    <div
      className={tx(
        "rounded overflow-hidden bg-primary-100 z-[9999] ring ring-primary-500 ring-opacity-80 ring-offset-3 shadow-lg bg-primary-500 bg-opacity-50",
      )}
      {...attrs}
    >
      <MemoBrickComponent type={type} props={props} />
    </div>
  );
}
