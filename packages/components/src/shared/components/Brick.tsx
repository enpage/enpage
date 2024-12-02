import { forwardRef, memo, type ComponentProps } from "react";
import BaseBrick from "./BaseBrick";
import { useBrickWrapperStyle } from "../hooks/use-brick-style";
import type { Brick } from "@upstart.gg/sdk/shared/bricks";

const MemoBrickComponent = memo(BaseBrick);

type BrickWrapperProps = ComponentProps<"div"> & {
  brick: Brick;
};

const BrickWrapper = forwardRef<HTMLDivElement, BrickWrapperProps>(({ brick, className }, ref) => {
  const wrapperClass = useBrickWrapperStyle({ brick, editable: false, className });
  return (
    <div id={brick.id} className={wrapperClass} ref={ref}>
      <MemoBrickComponent brick={brick} />
    </div>
  );
});

const BrickWrapperMemo = memo(BrickWrapper);
export default BrickWrapperMemo;
