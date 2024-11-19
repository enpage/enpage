import type { Brick } from "@enpage/sdk/shared/bricks";
import { forwardRef, memo, type ComponentProps } from "react";
import BaseBrick from "./BaseBrick";
import { useBrickWrapperStyle } from "~/bricks/hooks/use-brick-style";

const MemoBrickComponent = memo(BaseBrick);

type BrickWrapperProps = ComponentProps<"div"> & {
  brick: Brick;
};

const BrickWrapper = forwardRef<HTMLDivElement, BrickWrapperProps>(({ brick, className }, ref) => {
  const wrapperClass = useBrickWrapperStyle({ brick, editable: true, className });
  return (
    <div id={brick.id} className={wrapperClass} ref={ref}>
      <MemoBrickComponent brick={brick} />
    </div>
  );
});

const BrickWrapperMemo = memo(BrickWrapper);
export default BrickWrapperMemo;
